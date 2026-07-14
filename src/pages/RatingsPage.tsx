import {
  BadgeCheck,
  HeartHandshake,
  MessageSquareText,
  Quote,
  ShieldCheck,
  Star,
  ThumbsUp,
  Timer,
} from "lucide-react";

const reviews = [
  {
    name: "Priya Sharma",
    city: "Jaipur",
    text: "Doctor ne poora case calmly explain kiya. Reports same day mil gayi aur staff ka behaviour bahut supportive tha.",
  },
  {
    name: "Rohit Verma",
    city: "Delhi NCR",
    text: "Emergency admission smooth tha. Reception se ICU team tak coordination fast and professional laga.",
  },
  {
    name: "Ananya Iyer",
    city: "Bengaluru",
    text: "Maternity consultation ke liye aayi thi. Clean rooms, polite nurses, aur appointment timing kaafi accurate tha.",
  },
  {
    name: "Sandeep Patel",
    city: "Ahmedabad",
    text: "Cardiology checkup detailed tha. Doctor ne medicines aur diet plan simple language mein samjhaya.",
  },
  {
    name: "Neha Kulkarni",
    city: "Pune",
    text: "Online booking ke baad waiting time kam tha. Hospital ambience modern hai and reports easy to understand.",
  },
  {
    name: "Amit Singh",
    city: "Lucknow",
    text: "Parents ke full body checkup ke liye best experience raha. Team ne senior citizens ko priority aur care di.",
  },
];

export default function RatingsPage() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyan-200">
            Patient Ratings
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Indian families trust Arogya for clear care and kind support.
          </h1>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex text-amber-300">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-6 w-6 fill-current" />
              ))}
            </div>
            <p className="text-lg font-extrabold text-white">4.9 out of 5</p>
          </div>
          <p className="mt-4 text-base font-semibold leading-8 text-slate-300">
            Based on OPD, emergency, diagnostics, maternity, and senior care
            feedback shared by patients.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1200&q=85"
          alt="Doctor speaking with patient"
          className="h-[360px] w-full rounded-[2rem] border border-white/10 object-cover shadow-2xl"
        />
      </section>

      <section className="border-y border-white/10 bg-slate-950/45">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            ["96%", "Patients recommend us"],
            ["18 min", "Average OPD wait"],
            ["4.8/5", "Staff behaviour"],
            ["98%", "Report clarity score"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center"
            >
              <p className="text-3xl font-extrabold text-cyan-200">{value}</p>
              <p className="mt-2 text-sm font-bold text-slate-300">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl backdrop-blur"
            >
              <Quote className="h-7 w-7 text-cyan-300" />
              <div className="mt-4 flex text-amber-300">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold leading-7 text-slate-300">
                "{review.text}"
              </p>
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="font-extrabold text-white">{review.name}</p>
                <p className="text-sm font-bold text-cyan-200">{review.city}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white/[0.04]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <img
            src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1200&q=85"
            alt="Patient receiving care"
            className="h-full min-h-[380px] w-full rounded-[2rem] border border-white/10 object-cover shadow-2xl"
          />
          <div className="self-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyan-200">
              What Patients Notice
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Reviews are strongest where hospital journeys usually feel hard.
            </h2>
            <div className="mt-8 grid gap-4">
              {[
                [Timer, "Shorter waiting", "Appointments and diagnostics are sequenced to reduce idle time."],
                [MessageSquareText, "Clear explanations", "Doctors and staff use simple language for treatment steps."],
                [HeartHandshake, "Attendant support", "Families get practical help with rooms, reports, and discharge."],
              ].map(([Icon, title, text]) => (
                <article
                  key={title as string}
                  className="rounded-3xl border border-white/10 bg-slate-950/70 p-5"
                >
                  <div className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-extrabold text-white">
                        {title as string}
                      </h3>
                      <p className="mt-2 text-sm font-semibold leading-7 text-slate-300">
                        {text as string}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-cyan-200">
            Department Scores
          </p>
          <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">
            Feedback tracked across real patient touchpoints.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {[
            ["Emergency", "4.9", "Fast response"],
            ["Diagnostics", "4.8", "Report clarity"],
            ["OPD", "4.9", "Doctor time"],
            ["Nursing", "4.9", "Kind support"],
          ].map(([name, score, note]) => (
            <article
              key={name}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <BadgeCheck className="h-7 w-7 text-cyan-300" />
              <h3 className="mt-4 text-xl font-extrabold text-white">{name}</h3>
              <p className="mt-3 text-4xl font-extrabold text-amber-300">
                {score}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-300">{note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 md:grid-cols-3">
          {[
            [ShieldCheck, "Verified review collection"],
            [ThumbsUp, "Action taken on feedback"],
            [Star, "Monthly quality review"],
          ].map(([Icon, label]) => (
            <div key={label as string} className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
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
