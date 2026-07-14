import {
  Award,
  Building2,
  CheckCircle2,
  Clock,
  HeartPulse,
  Hospital,
  Microscope,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";

const values = [
  {
    icon: Clock,
    title: "Faster decisions",
    text: "OPD, lab, pharmacy, and emergency workflows are connected for less waiting.",
  },
  {
    icon: UsersRound,
    title: "Family communication",
    text: "Care teams explain treatment steps clearly to patients and attendants.",
  },
  {
    icon: Award,
    title: "Quality standards",
    text: "Clinical protocols, hygiene checks, and follow-up reminders support safer care.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyan-200">
            About Arogya
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            A modern hospital experience with warmth, transparency, and speed.
          </h1>
          <p className="mt-5 text-base font-semibold leading-8 text-slate-300">
            Arogya Healthcare brings specialist doctors, diagnostics, emergency
            readiness, and patient-first coordination into one clean healthcare
            experience for Indian families.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=85"
          alt="Clean modern hospital room"
          className="h-[420px] w-full rounded-[2rem] border border-white/10 object-cover shadow-2xl"
        />
      </section>

      <section className="border-y border-white/10 bg-slate-950/45">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          {values.map((value) => (
            <article
              key={value.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                <value.icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-extrabold text-white">
                {value.title}
              </h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
                {value.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyan-200">
              Our Story
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Designed for families who need both clinical confidence and simple guidance.
            </h2>
          </div>
          <div className="grid gap-4">
            {[
              ["2018", "Started as a specialist OPD center for family medicine."],
              ["2021", "Added diagnostics, day care procedures, and emergency support."],
              ["2024", "Expanded digital appointments, patient records, and follow-up systems."],
              ["2026", "Built a cleaner hospital experience around connected departments."],
            ].map(([year, text]) => (
              <div
                key={year}
                className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/70 p-5 sm:grid-cols-[90px_1fr]"
              >
                <p className="text-2xl font-extrabold text-cyan-200">{year}</p>
                <p className="text-sm font-semibold leading-7 text-slate-300">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/[0.04]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <img
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=85"
            alt="Hospital building corridor"
            className="h-full min-h-[360px] w-full rounded-[2rem] border border-white/10 object-cover shadow-2xl"
          />
          <div className="self-center">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <Building2 className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Built for everyday care and critical moments.
            </h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
              From fever consultations to cardiac observation, our hospital
              pages are designed to feel simple for patients while still
              presenting the clinical confidence expected from a modern
              healthcare brand.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Clean patient rooms",
                "Digital report desk",
                "Emergency observation",
                "Family waiting zones",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-sm font-extrabold text-cyan-100"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyan-200">
            Clinical Focus
          </p>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
            Departments shaped around daily Indian healthcare needs.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            [HeartPulse, "Critical monitoring"],
            [Stethoscope, "Specialist OPD"],
            [Microscope, "Diagnostics lab"],
            [Hospital, "Admission support"],
          ].map(([Icon, label]) => (
            <article
              key={label as string}
              className="rounded-3xl border border-white/10 bg-slate-950/70 p-6"
            >
              <Icon className="h-8 w-8 text-cyan-300" />
              <h3 className="mt-5 text-xl font-extrabold text-white">
                {label as string}
              </h3>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyan-200">
              Care Promise
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-white">
              Clear, respectful, and accountable hospital care.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [ShieldCheck, "Transparent billing"],
              [UsersRound, "Attendant-friendly updates"],
              [Award, "Quality review rounds"],
              [Clock, "Timely follow-up guidance"],
            ].map(([Icon, label]) => (
              <div key={label as string} className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="text-sm font-extrabold text-slate-100">
                  {label as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
