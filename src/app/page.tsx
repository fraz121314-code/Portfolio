import GatherName from "@/components/GatherName";
import GlassCard from "@/components/GlassCard";
import LineSketch from "@/components/LineSketch";
import MoodBadge from "@/components/MoodBadge";
import MoodField from "@/components/MoodField";
import { experience, projects, site, skills } from "@/content/site";

const nav = [
  { href: "#work", label: "Work" },
  { href: "#play", label: "Play" },
  { href: "#cv", label: "CV" },
  { href: "#contact", label: "Contact" },
];

export default function Home() {
  return (
    <>
      <MoodField />
      <MoodBadge />

      <header className="fixed inset-x-0 top-0 z-30 flex justify-center px-4 pt-4">
        <nav className="glass flex gap-1 rounded-full p-1 text-sm">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="rounded-full px-4 py-2 text-white/80 transition hover:bg-white/10 hover:text-white">
              {n.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-8">
        {/* Hero */}
        <section className="flex min-h-svh flex-col justify-center pt-20">
          <p className="mood-text mb-2 text-center text-sm uppercase tracking-[0.3em]">{site.role}</p>
          <GatherName text={site.name} />
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-white/70">{site.intro}</p>
          <div className="mt-8 flex justify-center gap-3">
            <a href="#work" className="glass rounded-full px-6 py-3 text-sm font-medium transition hover:bg-white/15">
              See the work
            </a>
            <a href={site.cvUrl} className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/80 transition hover:border-white/50">
              Download CV
            </a>
          </div>
          <p className="mt-16 text-center text-xs text-white/40">Move the cursor, click, scatter the letters.</p>
        </section>

        {/* Work */}
        <section id="work" className="scroll-mt-24 py-24">
          <SectionTitle kicker="01" title="Selected work" />
          <div className="grid gap-5 sm:grid-cols-2">
            {projects.map((p) => (
              <GlassCard key={p.title} href={p.href} className="min-h-56">
                <div className="flex items-start justify-between text-xs text-white/50">
                  <span>{p.year}</span>
                  <span className="transition group-hover:translate-x-1">↗</span>
                </div>
                <h3 className="font-display mt-10 text-4xl">{p.title}</h3>
                <p className="mt-2 text-white/70">{p.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60">
                      {t}
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* Play */}
        <section id="play" className="scroll-mt-24 py-24">
          <SectionTitle kicker="02" title="Leave a line" />
          <p className="-mt-6 mb-6 max-w-xl text-white/60">
            Draw anything. When you let go, it&apos;s redrawn as one continuous line, the way I like to
            think about work: one thread from idea to result.
          </p>
          <GlassCard className="p-2!">
            <LineSketch />
          </GlassCard>
        </section>

        {/* CV */}
        <section id="cv" className="scroll-mt-24 py-24">
          <SectionTitle kicker="03" title="Curriculum vitae" />
          <div className="grid gap-5 lg:grid-cols-3">
            <GlassCard className="lg:col-span-2">
              <ol className="space-y-8">
                {experience.map((e) => (
                  <li key={e.period + e.title} className="grid gap-1 sm:grid-cols-[9rem_1fr]">
                    <span className="text-sm text-white/50">{e.period}</span>
                    <div>
                      <h3 className="text-lg font-medium">
                        {e.title} <span className="text-white/50">· {e.place}</span>
                      </h3>
                      <p className="text-white/65">{e.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </GlassCard>
            <GlassCard>
              <h3 className="text-sm uppercase tracking-widest text-white/50">Skills</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {skills.map((s) => (
                  <li key={s} className="rounded-full bg-white/8 px-3 py-1 text-sm">
                    {s}
                  </li>
                ))}
              </ul>
              <a href={site.cvUrl} className="mood-text mt-8 inline-block text-sm underline underline-offset-4">
                Download full CV (PDF)
              </a>
            </GlassCard>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-24 py-32 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">04 · Say hello</p>
          <a href={`mailto:${site.email}`} className="font-display mood-text mt-4 block text-5xl break-words sm:text-7xl">
            {site.email}
          </a>
          <div className="mt-8 flex justify-center gap-6 text-white/70">
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} className="hover:text-white" target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
          <p className="mt-24 text-xs text-white/30">
            © {site.year} {site.name} · {site.location}
          </p>
        </section>
      </main>
    </>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-10 flex items-baseline gap-4">
      <span className="mood-text text-sm">{kicker}</span>
      <h2 className="font-display text-5xl sm:text-6xl">{title}</h2>
    </div>
  );
}
