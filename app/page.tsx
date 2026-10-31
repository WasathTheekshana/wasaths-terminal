import Terminal from "@/components/Terminal";
import { EDUCATION, EXPERIENCE, PROFILE, PROJECTS, SKILLS, SOCIALS } from "@/lib/data";
import { loadSiteData } from "@/lib/remote";

export const revalidate = 3600;

export default async function Home() {
  const data = await loadSiteData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFILE.name,
    jobTitle: PROFILE.title,
    url: PROFILE.site,
    email: PROFILE.email,
    address: { "@type": "PostalAddress", addressLocality: "Colombo", addressCountry: "LK" },
    sameAs: SOCIALS.filter((s) => s.href.startsWith("http")).map((s) => s.href),
    alumniOf: EDUCATION.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
    knowsAbout: SKILLS.flatMap((g) => g.items.map((i) => i.label)),
  };

  return (
    <>
      <Terminal data={data} />
      {/* Static copy for crawlers, screen-reader users and no-JS visitors. */}
      <section className="sr-only" aria-label="Portfolio summary">
        <h1>{PROFILE.name}: {PROFILE.title}</h1>
        <p>{PROFILE.bio}</p>
        <h2>Experience</h2>
        <ul>{EXPERIENCE.map((e) => <li key={e.company}>{e.role}, {e.company} ({e.period})</li>)}</ul>
        <h2>Education</h2>
        <ul>{EDUCATION.map((e) => <li key={e.degree}>{e.degree}, {e.school} ({e.year})</li>)}</ul>
        <h2>Projects</h2>
        <ul>{PROJECTS.map((p) => <li key={p.slug}><a href={p.href}>{p.name}</a>: {p.blurb}</li>)}</ul>
        <h2>Links</h2>
        <ul>{SOCIALS.map((s) => <li key={s.key}><a href={s.href}>{s.label}</a></li>)}</ul>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
