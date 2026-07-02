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

const features = ['Ranked shortlist', 'Side-by-side comparison', 'Group voting', 'Cost notes', 'Mobile-first'];

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

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between rounded-full border border-[#e5d7c8] bg-white/75 px-4 py-2 text-sm shadow-sm backdrop-blur">
            <Link href="/" className="font-black text-[#29311f]">martib.app</Link>
            <span className="rounded-full bg-[#f0e4d6] px-3 py-1 text-xs font-bold text-[#6f6258]">Travel 2026</span>
          </nav>

          <section className="flex flex-1 flex-col justify-center py-8 sm:py-12 lg:py-14">
            <header className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8b3f2f]">Where shall we celebrate?</p>
              <h1 className="mt-3 font-serif text-5xl font-black leading-[0.92] text-[#231f1a] sm:text-7xl">Travel 2026</h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6f6258] sm:text-lg">
                Choose one dog-friendly New Year plan, compare the cities, vote together, and keep the decision practical.
              </p>
            </header>

            <div className="mx-auto mt-8 w-full max-w-5xl rounded-[28px] border border-[#e2d2c0] bg-[#fffaf2]/88 p-3 shadow-2xl shadow-stone-900/10 backdrop-blur sm:p-4 lg:p-5">
              <div className="grid gap-4 md:grid-cols-2">
                {plans.map((plan) => (
                  <Link
                    key={plan.country}
                    href={plan.href}
                    className={[
                      'group overflow-hidden rounded-[22px] border bg-white/85 shadow-xl shadow-stone-900/10 transition hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#c79548]',
                      plan.border,
                    ].join(' ')}
                  >
                    <div className="relative h-[210px] overflow-hidden sm:h-[250px]">
                      <img src={plan.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-end justify-between gap-4">
                          <h2 className="font-serif text-4xl font-black leading-none sm:text-5xl">{plan.country}</h2>
                          <span className={['grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xl font-black text-white shadow-lg transition group-hover:translate-x-1', plan.tone].join(' ')}>
                            -&gt;
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                          <p className="mt-1 text-sm font-bold text-white/85">{plan.label}</p>
                          <span className="rounded-full bg-white/18 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-white backdrop-blur">Open</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-sm leading-6 text-[#6f6258]">{plan.summary}</p>
                      <div className="mt-4">
                        <span className={['text-sm font-black', plan.text].join(' ')}>{plan.picks}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-5 border-t border-[#e2d2c0] pt-4">
                <h2 className="sr-only">Shared experience</h2>
                <div className="flex flex-wrap justify-center gap-2">
                {features.map((feature) => (
                  <div key={feature} className="flex min-h-10 items-center gap-2 rounded-full border border-[#e2d2c0] bg-white/65 px-3 py-2 text-sm text-[#463d35]">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#8b3f2f]/10 text-xs font-black text-[#8b3f2f]">+</span>
                    <span>{feature}</span>
                  </div>
                ))}
                </div>
              </div>

              <p className="mt-5 text-center text-sm italic text-[#7c6f63]">2 plans, one practical decision.</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
