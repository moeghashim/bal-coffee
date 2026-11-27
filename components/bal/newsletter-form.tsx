"use client";

import { FormEvent, useRef, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const website = String(data.get("website") ?? "");

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, website }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };
      if (payload.ok) {
        setStatus("success");
        setMessage(payload.message || "Thanks — you're subscribed.");
        form.reset();
        return;
      }
      setStatus("error");
      setMessage(payload.message || "Something went wrong. Please try again.");
      emailRef.current?.focus();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
      emailRef.current?.focus();
    }
  };

  const describedBy = message ? "newsletter-status" : undefined;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        border: "1px solid rgba(238,216,185,0.22)",
        borderRadius: 8,
        overflow: "hidden",
        background: "rgba(255,246,231,0.05)",
        position: "relative",
      }}
    >
      <label
        htmlFor="newsletter-email"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        Email address
      </label>
      <div
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
        aria-hidden="true"
      >
        <label htmlFor="newsletter-website">Website</label>
        <input
          id="newsletter-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input
        ref={emailRef}
        id="newsletter-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Enter your email"
        aria-invalid={status === "error"}
        aria-describedby={describedBy}
        disabled={status === "loading"}
        style={{
          border: "none",
          outline: "none",
          padding: "12px 14px",
          fontSize: 13.5,
          background: "transparent",
          color: "#f1d9b6",
        }}
      />
      <button
        type="submit"
        className="mono"
        disabled={status === "loading"}
        aria-busy={status === "loading"}
        style={{
          padding: "12px 20px",
          background: "#77783a",
          color: "#fff4e8",
          fontSize: 11,
          letterSpacing: 0,
          borderRadius: 0,
          opacity: status === "loading" ? 0.7 : 1,
        }}
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      <p
        id="newsletter-status"
        role="status"
        aria-live="polite"
        style={{
          gridColumn: "1 / -1",
          margin: 0,
          padding: message ? "8px 14px 10px" : 0,
          fontSize: 12.5,
          lineHeight: 1.45,
          color: status === "error" ? "#f3c1a3" : "#d0b890",
        }}
      >
        {message}
      </p>
    </form>
  );
}
