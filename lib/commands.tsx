import { Children, type CSSProperties, type ReactNode } from "react";
import {
  EDUCATION,
  EXPERIENCE,
  PROFILE,
  PROJECTS,
  SKILLS,
  SOCIALS,
  type SiteData,
} from "./data";
import { THEMES, type ThemeId } from "./themes";
import { A, Banner, Cmd, Hack, Neofetch, Stagger, Typed } from "@/components/blocks";

export type Ctx = {
  data: SiteData;
  theme: ThemeId;
  fx: boolean;
  bare: boolean;
  sudo: boolean;
  history: string[];
  run: (cmd: string) => void;
  clear: () => void;
  setTheme: (id: ThemeId) => void;
  setFx: (on: boolean) => void;
  askPassword: () => void;
  destroy: () => void;
  reboot: () => void;
};

export type Command = {
  name: string;
  desc: string;
  hint?: string;
  hidden?: boolean;
  run: (args: string[], ctx: Ctx) => ReactNode;
};

const FILES = ["about.md", "skills.txt", "contact.txt", "projects/", "blog/"];
const FORTUNES = [
  "It works on my machine. Ship the machine.",
  "terraform plan: 0 to add, 0 to change, 1 to destroy. Read that again.",
  "There is no cloud. It's just someone else's Kubernetes.",
  "A DevOps engineer walks into a bar. Bar is now infrastructure as code.",
  "Friends don't let friends run terraform destroy on Friday.",
  "The best pipeline is the one nobody notices.",
  "Works in staging. Staging is a state of mind.",
  "Have you tried turning the cluster off and on again?",
];

const nl = (children: ReactNode) => <p className="pre">{children}</p>;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Stagger>
      <br />
      <span className="h">── {title} ──</span>
      {Children.toArray(children)}
      <br />
    </Stagger>
  );
}

function stars(n: number) {
  return n > 0 ? <span className="star"> ★ {n}</span> : null;
}

function levenshtein(a: string, b: string) {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return m[a.length][b.length];
}

export function suggest(input: string): string | null {
  let best: [string, number] | null = null;
  for (const c of COMMANDS) {
    if (c.hidden) continue;
    const d = levenshtein(input, c.name);
    if (d <= 2 && (!best || d < best[1])) best = [c.name, d];
  }
  return best ? best[0] : null;
}

export const COMMANDS: Command[] = [
  {
    name: "help",
    desc: "List every command.",
    run: (_a, ctx) => (
      <Stagger>
        <br />
        {COMMANDS.filter((c) => !c.hidden).map((c) => (
          <div className="kv" key={c.name}>
            <Cmd run={ctx.run} c={c.name} label={c.hint ?? c.name} />
            <span className="dim">{c.desc}</span>
          </div>
        ))}
        <br />
        <span>
          <span className="key">Tab</span> complete · <span className="key">↑ ↓</span> history ·{" "}
          <span className="key">Ctrl+L</span> clear · <span className="key">Esc</span> reset line ·{" "}
          <span className="key">Ctrl+C</span> cancel
        </span>
        <span className="dim">Everything underlined is clickable. Psst, there are a few hidden commands too.</span>
        <br />
      </Stagger>
    ),
  },
  {
    name: "about",
    desc: "Who made this website?",
    run: (_a, ctx) => (
      <Stagger>
        <br />
        <span className="big">{PROFILE.greeting}</span>
        <br />
        <span>{PROFILE.bio}</span>
        <br />
        {SOCIALS.slice(0, 4).map((s) => (
          <div className="kv" key={s.key}>
            <span className="label">{s.label}</span>
            <A href={s.href}>{s.text}</A>
          </div>
        ))}
        <br />
        <span className="dim">
          Next: <Cmd run={ctx.run} c="experience" /> <Cmd run={ctx.run} c="skills" />{" "}
          <Cmd run={ctx.run} c="projects" /> <Cmd run={ctx.run} c="contact" />
        </span>
        <br />
      </Stagger>
    ),
  },
  {
    name: "experience",
    desc: "Where I've worked.",
    run: () => (
      <Section title="experience">
        {EXPERIENCE.map((e) => (
          <div className="card" key={e.company}>
            <div className="row-between">
              <span>
                <b className="accent">{e.role}</b> <span className="dim">@</span> <b>{e.company}</b>
              </span>
              <span className="dim">{e.period}</span>
            </div>
            {e.points.map((p) => (
              <div key={p} className="dim">
                ▸ {p}
              </div>
            ))}
          </div>
        ))}
      </Section>
    ),
  },
  {
    name: "education",
    desc: "Degrees and focus areas.",
    run: () => (
      <Section title="education">
        {EDUCATION.map((e) => (
          <div className="card" key={e.degree}>
            <div className="row-between">
              <b className="accent">{e.degree}</b>
              <span className="dim">{e.year}</span>
            </div>
            <div>{e.school}</div>
            <div className="dim">{e.focus}</div>
          </div>
        ))}
      </Section>
    ),
  },
  {
    name: "skills",
    desc: "Tools I reach for, as bars.",
    run: () => (
      <Section title="skills">
        {SKILLS.map((g) => (
          <div key={g.name} className="skillgroup">
            <div className="accent">{g.name}</div>
            {g.items.map((s, i) => (
              <div className="skill" key={s.label}>
                <span>{s.label}</span>
                <span className="bar" style={{ "--w": `${s.level}%`, "--d": `${i * 90}ms` } as CSSProperties}>
                  <i />
                </span>
                <span className="dim">{s.level}</span>
              </div>
            ))}
          </div>
        ))}
        <span className="dim">Self-assessed. Ask me about the Terraform ones.</span>
      </Section>
    ),
  },
  {
    name: "projects",
    desc: "Things I've built.",
    hint: "projects [all]",
    run: (args, ctx) => {
      const star = new Map(ctx.data.repos.map((r) => [r.name, r.stars]));
      if (args[0] === "all") {
        const rows = ctx.data.repos.slice(0, 25);
        if (!rows.length)
          return nl("Couldn't reach the GitHub API right now. Try `projects` for the curated list.");
        return (
          <Section title={`latest ${rows.length} repos`}>
            {rows.map((r) => (
              <div className="kv wide" key={r.name}>
                <A href={r.url}>{r.name}</A>
                <span className="dim">
                  {r.language ?? "—"}
                  {stars(r.stars)}
                </span>
              </div>
            ))}
            <span className="dim">
              {ctx.data.publicRepos ?? rows.length} public repos in total · github.com/{PROFILE.handle}
            </span>
          </Section>
        );
      }
      return (
        <Section title="projects">
          {PROJECTS.map((p) => (
            <div className="card" key={p.slug}>
              <div className="row-between">
                <b>
                  <A href={p.href}>{p.name}</A>
                  {stars(star.get(p.slug) ?? 0)}
                </b>
                {p.live ? <A href={p.live}>live ↗</A> : null}
              </div>
              <div>{p.blurb}</div>
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <span className="dim">
            <Cmd run={ctx.run} c="projects all" label="projects all" /> shows my latest repos straight from GitHub.
          </span>
        </Section>
      );
    },
  },
  {
    name: "blog",
    desc: "Latest posts.",
    run: (_a, ctx) => (
      <Section title="blog">
        {ctx.data.posts.length ? (
          ctx.data.posts.map((p) => (
            <div className="kv wide" key={p.href}>
              <A href={p.href}>{p.title}</A>
              <span className="dim">{p.date ? new Date(p.date).toLocaleDateString() : ""}</span>
            </div>
          ))
        ) : (
          <span className="dim">No posts could be loaded just now.</span>
        )}
        <A href={PROFILE.blog}>{PROFILE.blog.replace("https://", "")} ↗</A>
      </Section>
    ),
  },
  {
    name: "contact",
    desc: "Get in touch.",
    run: () => (
      <Section title="contact">
        {SOCIALS.map((s) => (
          <div className="kv" key={s.key}>
            <span className="label">{s.label}</span>
            <A href={s.href}>{s.text}</A>
          </div>
        ))}
        <span className="dim">Email is the fastest way to reach me.</span>
      </Section>
    ),
  },
  {
    name: "neofetch",
    desc: "System info, portfolio edition.",
    run: (_a, ctx) => <Neofetch data={ctx.data} theme={ctx.theme} />,
  },
  {
    name: "theme",
    desc: "Switch colour scheme.",
    hint: "theme [name]",
    run: (args, ctx) => {
      const id = args[0] as ThemeId | undefined;
      if (id && THEMES.some((t) => t.id === id)) {
        ctx.setTheme(id);
        return nl(`Theme set to ${id}.`);
      }
      return (
        <Stagger>
          <br />
          {id ? <span>Unknown theme '{id}'. Pick one:</span> : <span>Available themes:</span>}
          {THEMES.map((t) => (
            <div className="kv" key={t.id}>
              <Cmd run={ctx.run} c={`theme ${t.id}`} label={t.id} />
              <span className="dim">
                <span className="swatch" style={{ background: t.swatch[0] }} />
                <span className="swatch" style={{ background: t.swatch[1] }} /> {t.label}
                {ctx.theme === t.id ? " (current)" : ""}
              </span>
            </div>
          ))}
          <br />
        </Stagger>
      );
    },
  },
  {
    name: "fx",
    desc: "Toggle matrix rain, CRT and glow.",
    hint: "fx [on|off]",
    run: (args, ctx) => {
      const next = args[0] === "on" ? true : args[0] === "off" ? false : !ctx.fx;
      ctx.setFx(next);
      return nl(`Effects ${next ? "on" : "off"}.`);
    },
  },
  {
    name: "repo",
    desc: "Source code of this terminal.",
    run: () => nl(<>Built with Next.js. Source: <A href={PROFILE.repo}>{PROFILE.repo.replace("https://", "")}</A></>),
  },
  {
    name: "sudo",
    desc: "???",
    run: (_a, ctx) => {
      if (ctx.sudo) return nl("You are already root. Be careful.");
      ctx.askPassword();
      return null;
    },
  },
  { name: "banner", desc: "Show the banner again.", run: () => <Banner /> },
  { name: "history", desc: "Commands you've run.", run: (_a, ctx) => (
      <Stagger>
        {ctx.history.map((h, i) => (
          <div key={i} className="kv">
            <span className="dim">{String(i + 1).padStart(3, " ")}</span>
            <span>{h}</span>
          </div>
        ))}
      </Stagger>
    ),
  },
  { name: "clear", desc: "Clear the terminal.", run: (_a, ctx) => { ctx.clear(); return null; } },

  // Hidden commands
  { name: "whoami", desc: "", hidden: true, run: () => {
      const q = [
        ["In the kaleidoscope of existence,", "I am but a reflection questioning the enigma - "],
        ["Amidst cosmic whispers,", "I navigate the maze of self-discovery,", "echoing the eternal refrain - "],
        ["In the symphony of life,", "I am a note inquiring its own melody,", "harmonizing with the universal query - "],
        ["As stardust contemplating its journey,", "I ponder the cosmic query,", "silently asking - "],
        ["In the tapestry of reality,", "I am the thread of self-inquiry,", "weaving through the eternal question - "],
      ];
      const lines = q[Math.floor(Math.random() * q.length)];
      return (
        <Stagger>
          <br />
          {lines.map((l, i) => (
            <span key={i}>
              {l}
              {i === lines.length - 1 ? <span className="cmd">who am I?</span> : null}
            </span>
          ))}
          <br />
        </Stagger>
      );
    },
  },
  { name: "pwd", desc: "", hidden: true, run: () => nl("/home/guest") },
  { name: "date", desc: "", hidden: true, run: () => nl(new Date().toString()) },
  { name: "uname", desc: "", hidden: true, run: () => nl("Wasath.x64_x86 5.0.0-next #1 SMP PREEMPT React 19 x86_64 GNU/Web") },
  { name: "echo", desc: "", hidden: true, run: (a) => nl(a.join(" ") || " ") },
  { name: "cd", desc: "", hidden: true, run: () => nl("There is nowhere to go. Everything is already here.") },
  { name: "exit", desc: "", hidden: true, run: () => nl("Nice try. There is no escape from the terminal.") },
  { name: "gpg", desc: "", hidden: true, run: () => (
      <Stagger>
        <span>{PROFILE.gpg}</span>
        <A href="https://github.com/WasathTheekshana.gpg">public key ↗</A>
      </Stagger>
    ),
  },
  { name: "resume", desc: "", hidden: true, run: () => nl(<>My CV lives in a repo: <A href="https://github.com/WasathTheekshana/my-cv">github.com/WasathTheekshana/my-cv</A></>) },
  { name: "fortune", desc: "", hidden: true, run: () => nl(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]) },
  { name: "coffee", desc: "", hidden: true, run: () => (
      <pre className="ascii small">{`    ( (
     ) )
  .______.
  |      |]
  \\      /
   '----'   Fuel for terraform apply.`}</pre>
    ),
  },
  { name: "cowsay", desc: "", hidden: true, run: (a) => {
      const msg = a.join(" ") || "moo, but make it DevOps";
      const bar = "-".repeat(msg.length + 2);
      return <pre className="ascii small">{` ${bar}\n< ${msg} >\n ${bar}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`}</pre>;
    },
  },
  { name: "ping", desc: "", hidden: true, run: () => (
      <Typed interval={260} lines={[
        "PING wasath.site (76.76.21.21): 56 data bytes",
        "64 bytes from wasath.site: icmp_seq=0 ttl=64 time=0.9 ms",
        "64 bytes from wasath.site: icmp_seq=1 ttl=64 time=0.7 ms",
        "64 bytes from wasath.site: icmp_seq=2 ttl=64 time=0.8 ms",
        "--- 3 packets transmitted, 3 received, 0% packet loss ---",
      ]} />
    ),
  },
  { name: "hack", desc: "", hidden: true, run: () => <Hack /> },
  { name: "ls", desc: "", hidden: true, run: (a, ctx) => {
      const files = [...FILES, ...(ctx.sudo ? ["src/"] : []), ...(a.includes("-a") || a.includes("-la") ? [".secret"] : [])];
      return <div className="ls">{files.map((f) => (
        <span key={f} className={f.endsWith("/") ? "accent" : ""}>{f}</span>
      ))}</div>;
    },
  },
  { name: "cat", desc: "", hidden: true, run: (a, ctx) => {
      const f = a[0];
      if (!f) return nl("usage: cat <file>");
      switch (f) {
        case "about.md": ctx.run("about"); return null;
        case "skills.txt": ctx.run("skills"); return null;
        case "contact.txt": ctx.run("contact"); return null;
        case ".secret": return nl("Not everything is hidden in the DOM. Open the browser console, and try 'sudo'.");
        default: return nl(`cat: ${f}: No such file or directory`);
      }
    },
  },
  { name: "rm", desc: "", hidden: true, run: (a, ctx) => {
      if (!ctx.sudo) return nl("Permission not granted.");
      const joined = a.join(" ");
      if (!a.length || joined === "-rf") return nl(<>Usage: <span className="cmd">rm -rf &lt;dir&gt;</span></>);
      if (joined === "-rf src") { ctx.destroy(); return null; }
      return nl(<>Directory not found. Type <span className="cmd">ls</span> for a list of directories.</>);
    },
  },
  { name: "open", desc: "", hidden: true, run: (a) => {
      const hit = SOCIALS.find((s) => s.key === a[0]);
      if (!hit) return nl(`usage: open <${SOCIALS.map((s) => s.key).join("|")}>`);
      setTimeout(() => window.open(hit.href, "_blank", "noopener"), 400);
      return nl(`Opening ${hit.label}...`);
    },
  },
  { name: "reboot", desc: "", hidden: true, run: (_a, ctx) => { ctx.reboot(); return null; } },
];

export const COMMAND_MAP = new Map(COMMANDS.map((c) => [c.name, c]));
export const COMPLETABLE = COMMANDS.filter((c) => !c.hidden || ["cat", "ls", "open", "whoami", "fortune", "coffee", "hack", "ping", "cowsay", "gpg", "resume", "reboot"].includes(c.name)).map((c) => c.name);
export const ARG_COMPLETIONS: Record<string, string[]> = {
  theme: THEMES.map((t) => t.id),
  cat: ["about.md", "skills.txt", "contact.txt"],
  open: SOCIALS.map((s) => s.key),
  projects: ["all"],
  fx: ["on", "off"],
};
