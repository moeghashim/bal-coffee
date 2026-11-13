import { ReactNode } from "react";
import { Grain } from "components/bal/grain";

export function EventFrame({
  kicker,
  title,
  lede,
  wide = false,
  children,
}: {
  kicker: string;
  title: string;
  lede?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <header className="bal-event-bar">
        <a href="/" className="bal-event-logo" aria-label="BAL Coffee — home">
          <span className="serif">BAL</span>
          <span className="mono">coffee</span>
        </a>
        <p className="mono bal-event-kicker">{kicker}</p>
      </header>
      <main className={wide ? "bal-event bal-event-wide" : "bal-event"}>
        <h1 className="serif">{title}</h1>
        {lede ? <p className="bal-event-lede">{lede}</p> : null}
        {children}
      </main>
      <Grain />
    </>
  );
}
