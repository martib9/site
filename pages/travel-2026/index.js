import Head from 'next/head';
import Link from 'next/link';

const Icon = ({ name, className = 'h-5 w-5' }) => {
  const common = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
    'aria-hidden': 'true',
  };
  const paths = {
    pin: (
      <>
        <path d="M12 21s6-5.6 6-11a6 6 0 0 0-12 0c0 5.4 6 11 6 11Z" />
        <path d="M12 10.2h.01" />
      </>
    ),
    list: (
      <>
        <path d="M8 6h12" />
        <path d="M8 12h12" />
        <path d="M8 18h12" />
        <path d="M4 6h.01" />
        <path d="M4 12h.01" />
        <path d="M4 18h.01" />
      </>
    ),
    compare: (
      <>
        <path d="M7 4v16" />
        <path d="M17 4v16" />
        <path d="M3 8h8" />
        <path d="M13 16h8" />
      </>
    ),
    vote: (
      <>
        <path d="m6 11 4 4 8-8" />
        <path d="M4 4h16v16H4z" />
      </>
    ),
    cost: (
      <>
        <path d="M7 5h10" />
        <path d="M7 9h10" />
        <path d="M7 13h6" />
        <path d="M6 19h12a2 2 0 0 0 2-2V3H4v14a2 2 0 0 0 2 2Z" />
      </>
    ),
    mobile: (
      <>
        <rect x="7" y="3" width="10" height="18" rx="2" />
        <path d="M11 17h2" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3c2.3 2.6 3.4 5.6 3.4 9S14.3 18.4 12 21c-2.3-2.6-3.4-5.6-3.4-9S9.7 5.6 12 3Z" />
      </>
    ),
  };
  return <svg {...common}>{paths[name]}</svg>;
};

const plans = [
  {
    href: '/travel-2026/italy',
    country: 'ITALY',
    label: 'New Year dog-friendly trip',
    image: '/travel-assets/italy-postcard.jpg',
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
    image: '/travel-assets/france-postcard.jpg',
    tone: 'from-[#223a5e] to-[#862d3e]',
    text: 'text-[#223a5e]',
    border: 'border-[#d8c9bb]',
    summary: 'Cozy river towns around Paris, cafe mornings, light culture, and winter calm.',
    picks: 'Chartres, Rouen, Senlis',
  },
];

const features = ['Ranked shortlist', 'Side-by-side comparison', 'Group voting', 'Cost notes', 'Mobile-first'];
const featureIcons = ['list', 'compare', 'vote', 'cost', 'mobile'];

const pageStyle = {
  background: 'radial-gradient(circle at 14% 5%, rgba(139,63,47,.11), transparent 26rem), radial-gradient(circle at 86% 8%, rgba(34,58,94,.12), transparent 28rem), linear-gradient(180deg,#fffdf7,#fbf1e4)',
};

const patternStyle = {
  backgroundImage:
    'linear-gradient(90deg, rgba(35,31,26,.035) 1px, transparent 1px), linear-gradient(rgba(35,31,26,.028) 1px, transparent 1px), radial-gradient(circle at 20% 15%, rgba(88,90,51,.12) 0 1px, transparent 1.5px)',
  backgroundSize: '42px 42px, 42px 42px, 18px 18px',
};

const Botanical = ({ side = 'left' }) => (
  <div
    className={[
      'pointer-events-none absolute top-0 hidden h-40 w-40 text-[#59613f]/55 sm:block',
      side === 'left' ? 'left-0 -translate-x-6 -translate-y-5' : 'right-0 -translate-y-5 translate-x-8 scale-x-[-1]',
    ].join(' ')}
    aria-hidden="true"
  >
    <svg viewBox="0 0 160 160" className="h-full w-full">
      <path d="M24 19c26 36 38 78 29 126" fill="none" stroke="currentColor" strokeWidth="2" />
      {[
        [34, 36, -32],
        [51, 58, 24],
        [57, 83, -28],
        [57, 110, 28],
        [48, 131, -20],
      ].map(([x, y, rotate]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="10" ry="22" fill="currentColor" opacity=".42" transform={`rotate(${rotate} ${x} ${y})`} />
      ))}
    </svg>
  </div>
);

const Stamp = ({ className = '' }) => (
  <div
    className={[
      'pointer-events-none hidden h-24 w-24 place-items-center rounded-full border border-dashed border-[#bda996] text-center text-[10px] font-black uppercase leading-3 tracking-[0.12em] text-[#9a8573]/65 sm:grid',
      className,
    ].join(' ')}
    aria-hidden="true"
  >
    martib
    <br />
    travel
    <br />
    2026
  </div>
);

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

      <main className="box-border min-h-screen w-full max-w-full overflow-x-hidden bg-[#fffdf7] text-[#231f1a]" style={pageStyle}>
        <div className="pointer-events-none fixed inset-0 opacity-[0.18]" aria-hidden="true">
          <div className="absolute inset-0" style={patternStyle} />
        </div>

        <div className="relative mx-auto box-border flex min-h-screen w-full max-w-7xl flex-col overflow-x-hidden px-4 py-5 sm:px-6 lg:px-8">
          <nav className="box-border flex w-full min-w-0 items-center justify-between rounded-full border border-[#e5d7c8] bg-white/75 px-4 py-2 text-sm shadow-sm backdrop-blur">
            <Link href="/" className="font-black text-[#29311f]">martib.app</Link>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full bg-[#f0e4d6] px-3 py-1 text-xs font-bold text-[#6f6258] sm:inline-flex">Travel 2026</span>
              <span className="grid h-7 w-7 place-items-center rounded-full border border-[#e5d7c8] bg-white/70 text-[#59613f]">
                <Icon name="globe" className="h-4 w-4" />
              </span>
            </div>
          </nav>

          <section className="box-border grid w-full min-w-0 flex-1 items-center gap-8 py-8 sm:py-10 lg:grid-cols-[210px_1fr_230px] lg:py-12">
            <aside className="hidden lg:block">
              <div className="mb-8 grid h-9 w-9 place-items-center rounded-full text-[#59613f]">
                <Icon name="pin" className="h-7 w-7" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#59613f]">Travel 2026</p>
              <h1 className="mt-5 max-w-xs font-serif text-4xl font-black leading-[0.98] text-[#29311f]">Choose the plan</h1>
              <div className="mt-6 h-px w-16 bg-[#59613f]" />
              <p className="mt-6 max-w-[11rem] leading-7 text-[#4d463e]">Two beautiful options for our dog-friendly New Year escape.</p>
              <div className="mt-12 text-[#59613f]">
                <svg viewBox="0 0 40 40" className="h-10 w-10 fill-current" aria-hidden="true">
                  <circle cx="9" cy="25" r="5" />
                  <circle cx="17" cy="14" r="4" />
                  <circle cx="27" cy="14" r="4" />
                  <circle cx="32" cy="25" r="5" />
                  <path d="M13 30c2-6 13-6 15 0 1.2 4-3.3 6.8-7.5 6.8S11.8 34 13 30Z" />
                </svg>
              </div>
            </aside>

            <div className="relative mx-auto box-border w-full min-w-0 max-w-[calc(100vw-2rem)] overflow-hidden rounded-[26px] border border-[#d9c8b6] bg-[#fffaf0]/92 p-5 shadow-2xl shadow-stone-900/15 backdrop-blur sm:max-w-4xl sm:p-7 lg:p-8">
              <Botanical side="left" />
              <Botanical side="right" />
              <Stamp className="absolute right-8 top-12" />
              <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-52 w-64 opacity-45" aria-hidden="true">
                <img src="/travel-assets/italy-postcard.jpg" alt="" className="h-full w-full object-cover object-left-bottom [mask-image:linear-gradient(90deg,black,transparent)]" />
              </div>
              <div className="pointer-events-none absolute bottom-0 right-0 z-0 hidden h-64 w-72 opacity-45 md:block" aria-hidden="true">
                <img src="/travel-assets/france-postcard.jpg" alt="" className="h-full w-full object-cover object-right-bottom [mask-image:linear-gradient(270deg,black,transparent)]" />
              </div>

              <header className="relative z-10 mx-auto max-w-xl text-center">
                <div className="mx-auto mb-3 grid h-10 w-10 place-items-center text-[#a88955]" aria-hidden="true">
                  <svg viewBox="0 0 40 40" className="h-full w-full">
                    <path d="M20 2v36M2 20h36M7 7l26 26M33 7 7 33" stroke="currentColor" strokeWidth="1.3" />
                    <circle cx="20" cy="20" r="3" fill="currentColor" />
                  </svg>
                </div>
                <h1 className="break-words font-serif text-3xl font-black leading-[0.98] text-[#1f2119] sm:text-5xl">Choose the plan</h1>
                <p className="mx-auto mt-3 max-w-lg break-words font-serif text-base italic leading-7 text-[#8b6e58] sm:text-lg">
                  Where shall we celebrate New Year with our dogs?
                </p>
                <div className="mx-auto mt-4 h-px w-16 bg-[#a88955]" />
              </header>

              <div className="relative z-10 mt-7 grid gap-4 md:grid-cols-2">
                {plans.map((plan) => (
                  <Link
                    key={plan.country}
                    href={plan.href}
                    className={[
                      'group min-w-0 overflow-hidden rounded-[12px] border bg-white/82 shadow-xl shadow-stone-900/12 transition hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#c79548]',
                      plan.border,
                    ].join(' ')}
                  >
                    <div className="relative h-[190px] overflow-hidden sm:h-[220px]">
                      <img src={plan.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/88 via-white/50 to-transparent" />
                      <div className="absolute inset-0 p-5">
                        <h2 className={['inline-block max-w-full break-words rounded-xl bg-white/58 px-2 py-1 font-serif text-2xl font-black leading-none backdrop-blur-sm sm:text-4xl', plan.text].join(' ')}>{plan.country}</h2>
                        <p className="mt-2 max-w-[9rem] rounded-xl bg-white/55 p-2 text-sm font-bold leading-5 text-[#2d2922] backdrop-blur-sm">{plan.label}</p>
                        <div className="absolute bottom-5 left-5">
                          <span className={['grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xl font-black text-white shadow-lg transition group-hover:translate-x-1', plan.tone].join(' ')}>
                            <span aria-hidden="true">-&gt;</span>
                          </span>
                        </div>
                        <div className="absolute bottom-5 right-5 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#756657] backdrop-blur">
                          Open
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-[#e2d2c0]/70 p-4">
                      <p className="text-sm leading-6 text-[#6f6258]">{plan.summary}</p>
                      <div className="mt-4">
                        <span className={['text-sm font-black', plan.text].join(' ')}>{plan.picks}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <p className="relative z-10 mt-6 text-center text-sm italic text-[#7c6f63]">~ 2 plans, 1 unforgettable start ~</p>
            </div>

            <aside className="hidden rounded-[24px] border border-[#e5d7c8] bg-white/45 p-5 backdrop-blur lg:block lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#59613f]">Shared experience</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                {features.map((feature, index) => (
                  <div key={feature} className="flex items-center gap-4 text-sm text-[#463d35]">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#d8c8b5] bg-white/65 text-[#59613f]">
                      <Icon name={featureIcons[index]} className="h-5 w-5" />
                    </span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </aside>

            <div className="lg:hidden">
              <div className="mt-5 border-t border-[#e2d2c0] pt-4">
                <h2 className="sr-only">Shared experience</h2>
                <div className="flex flex-wrap justify-center gap-2">
                  {features.map((feature, index) => (
                    <div key={feature} className="flex min-h-10 items-center gap-2 rounded-full border border-[#e2d2c0] bg-white/65 px-3 py-2 text-sm text-[#463d35]">
                      <Icon name={featureIcons[index]} className="h-4 w-4 text-[#59613f]" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
