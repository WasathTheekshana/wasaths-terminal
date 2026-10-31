"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { ARG_COMPLETIONS, COMMAND_MAP, COMPLETABLE, suggest, type Ctx } from "@/lib/commands";
import { PROFILE, type SiteData } from "@/lib/data";
import { DEFAULT_THEME, isTheme, type ThemeId } from "@/lib/themes";
import { A, Banner, Typed } from "./blocks";

const MatrixRain = dynamic(() => import("./MatrixRain"), { ssr: false });

const SUDO_PASSWORD = "bitch";
const BOOT_LINES = [
  "[  OK  ] Starting Wasath.x64_x86 kernel",
  "[  OK  ] Mounting /home/guest",
  "[  OK  ] Loaded profile: DevOps · Cloud · Security",
  "[  OK  ] Reached github.com/WasathTheekshana",
  "[  OK  ] Started terraform-apply.service",
  "[  OK  ] Reached target Portfolio",
];
const BARE_QUIPS: Record<string, string> = {
  banner: "WebShell v1.0.0",
  help: "maybe restarting your browser will fix this. (or type 'reboot')",
  whoami: "guest",
  about: "Nothing to see here.",
  projects: "I don't want you to break the other projects.",
  sudo: "no.",
  ls: " ",
  rm: "don't try again.",
};

type Entry = { id: number; prompt?: string; node: ReactNode };

function store(key: string, value?: string): string | null {
  try {
    if (value === undefined) return localStorage.getItem(key);
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked: the terminal works without persistence */
  }
  return null;
}

function Prompt({ bare }: { bare?: boolean }) {
  return (
    <span className="prompt">
      <span className="p1">guest</span>
      <span className="pd">@</span>
      <span className="p2">{bare ? "localhost" : PROFILE.handle}</span>
      <span className="pd">:$ ~</span>
    </span>
  );
}

function Clock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t}</span>;
}

export default function Terminal({ data }: { data: SiteData }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const [caret, setCaret] = useState(0);
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);
  const [fx, setFxState] = useState(true);
  const [bare, setBare] = useState(false);
  const [sudo, setSudo] = useState(false);
  const [password, setPassword] = useState(false);
  const [booting, setBooting] = useState(false);
  const [shake, setShake] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const history = useRef<string[]>([]);
  const histIdx = useRef(0);
  const draft = useRef("");
  const attempts = useRef(0);
  const frame = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const execRef = useRef<(raw: string) => void>(() => {});

  const push = useCallback((node: ReactNode, prompt?: string) => {
    setEntries((e) => [...e, { id: idRef.current++, prompt, node }]);
  }, []);

  // Restore preferences before first paint so the rain canvas reads the right colours.
  useLayoutEffect(() => {
    const saved = store("wt-theme");
    if (isTheme(saved)) setThemeState(saved);
    if (store("wt-fx") === "off") setFxState(false);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Boot once per session, then the banner.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    try {
      history.current = JSON.parse(store("wt-history") ?? "[]").slice(-100);
    } catch {
      history.current = [];
    }
    histIdx.current = history.current.length;

    let seen = false;
    try { seen = sessionStorage.getItem("wt-booted") === "1"; } catch { /* ignore */ }
    if (seen) {
      push(<Banner />);
    } else {
      try { sessionStorage.setItem("wt-booted", "1"); } catch { /* ignore */ }
      setBooting(true);
      push(<Typed lines={BOOT_LINES} interval={110} onDone={finishBoot} />);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bootDone = useRef(false);
  function finishBoot() {
    if (bootDone.current) return;
    bootDone.current = true;
    setBooting(false);
    push(<Banner />);
  }

  // Any key during boot skips straight to the banner.
  useEffect(() => {
    if (!booting) return;
    const skip = () => {
      setEntries([]);
      finishBoot();
    };
    window.addEventListener("keydown", skip, { once: true });
    return () => window.removeEventListener("keydown", skip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booting]);

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, value]);

  // Cursor-follow glow, written straight to CSS vars so React never re-renders for it.
  useEffect(() => {
    const el = frame.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${e.clientX}px`);
        el.style.setProperty("--my", `${e.clientY}px`);
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  // Hint for the curious, as in the original.
  useEffect(() => {
    console.log("%cThere is a root password hiding in this terminal. Try `cat .secret` then `sudo`.", "color:#f1c42c;font-size:14px");
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    store("wt-theme", id);
  }, []);
  const setFx = useCallback((on: boolean) => {
    setFxState(on);
    store("wt-fx", on ? "on" : "off");
  }, []);

  const execute = useCallback(
    (raw: string, echo = true) => {
      const line = raw.trim();
      if (echo) push(<span className="out">{raw}</span>, "p");
      if (!line) return;

      const [name, ...args] = line.split(/\s+/);
      const key = name.toLowerCase();

      const ctx: Ctx = {
        data,
        theme,
        fx,
        bare,
        sudo,
        history: history.current,
        run: (c) => execRef.current(c),
        clear: () => setEntries([]),
        setTheme,
        setFx,
        askPassword: () => {
          attempts.current = 0;
          setPassword(true);
          setValue("");
        },
        destroy: () => {
          push(
            <Typed
              interval={180}
              lines={["rm: removing 'src/' ...", "rm: removing 'src/app/' ...", "rm: removing 'src/components/' ...", "rm: removing 'src/lib/' ..."]}
              onDone={() => {
                setShake(true);
                setTimeout(() => {
                  setShake(false);
                  setBare(true);
                  setEntries([]);
                  setTimeout(() => push("What made you think that was a good idea?"), 200);
                  setTimeout(() => push("Now everything is ruined. (type 'reboot' to fix it)"), 1200);
                }, 900);
              }}
            />,
          );
        },
        reboot: () => {
          setBare(false);
          setSudo(false);
          setEntries([]);
          push(<Banner />);
        },
      };

      if (bare && key !== "reboot" && key !== "clear") {
        push(BARE_QUIPS[key] ?? "type 'help'");
        return;
      }

      const cmd = COMMAND_MAP.get(key);
      if (!cmd) {
        const hint = suggest(key);
        push(
          <>
            <br />
            COMMAND NOT FOUND: <b>{key}</b>
            {hint ? <> · did you mean <span className="cmd chip" role="button" onClick={() => execRef.current(hint)}>{hint}</span>?</> : null}
            <br />
            Type <span className="cmd">help</span> to get started.
            <br />
          </>,
        );
        return;
      }
      const node = cmd.run(args, ctx);
      if (node) push(node);
    },
    [bare, data, fx, push, setFx, setTheme, sudo, theme],
  );
  // Output rendered earlier (chips, suggestions) always calls the latest closure, never stale state.
  execRef.current = execute;

  function submit() {
    const raw = value;
    setValue("");
    setCaret(0);

    if (password) {
      if (raw === SUDO_PASSWORD) {
        setPassword(false);
        setSudo(true);
        push(<>PERMISSION GRANTED. Try <span className="cmd">rm -rf src</span> (or <span className="cmd">ls</span> first)</>);
      } else if (++attempts.current >= 3) {
        setPassword(false);
        push(<>INCORRECT PASSWORD.<br />PERMISSION NOT GRANTED.</>);
      } else {
        push("Sorry, try again.");
      }
      return;
    }

    if (raw.trim()) {
      if (history.current[history.current.length - 1] !== raw) history.current.push(raw);
      history.current = history.current.slice(-100);
      store("wt-history", JSON.stringify(history.current));
    }
    histIdx.current = history.current.length;
    draft.current = "";
    execute(raw);
  }

  function complete() {
    const parts = value.split(/\s+/);
    const last = parts[parts.length - 1].toLowerCase();
    const pool = parts.length === 1 ? COMPLETABLE : ARG_COMPLETIONS[parts[0].toLowerCase()] ?? [];
    const hits = pool.filter((c) => c.startsWith(last));
    if (!hits.length) return;
    if (hits.length === 1) {
      const next = [...parts.slice(0, -1), hits[0]].join(" ") + " ";
      setValue(next);
      setCaret(next.length);
      return;
    }
    push(<span className="out">{value}</span>, "p");
    push(<div className="ls">{hits.map((h) => <span key={h}>{h}</span>)}</div>);
    let common = hits[0];
    for (const h of hits) while (!h.startsWith(common)) common = common.slice(0, -1);
    const next = [...parts.slice(0, -1), common].join(" ");
    setValue(next);
    setCaret(next.length);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setEntries([]);
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      if (password) setPassword(false);
      push(<span className="out">{password ? "" : value}^C</span>, "p");
      setValue("");
      setCaret(0);
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "u") {
      e.preventDefault();
      setValue("");
      setCaret(0);
      return;
    }
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        submit();
        break;
      case "Escape":
        setValue("");
        setCaret(0);
        break;
      case "Tab":
        e.preventDefault();
        if (!password) complete();
        break;
      case "ArrowRight": {
        const ghost = ghostText;
        if (ghost && caret === value.length) {
          e.preventDefault();
          const next = value + ghost;
          setValue(next);
          setCaret(next.length);
        }
        break;
      }
      case "ArrowUp":
        e.preventDefault();
        if (password || histIdx.current === 0) break;
        if (histIdx.current === history.current.length) draft.current = value;
        histIdx.current -= 1;
        setValue(history.current[histIdx.current]);
        setCaret(history.current[histIdx.current].length);
        break;
      case "ArrowDown": {
        e.preventDefault();
        if (password || histIdx.current >= history.current.length) break;
        histIdx.current += 1;
        const v = histIdx.current === history.current.length ? draft.current : history.current[histIdx.current];
        setValue(v);
        setCaret(v.length);
        break;
      }
    }
  }

  // Inline suggestion in dim text after the caret: newest history match, else a command name.
  const ghostText = useMemo(() => {
    if (password || !value || value.includes(" ")) {
      if (password || !value) return "";
      const hit = [...history.current].reverse().find((h) => h.startsWith(value) && h !== value);
      return hit ? hit.slice(value.length) : "";
    }
    const hit = [...history.current].reverse().find((h) => h.startsWith(value) && h !== value) ?? COMPLETABLE.find((c) => c.startsWith(value.toLowerCase()) && c !== value);
    return hit ? hit.slice(value.length) : "";
  }, [value, password]);

  const shown = password ? "•".repeat(value.length) : value;
  const before = shown.slice(0, caret);
  const at = shown[caret] ?? " ";
  const after = shown.slice(caret + 1);

  const focusInput = () => {
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus({ preventScroll: true });
  };

  const quick = ["help", "about", "projects", "skills", "experience", "contact", "theme"];

  return (
    <div
      ref={frame}
      className={`frame${bare ? " bare" : ""}${shake ? " shake" : ""}${fx ? "" : " nofx"}`}
      onClick={focusInput}
    >
      {fx && !bare ? <MatrixRain theme={theme} /> : null}
      <main className="win">
        {!bare ? (
          <header className="bars" aria-hidden>
            <div className="bar-1">
              <span>Wasath.x64_x86</span>
              <span className="bar-meta">{PROFILE.location}</span>
            </div>
            <div className="bar-2" />
            <div className="bar-3" />
            <div className="bar-4" />
            <div className="bar-5" />
          </header>
        ) : null}

        <div className="body" ref={bodyRef} role="log" aria-live="polite" aria-label="Terminal output">
          {entries.map((en) => (
            <div className="entry" key={en.id}>
              {en.prompt ? (
                <div className="line">
                  <Prompt bare={bare} /> {en.node}
                </div>
              ) : (
                en.node
              )}
            </div>
          ))}

          {!booting ? (
            <div className="line input-line">
              {password ? <span className="pw">Password:&nbsp;</span> : <Prompt bare={bare} />}{" "}
              <span className="typed" style={{ "--len": shown.length } as CSSProperties}>
                <span>{before}</span>
                <span className="caret">{at}</span>
                <span>{after}</span>
                {caret === value.length ? <span className="ghost">{ghostText}</span> : null}
              </span>
              <input
                ref={inputRef}
                className="hidden-input"
                value={value}
                autoFocus
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                enterKeyHint="go"
                aria-label={password ? "Password" : "Terminal command"}
                type={password ? "password" : "text"}
                onChange={(e) => {
                  setValue(e.target.value);
                  setCaret(e.target.selectionStart ?? e.target.value.length);
                }}
                onSelect={(e) => setCaret(e.currentTarget.selectionStart ?? 0)}
                onKeyDown={onKeyDown}
              />
            </div>
          ) : null}
        </div>

        {!bare ? (
          <footer className="dock">
            <nav className="chips" aria-label="Quick commands">
              {quick.map((q) => (
                <button key={q} type="button" className="chip cmd" onClick={(e) => { e.stopPropagation(); if (!booting) execute(q); }}>
                  {q}
                </button>
              ))}
            </nav>
            <div className="status">
              <span className="s-left">● {sudo ? "root" : "guest"}</span>
              <span className="s-mid">{theme}{fx ? "" : " · fx off"}</span>
              <span className="s-right">
                <A href={PROFILE.repo}>v2.0</A> · <Clock />
              </span>
            </div>
          </footer>
        ) : null}
      </main>
    </div>
  );
}
