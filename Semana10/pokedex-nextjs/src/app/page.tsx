// SSG: portada estática para elegir entre los dos universos disponibles.
import Link from "next/link";
import { FaArrowRight, FaDragon, FaFlask } from "react-icons/fa";

const universes = [
  {
    href: "/pokemon",
    eyebrow: "UNIVERSO 01 · KANTO Y MÁS ALLÁ",
    title: "Pokédex",
    description:
      "Descubre criaturas, evoluciones y poderes en una aventura por todas las regiones.",
    action: "Entrar al Pokédex",
    icon: FaDragon,
    accent: "from-cyan-400/20 via-blue-500/10 to-violet-500/20",
    iconColor: "text-cyan-300",
  },
  {
    href: "/rickandmorty",
    eyebrow: "UNIVERSO 02 · DIMENSIONES INFINITAS",
    title: "Rick & Morty",
    description:
      "Cruza el portal y conoce a los habitantes más extraños del multiverso.",
    action: "Cruzar el portal",
    icon: FaFlask,
    accent: "from-lime-400/20 via-emerald-500/10 to-violet-500/20",
    iconColor: "text-lime-300",
  },
];

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-1 items-center overflow-hidden bg-[#070810] px-5 py-16 text-white sm:px-10">
      <div aria-hidden="true" className="rm-stars pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-violet-700/20 blur-[130px]"
      />
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mb-12 max-w-3xl sm:mb-16">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-lime-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400" />
            EL MULTIVERSO TE ESTÁ ESPERANDO
          </p>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">
            Dos mundos.
            <span className="block bg-linear-to-r from-lime-200 via-cyan-200 to-violet-300 bg-clip-text text-transparent">
              Infinitas historias.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
            Elige tu destino: explora una Pokédex llena de sorpresas o viaja
            entre dimensiones con Rick y Morty.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {universes.map((universe, index) => {
            const Icon = universe.icon;
            return (
              <Link
                key={universe.href}
                href={universe.href}
                className={`group relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-linear-to-br ${universe.accent} p-7 shadow-2xl shadow-black/20 transition duration-500 hover:-translate-y-1 hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-300 sm:p-10`}
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-12 -top-14 -z-10 h-64 w-64 rounded-full border border-white/10 transition duration-700 group-hover:scale-125 group-hover:rotate-12"
                />
                <div
                  aria-hidden="true"
                  className="absolute -right-4 top-8 -z-10 h-44 w-44 rounded-full border border-white/10"
                />
                <div className="flex min-h-72 flex-col justify-between sm:min-h-80">
                  <div>
                    <p className="text-xs font-bold tracking-[0.18em] text-slate-300">
                      {universe.eyebrow}
                    </p>
                    <div className={`mt-8 ${universe.iconColor}`}>
                      <Icon aria-hidden="true" size={42} />
                    </div>
                    <h2 className="mt-5 text-4xl font-black sm:text-5xl">
                      {universe.title}
                    </h2>
                    <p className="mt-4 max-w-md leading-7 text-slate-200">
                      {universe.description}
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-3 font-bold text-white">
                    {universe.action}
                    <FaArrowRight
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
                <span className="absolute bottom-7 right-8 text-6xl font-black text-white/10 sm:text-7xl">
                  0{index + 1}
                </span>
              </Link>
            );
          })}
        </div>
        <p className="mt-8 text-sm text-slate-500">
          Una experiencia creada para explorar sin límites.
        </p>
      </div>
    </main>
  );
}
