import {
  Activity,
  Ambulance,
  Baby,
  Brain,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  Hospital,
  Microscope,
  PhoneCall,
  Stethoscope,
  Syringe,
  TimerReset,
} from "lucide-react";

const services = [
  {
    icon: HeartPulse,
    title: "Cardiology",
    text: "Heart checkups, ECG, echo, cardiac monitoring, and specialist consultations.",
  },
  {
    icon: Brain,
    title: "Neurology",
    text: "Care for headaches, stroke support, seizures, nerve pain, and follow-up treatment.",
  },
  {
    icon: Baby,
    title: "Mother & Child",
    text: "Pregnancy care, pediatrics, vaccination guidance, and family counselling.",
  },
  {
    icon: Microscope,
    title: "Diagnostics",
    text: "Pathology, imaging, preventive health packages, and fast digital reports.",
  },
  {
    icon: Ambulance,
    title: "Emergency",
    text: "24/7 triage, ambulance coordination, trauma response, and ICU-ready support.",
  },
  {
    icon: Syringe,
    title: "Day Care",
    text: "Minor procedures, injections, wound dressing, observation, and same-day discharge.",
  },
];

export default function ServicesPage() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:px-8">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyan-200">
            Hospital Services
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Complete care departments, organized around your recovery.
          </h1>
          <p className="mt-5 text-base font-semibold leading-8 text-slate-300">
            Every service is designed to help patients move from first concern to
            diagnosis, treatment, and follow-up without confusion.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85"
          alt="Hospital doctor consultation"
          className="h-[340px] w-full rounded-[2rem] border border-white/10 object-cover shadow-2xl"
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl backdrop-blur"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                <service.icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-extrabold text-white">
                {service.title}
              </h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-slate-300">
                {service.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-950/45">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="self-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyan-200">
              Emergency System
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Built for the first 30 minutes of urgent care.
            </h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
              The service flow connects ambulance arrival, triage, emergency
              doctor review, diagnostics, and admission without making families
              run between counters.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Priority triage counter",
                "ICU-ready escalation",
                "On-call specialists",
                "Digital report handoff",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-extrabold text-white"
                >
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1200&q=85"
            alt="Emergency hospital corridor"
            className="h-[430px] w-full rounded-[2rem] border border-white/10 object-cover shadow-2xl"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyan-200">
            Health Packages
          </p>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
            Preventive plans for routine family care.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Basic Wellness",
              price: "Rs. 1,499",
              items: ["CBC", "Blood sugar", "Liver profile", "Doctor review"],
            },
            {
              title: "Heart Health",
              price: "Rs. 2,999",
              items: ["ECG", "Lipid profile", "BP review", "Cardio consult"],
            },
            {
              title: "Senior Care",
              price: "Rs. 3,499",
              items: ["Kidney profile", "Thyroid", "Vitamin D", "Medicine review"],
            },
          ].map((pack) => (
            <article
              key={pack.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="text-2xl font-extrabold text-white">{pack.title}</h3>
              <p className="mt-2 text-3xl font-extrabold text-cyan-200">
                {pack.price}
              </p>
              <div className="mt-6 grid gap-3">
                {pack.items.map((item) => (
                  <p
                    key={item}
                    className="flex items-center gap-3 text-sm font-semibold text-slate-300"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    {item}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white/[0.04]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyan-200">
                OPD Workflow
              </p>
              <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
                Less confusion before meeting the doctor.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                [CalendarDays, "Appointment slotting"],
                [ClipboardList, "History and vitals capture"],
                [Stethoscope, "Specialist consultation"],
                [TimerReset, "Follow-up reminder"],
              ].map(([Icon, label]) => (
                <div
                  key={label as string}
                  className="rounded-3xl border border-white/10 bg-slate-950/70 p-6"
                >
                  <Icon className="h-7 w-7 text-cyan-300" />
                  <h3 className="mt-4 text-xl font-extrabold text-white">
                    {label as string}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 md:grid-cols-3">
          {[
            [Activity, "Real-time patient flow"],
            [Hospital, "Clean admission rooms"],
            [PhoneCall, "Care desk callback"],
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
      </section>
    </main>
  );
}
