"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatUsPhone } from "lib/event/phone";

type BoardOrder = {
  id: string;
  number: string;
  name: string;
  phone: string;
  consent: boolean;
  drinks: { title: string; variant?: string; quantity: number }[];
  status: "new" | "making" | "ready";
  smsSent: boolean;
  smsError: string | null;
  createdAt: string;
};

const STATUS_LABEL = {
  new: "New",
  making: "Making",
  ready: "Ready",
} as const;

export function EventBoard() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orders, setOrders] = useState<BoardOrder[]>([]);
  const [durable, setDurable] = useState(true);
  const [listError, setListError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/event/board/orders", {
      cache: "no-store",
    });
    if (response.status === 401 || response.status === 503) {
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      setAuthed(false);
      setLoginError(response.status === 503 ? payload?.error || "" : "");
      return;
    }
    const payload = (await response.json().catch(() => null)) as {
      orders?: BoardOrder[];
      durable?: boolean;
      error?: string;
    } | null;
    if (!response.ok) {
      setListError(payload?.error || "Could not load orders.");
      setAuthed(true);
      return;
    }
    setAuthed(true);
    setLoginError("");
    setListError("");
    setDurable(payload?.durable !== false);
    setOrders(payload?.orders ?? []);
  }

  useEffect(() => {
    let timer = 0;
    void load();
    timer = window.setInterval(() => void load(), 5000);
    return () => window.clearInterval(timer);
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoginError("");
    const response = await fetch("/api/event/board/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    if (!response.ok) {
      setLoginError(payload?.error || "Wrong passcode.");
      return;
    }
    setPasscode("");
    await load();
  }

  async function logout() {
    await fetch("/api/event/board/session", { method: "DELETE" });
    setAuthed(false);
    setOrders([]);
  }

  async function act(id: string, action: "making" | "ready") {
    setPendingId(id);
    setListError("");
    try {
      const response = await fetch("/api/event/board/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const payload = (await response.json().catch(() => null)) as {
        order?: BoardOrder;
        error?: string;
      } | null;
      if (payload?.order) {
        setOrders((current) =>
          current.map((order) => (order.id === id ? payload.order! : order)),
        );
      }
      if (!response.ok) {
        setListError(payload?.error || "Could not update that order.");
      }
    } finally {
      setPendingId(null);
    }
  }

  if (authed !== true) {
    return (
      <form className="bal-event-login" onSubmit={login}>
        <label className="bal-event-field">
          Passcode
          <input
            type="password"
            autoComplete="off"
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            required
          />
        </label>
        {loginError ? (
          <p className="bal-event-error" role="alert">
            {loginError}
          </p>
        ) : null}
        <button className="bal-event-button" type="submit">
          Open the board
        </button>
      </form>
    );
  }

  return (
    <div>
      <div className="bal-event-board-tools">
        <p>Newest at the bottom. This list refreshes every few seconds.</p>
        <button type="button" onClick={() => void logout()}>
          Lock
        </button>
      </div>
      {!durable ? (
        <p className="bal-event-banner" role="status">
          Orders are only in this server’s memory. Connect Upstash Redis before
          the event or paid orders will not show up here.
        </p>
      ) : null}
      {listError ? (
        <p className="bal-event-error" role="alert">
          {listError}
        </p>
      ) : null}
      {orders.length === 0 ? (
        <p className="bal-event-empty">No paid event orders yet.</p>
      ) : (
        <ol className="bal-event-board-list">
          {orders.map((order) => (
            <li key={order.id} className={`is-${order.status}`}>
              <div className="bal-event-board-top">
                <p className="serif bal-event-number">#{order.number}</p>
                <p className={`bal-event-pill is-${order.status}`}>
                  {STATUS_LABEL[order.status]}
                </p>
              </div>
              <p className="bal-event-board-name">{order.name}</p>
              <p className="bal-event-board-phone">
                <a href={`tel:${order.phone}`}>{formatUsPhone(order.phone)}</a>
              </p>
              <ul className="bal-event-lines">
                {order.drinks.length === 0 ? (
                  <li>No line items</li>
                ) : (
                  order.drinks.map((drink, index) => (
                    <li key={`${drink.title}-${index}`}>
                      {drink.quantity} × {drink.title}
                      {drink.variant ? ` — ${drink.variant}` : ""}
                    </li>
                  ))
                )}
              </ul>
              <p className="bal-event-sms">
                {order.smsSent
                  ? "Text sent"
                  : order.smsError === "no_consent"
                    ? "No text — they did not opt in"
                    : order.smsError
                      ? order.smsError
                      : order.consent
                        ? "Text when ready"
                        : "No text opt-in"}
              </p>
              <div className="bal-event-actions">
                <button
                  type="button"
                  disabled={pendingId === order.id || order.status !== "new"}
                  onClick={() => void act(order.id, "making")}
                >
                  Making
                </button>
                <button
                  type="button"
                  className="is-ready"
                  disabled={pendingId === order.id || order.status === "ready"}
                  onClick={() => void act(order.id, "ready")}
                >
                  Ready
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
