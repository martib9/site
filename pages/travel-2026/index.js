import Head from 'next/head';
import Link from 'next/link';

const plans = [
  {
    href: '/travel-2026/italy',
    country: 'ITALY',
    label: 'New Year dog-friendly trip',
    image: '/travel-assets/italy-postcard.png',
    tone: 'from-[#8b3f2f] to-[#c79548]',
    text: 'text-[#8b3f2f]',
    border: 'border-[#d9bfa7]',
    summary: 'Warm canals, aperitivo rhythm, calm northern bases, and easy daily walks.',
    picks: 'Treviso, Mantua, Lucca',
  },
  {
    href: '/travel-2026/france',
    country: 'FRANCE',
    label: 'New Year dog-friendly trip',
    image: '/travel-assets/france-postcard.png',
    tone: 'from-[#223a5e] to-[#862d3e]',
    text: 'text-[#223a5e]',
    border: 'border-[#d8c9bb]',
    summary: 'Cozy river towns around Paris, cafe mornings, light culture, and winter calm.',
    picks: 'Chartres, Rouen, Senlis',
  },
];

const features = ['Ranked shortlist', 'Compare side by side', 'Vote together', 'Costs and notes', '100% mobile friendly'];

const pageStyle = {
  background: 'radial-gradient(circle at 16% 4%, rgba(139,63,47,.13), transparent 28rem), radial-gradient(circle at 85% 8%, rgba(34,58,94,.14), transparent 28rem), linear-gradient(180deg,#fffdf7,#fbf3e9)',
};

const patternStyle = {
  backgroundImage: 'linear-gradient(90deg, rgba(35,31,26,.045) 1px, transparent 1px), linear-gradient(rgba(35,31,26,.035) 1px, transparent 1px)',
  backgroundSize: '42px 42px',
};

export default function TravelSelectorPage() {
  return (
    <>
      <Head>
        <title>Travel 2026 - Italy or France</title>
        <meta
          name="description"
          content="Choose between Italy and France dog-friendly New Year 2026/27 travel plans with rankings, voting, costs, and mobile-friendly comparisons."
        />
      </Head>

      <main className="min-h-screen overflow-hidden bg-[#fffdf7] text-[#231f1a]" style={pageStyle}>
        <div className="pointer-events-none fixed inset-0 opacity-[0.18]" aria-hidden="true">
          <div className="absolute inset-0" style={patternStyle} />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between rounded-full border border-[#e5d7c8] bg-white/65 px-4 py-2 text-sm shadow-sm backdrop-blur">
            <Link href="/" className="font-black text-[#29311f]">martib.app</Link>
            <span className="rounded-full bg-[#f0e4d6] px-3 py-1 text-xs font-bold text-[#6f6258]">Travel 2026</span>
          </nav>

          <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[0.82fr_1.18fr_0.7fr] lg:py-12">
            <aside className="hidden lg:block">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#59613f]">Travel 2026</p>
              <h1 className="mt-5 max-w-xs font-serif text-5xl font-black leading-[0.96] text-[#29311f]">Choose the plan</h1>
              <p className="mt-6 max-w-xs leading-7 text-[#6f6258]">
                Two beautiful options for a dog-friendly New Year escape.
              </p>
              <div className="mt-10 h-px w-20 bg-[#59613f]" />
            </aside>

            <div className="rounded-[30px] border border-[#e2d2c0] bg-[#fffaf2]/85 p-4 shadow-2xl shadow-stone-900/10 backdrop-blur sm:p-6 lg:p-8">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8b3f2f]">Where shall we celebrate?</p>
                <h2 className="mt-3 font-serif text-5xl font-black leading-none text-[#231f1a] sm:text-6xl">Choose the plan</h2>
                <p className="mx-auto mt-4 max-w-lg leading-7 text-[#6f6258]">
                  Same decision tool, two country moods. Pick a route, compare cities, vote, and keep the plan moving.
                </p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {plans.map((plan) => (
                  <Link
                    key={plan.country}
                    href={plan.href}
                    className={[
                      'group overflow-hidden rounded-[26px] border bg-white/80 shadow-xl shadow-stone-900/10 transition hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#c79548]',
                      plan.border,
                    ].join(' ')}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={plan.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
                        <div>
                          <h3 className="font-serif text-4xl font-black leading-none">{plan.country}</h3>
                          <p className="mt-1 text-sm font-bold text-white/85">{plan.label}</p>
                        </div>
                        <span className={['grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xl font-black text-white shadow-lg', plan.tone].join(' ')}>
                          -&gt;
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="min-h-14 text-sm leading-6 text-[#6f6258]">{plan.summary}</p>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <span className={['text-sm font-black', plan.text].join(' ')}>{plan.picks}</span>
                        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#8a7b6c]">Open</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <p className="mt-7 text-center text-sm italic text-[#7c6f63]">2 plans, one practical decision.</p>
            </div>

            <aside className="rounded-[28px] border border-[#e5d7c8] bg-white/55 p-5 backdrop-blur lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#59613f]">Shared experience</h3>
              <div className="mt-5 grid gap-3">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-[#463d35]">
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-[#e2d2c0] bg-white/70 text-xs font-black text-[#8b3f2f]">+</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}
