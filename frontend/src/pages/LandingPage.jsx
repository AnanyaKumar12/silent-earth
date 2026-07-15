import { Link } from "react-router-dom";
import { Radio, Siren, HeartPulse, Home, UtensilsCrossed, UserSearch, Layers } from "lucide-react";
import { useAccount } from "../context/AccountContext";

export default function LandingPage() {
  const { account } = useAccount();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-base-700">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.12),_transparent_55%)]" />
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center sm:px-6">
          <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-600 shadow-glow">
            <Radio className="h-8 w-8 text-white" />
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Silent Earth
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl">
            When disaster strikes, every second counts. All emergency community
            updates — critical alerts, medical needs, food, shelter, and missing
            persons — available in one place, in real time.
          </p>
          <Link
            to={account ? "/report" : "/create-account"}
            className="btn-primary mt-10 px-8 py-4 text-base shadow-glow"
          >
            Create Account
          </Link>
          <p className="mt-4 text-xs text-gray-600">
            No passwords. No login walls. Just your name and number.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">All Updates at One Place</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Silent Earth brings communities together during emergencies. Report
            what you see, find help nearby, and stay informed — without ever
            needing to create a password or sign in twice.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { icon: Siren, label: "Critical Alerts" },
            { icon: HeartPulse, label: "Medical" },
            { icon: UtensilsCrossed, label: "Food" },
            { icon: Home, label: "Shelter" },
            { icon: UserSearch, label: "Missing Persons" },
            { icon: Layers, label: "Other" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="card flex flex-col items-center gap-3 p-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-base-700">
                <Icon className="h-6 w-6 text-accent-400" />
              </span>
              <p className="text-sm font-medium text-gray-300">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-base-700 bg-base-900">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
          <h3 className="text-2xl font-bold text-white">
            Ready to report or find help nearby?
          </h3>
          <Link to={account ? "/report" : "/create-account"} className="btn-primary px-8 py-3">
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}
