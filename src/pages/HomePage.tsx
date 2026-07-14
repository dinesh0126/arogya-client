import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Clock,
  HeartPulse,
  MapPin,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  ["24/7", "Emergency support"],
  ["80+", "Specialist doctors"],
  ["4.9/5", "Patient rating"],
  ["12k+", "Families served"],
];

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              NABH-inspired care standards
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-normal text-white sm:text-5xl lg:text-6xl">
              Arogya Healthcare for fast, calm, family-first hospital care.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-slate-300 sm:text-lg">
              Book consultations, emergency care, diagnostics, and specialist
              treatment with a hospital team built around clarity, comfort, and
              trusted Indian medical service.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-full bg-cyan-600 px-6 text-white hover:bg-cyan-700"
              >
                <Link to="/services">
                  Explore Services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-white/15 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/ratings">Read Patient Reviews</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-2xl font-extrabold text-cyan-200">{value}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative pb-10">
            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=85"
              alt="Modern hospital care team"
              className="aspect-[4/5] w-full rounded-[2rem] border border-white/10 object-cover shadow-2xl lg:max-h-[680px]"
            />
            <div className="absolute bottom-0 left-4 right-4 rounded-3xl border border-white/10 bg-slate-950/88 p-5 shadow-2xl backdrop-blur-xl sm:left-8 sm:right-8">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  [HeartPulse, "Critical Care"],
                  [Stethoscope, "OPD Specialists"],
                  [CalendarCheck, "Easy Booking"],
                ].map(([Icon, label]) => (
                  <div key={label as string} className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-extrabold text-white">
                      {label as string}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-950/35">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            {
              icon: Clock,
              title: "Fast admission desk",
              text: "Emergency, OPD, and diagnostics teams coordinate from the first entry point.",
            },
            {
              icon: BadgeCheck,
              title: "Verified specialists",
              text: "Senior consultants guide treatment plans with clear instructions and follow-ups.",
            },
            {
              icon: UsersRound,
              title: "Family support",
              text: "Attendants receive updates, billing clarity, and practical discharge guidance.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                <item.icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-extrabold text-white">{item.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <img
          src="https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=85"
          alt="Hospital waiting area"
          className="h-full min-h-[360px] w-full rounded-[2rem] border border-white/10 object-cover shadow-2xl"
        />
        <div className="self-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyan-200">
            Care Departments
          </p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Everything patients need, connected in one hospital flow.
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Emergency and trauma care",
              "Cardiology and heart monitoring",
              "Mother and child care",
              "Pathology and imaging",
              "Orthopedic consultations",
              "Senior citizen health checks",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm font-extrabold text-slate-100"
              >
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/[0.04]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyan-200">
              Patient Journey
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
              From booking to recovery, the path stays clear.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              ["01", "Book", "Choose OPD, tests, or emergency support."],
              ["02", "Triage", "Care team checks priority and history."],
              ["03", "Treat", "Doctors explain treatment and next steps."],
              ["04", "Follow up", "Reports, medicines, and reminders stay organized."],
            ].map(([step, title, text]) => (
              <article
                key={step}
                className="rounded-3xl border border-white/10 bg-slate-950/70 p-6"
              >
                <p className="text-sm font-extrabold text-cyan-200">{step}</p>
                <h3 className="mt-4 text-xl font-extrabold text-white">{title}</h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-2xl sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.2em] text-emerald-200">
              <MapPin className="h-4 w-4" />
              Jaipur care campus
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-white">
              Need quick care today?
            </h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-300">
              Our emergency desk, diagnostics team, and OPD support are ready to
              guide patients without making the website feel crowded.
            </p>
          </div>
          <Button
            asChild
            className="h-12 rounded-full bg-emerald-500 px-6 text-slate-950 hover:bg-emerald-400"
          >
            <Link to="/services">
              <Sparkles className="h-4 w-4" />
              See Available Care
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
