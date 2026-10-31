"use client";

import { Children, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PROFILE, type SiteData } from "@/lib/data";

export const ASCII = [
  "██╗    ██╗ █████╗ ███████╗ █████╗ ████████╗██╗  ██╗",
  "██║    ██║██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║  ██║",
  "██║ █╗ ██║███████║███████╗███████║   ██║   ███████║",
  "██║███╗██║██╔══██║╚════██║██╔══██║   ██║   ██╔══██║",
  "╚███╔███╔╝██║  ██║███████║██║  ██║   ██║   ██║  ██║",
  " ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝",
];

export function A({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  );
}

/** Clickable command chip: runs the command as if it had been typed. */
export function Cmd({ run, c, label }: { run: (cmd: string) => void; c: string; label?: string }) {
  return (
    <button type="button" className="cmd chip" onClick={(e) => { e.stopPropagation(); run(c); }}>
      {label ?? c}
    </button>
  );
}

/** Children fade in one after another via the --i delay variable. */
export function Stagger({ children }: { children: ReactNode }) {
  return (
    <>
      {Children.toArray(children).map((child, i) => (
        <div className="ln" style={{ "--i": Math.min(i, 40) } as CSSProperties} key={i}>
          {child}
        </div>
      ))}
    </>
  );
}

/** Reveals `lines` one by one. Purely cosmetic; screen readers get the full text at once. */
export function Typed({ lines, interval = 120, onDone }: { lines: ReactNode[]; interval?: number; onDone?: () => void }) {
  const [n, setN] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  useEffect(() => {
    if (n >= lines.length) {
      doneRef.current?.();
      return;
    }
    const t = setTimeout(() => setN((v) => v + 1), interval);
    return () => clearTimeout(t);
  }, [n, lines.length, interval]);
  return (
    <>
      {lines.slice(0, n).map((l, i) => (
        <div className="ln" style={{ "--i": 0 } as CSSProperties} key={i}>{l}</div>
      ))}
    </>
  );
}

export function Banner() {
  return (
    <div className="banner">
      <br />
      <pre className="ascii glow-text" aria-label={PROFILE.name}>
        {ASCII.map((l, i) => (
          <span key={i} style={{ "--i": i } as CSSProperties}>{l}</span>
        ))}
      </pre>
      <br />
      <div className="ln" style={{ "--i": 7 } as CSSProperties}>
        Welcome to <b className="accent">Wasath&apos;s Terminal</b> v2.0 · {PROFILE.title}
      </div>
      <div className="ln" style={{ "--i": 8 } as CSSProperties}>
        Type <span className="cmd">help</span> for all commands, or try{" "}
        <span className="cmd">about</span> · <span className="cmd">projects</span> · <span className="cmd">skills</span>.
      </div>
      <div className="ln dim" style={{ "--i": 9 } as CSSProperties}>
        Source: <A href={PROFILE.repo}>github.com/WasathTheekshana/wasaths-terminal</A>
      </div>
      <br />
    </div>
  );
}

function Uptime() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setS((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(s / 60);
  return <>{m ? `${m}m ` : ""}{s % 60}s</>;
}

export function Neofetch({ data, theme }: { data: SiteData; theme: string }) {
  const rows: [string, ReactNode][] = [
    ["OS", "Wasath.x64_x86"],
    ["Host", PROFILE.location],
    ["Role", PROFILE.title],
    ["Uptime", <Uptime key="u" />],
    ["Shell", "wsh 2.0 (Next.js 16 · React 19)"],
    ["Cloud", "Azure · Terraform · AKS"],
    ["Langs", "TypeScript · Go · Python · Rust"],
    ["GitHub", data.publicRepos ? `${data.publicRepos} repos · ${data.followers ?? 0} followers` : "github/WasathTheekshana"],
    ["Theme", theme],
  ];
  return (
    <div className="neofetch ln" style={{ "--i": 0 } as CSSProperties}>
      <pre className="ascii glow-text logo">{ASCII.join("\n")}</pre>
      <div className="info">
        <div><b className="accent">guest</b>@<b className="accent">wasath</b></div>
        <div className="dim">{"─".repeat(14)}</div>
        {rows.map(([k, v]) => (
          <div key={k}><b className="accent">{k}</b>: {v}</div>
        ))}
        <div className="palette" aria-hidden>
          {["--prompt-1", "--accent", "--cmd", "--out", "--link", "--fg"].map((v) => (
            <i key={v} style={{ background: `var(${v})` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Hack() {
  const [done, setDone] = useState(false);
  return (
    <div>
      <Typed
        interval={350}
        onDone={() => setTimeout(() => setDone(true), 1400)}
        lines={[
          "Initiating breach of mainframe.gov ...",
          <span key="p" className="progress"><i /></span>,
          "Bypassing firewall ... done",
          "Escalating privileges ... done",
        ]}
      />
      {done ? (
        <div className="ln" style={{ "--i": 0 } as CSSProperties}>
          Just kidding. I&apos;m a DevOps engineer; the only thing I break is <span className="cmd">terraform destroy</span>.
        </div>
      ) : null}
    </div>
  );
}
