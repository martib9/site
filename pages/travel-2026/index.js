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
    dog: (
      <>
        <circle cx="6.5" cy="10" r="2.1" />
        <circle cx="12" cy="7" r="2.1" />
        <circle cx="17.5" cy="10" r="2.1" />
        <path d="M7.5 17c1-4 8-4 9 0 .6 2.4-1.8 3.6-4.5 3.6S6.9 19.4 7.5 17Z" />
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

const finalPlan = {
  href: '/travel-2026/milan',
  country: 'ITALY VIA MILAN',
  label: 'Final New Year dog-friendly plan',
  image: '/travel-assets/milan-postcard.jpg',
  tone: 'from-[#274c44] via-[#9a4a2d] to-[#c99a4f]',
  text: 'text-[#274c44]',
  border: 'border-[#d9bfa7]',
  summary: 'Milan/Malpensa route with lake bases, easy transfers, dog logistics, cozy food, and calm winter rhythm.',
  picks: 'Como, Cernobbio, Varese',
  scores: [
    ['Special', 9],
    ['Dogs', 9],
    ['Access', 9],
  ],
};

const archivePlans = [
  {
    href: '/travel-2026/italy',
    country: 'ITALY',
    label: 'Original country shortlist',
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
    label: 'Alternative country plan',
    image: '/travel-assets/france-postcard.jpg',
    tone: 'from-[#223a5e] to-[#862d3e]',
    text: 'text-[#223a5e]',
    border: 'border-[#d8c9bb]',
    summary: 'Cozy river towns around Paris, cafe mornings, light culture, and winter calm.',
    picks: 'Chartres, Rouen, Senlis',
  },
];

const features = ['Final Milan route', 'Ranked shortlist', 'Side-by-side comparison', 'Group voting', 'Mobile-first'];
const featureIcons = ['pin', 'list', 'compare', 'vote', 'mobile'];

const pageStyle = {
  background: 'radial-gradient(circle at 14% 5%, rgba(39,76,68,.13), transparent 26rem), radial-gradient(circle at 86% 8%, rgba(154,74,45,.13), transparent 28rem), linear-gradient(180deg,#fffdf7,#fbf1e4)',
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
    final
    <br />
    travel
    <br />
    2026
  </div>
);

const ScoreDots = ({ label, value }) => (
  <div>
    <div className="mb-1 flex items-center justify-between gap-2 text-[11px] font-black uppercase tracking-[0.08em] text-[#5c5348]">
      <span>{label}</span>
      <span>{value}/10</span>
    </div>
    <div className="flex gap-1">
      {Array.from({ length: 10 }).map((_, index) => (
        <span key={index} className={['h-1.5 w-1.5 rounded-full', index < value ? 'bg-[#274c44]' : 'bg-[#dfd1c0]'].join(' ')} />
      ))}
    </div>
  </div>
);

const ArchiveCard = ({ plan }) => (
  <Link
    href={plan.href}
    className={[
      'group min-w-0 overflow-hidden rounded-[14px] border bg-white/82 shadow-lg shadow-stone-900/10 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#c79548]',
      plan.border,
    ].join(' ')}
  >
    <div className="relative h-36 overflow-hidden sm:h-44">
      <img src={plan.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/88 via-white/48 to-transparent" />
      <div className="absolute inset-0 p-4">
        <h3 className={['inline-block max-w-full break-words rounded-xl bg-white/62 px-2 py-1 font-serif text-2xl font-black leading-none backdrop-blur-sm sm:text-3xl', plan.text].join(' ')}>
          {plan.country}
        </h3>
        <p className="mt-2 max-w-[10rem] rounded-xl bg-white/55 p-2 text-xs font-bold leading-5 text-[#2d2922] backdrop-blur-sm">{plan.label}</p>
        <div className="absolute bottom-4 right-4 rounded-full bg-white/75 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#756657] backdrop-blur">
          Archive
        </div>
      </div>
    </div>
    <div className="border-t border-[#e2d2c0]/70 p-4">
      <p className="text-sm leading-6 text-[#6f6258]">{plan.summary}</p>
      <p className={['mt-3 text-sm font-black', plan.text].join(' ')}>{plan.picks}</p>
    </div>
  </Link>
);

export default function TravelSelectorPage() {
  return (
    <>
      <Head>
        <title>Travel 2026 - Final Italy via Milan</title>
        <meta
          name="description"
          content="Final Italy via Milan dog-friendly New Year 2026/27 travel plan, with archived Italy and France comparison routes."
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

          <section className="box-border grid w-full min-w-0 flex-1 items-start gap-8 py-8 sm:py-10 lg:grid-cols-[210px_1fr_230px] lg:py-12">
            <aside className="hidden pt-24 lg:block">
              <div className="mb-8 grid h-9 w-9 place-items-center rounded-full text-[#59613f]">
                <Icon name="pin" className="h-7 w-7" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#59613f]">Final plan</p>
              <h1 className="mt-5 max-w-xs font-serif text-4xl font-black leading-[0.98] text-[#29311f]">Italy via Milan</h1>
              <div className="mt-6 h-px w-16 bg-[#59613f]" />
              <p className="mt-6 max-w-[11rem] leading-7 text-[#4d463e]">Milan/Malpensa is now the route. The decision is the base.</p>
              <div className="mt-12 text-[#59613f]">
                <Icon name="dog" className="h-10 w-10" />
              </div>
            </aside>

            <div className="relative mx-auto box-border w-full min-w-0 max-w-[calc(100vw-2rem)] overflow-hidden rounded-[26px] border border-[#d9c8b6] bg-[#fffaf0]/92 p-5 shadow-2xl shadow-stone-900/15 backdrop-blur sm:max-w-4xl sm:p-7 lg:p-8">
              <Botanical side="left" />
              <Botanical side="right" />
              <Stamp className="absolute right-8 top-12" />

              <header className="relative z-10 mx-auto max-w-2xl text-center">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9a4a2d]">Travel 2026</p>
                <h1 className="mt-3 break-words font-serif text-3xl font-black leading-[0.98] text-[#1f2119] sm:text-5xl">
                  Final plan: Italy via Milan
                </h1>
                <p className="mx-auto mt-3 max-w-lg break-words font-serif text-base italic leading-7 text-[#8b6e58] sm:text-lg">
                  Where should we stay from Milan with our dogs?
                </p>
                <div className="mx-auto mt-4 h-px w-16 bg-[#a88955]" />
              </header>

              <Link
                href={finalPlan.href}
                className="group relative z-10 mt-7 grid min-w-0 overflow-hidden rounded-[18px] border border-[#d9bfa7] bg-white/86 shadow-2xl shadow-stone-900/15 transition hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#c79548] md:grid-cols-[1.15fr_0.85fr]"
              >
                <div className="relative min-h-[260px] overflow-hidden sm:min-h-[330px]">
                  <img src={finalPlan.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/60 to-transparent md:to-white/12" />
                  <div className="absolute inset-0 p-5 sm:p-7">
                    <span className="inline-flex rounded-full bg-[#274c44] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#fff9ef] shadow-lg shadow-[#274c44]/20">
                      Final
                    </span>
                    <h2 className={['mt-5 max-w-[15rem] break-words font-serif text-4xl font-black leading-[0.92] sm:text-6xl', finalPlan.text].join(' ')}>
                      {finalPlan.country}
                    </h2>
                    <p className="mt-3 max-w-[14rem] rounded-xl bg-white/62 p-3 text-sm font-bold leading-6 text-[#2d2922] backdrop-blur-sm">{finalPlan.label}</p>
                    <span className={['mt-5 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xl font-black text-white shadow-lg transition group-hover:translate-x-1', finalPlan.tone].join(' ')}>
                      <span aria-hidden="true">-&gt;</span>
                    </span>
                  </div>
                </div>
                <div className="relative p-5 sm:p-7">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#9a4a2d]">Milan base decision</p>
                  <p className="mt-4 text-base leading-7 text-[#5b5147]">{finalPlan.summary}</p>
                  <p className={['mt-5 text-lg font-black', finalPlan.text].join(' ')}>{finalPlan.picks}</p>
                  <div className="mt-6 grid gap-3">
                    {finalPlan.scores.map(([label, value]) => (
                      <ScoreDots key={label} label={label} value={value} />
                    ))}
                  </div>
                  <div className="mt-6 inline-flex rounded-full bg-[#f0e4d6] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#756657]">
                    Open final page
                  </div>
                </div>
              </Link>

              <section className="relative z-10 mt-8">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#59613f]">Archive</p>
                    <h2 className="mt-2 font-serif text-2xl font-black text-[#29311f] sm:text-3xl">Previous comparison pages</h2>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {archivePlans.map((plan) => (
                    <ArchiveCard key={plan.country} plan={plan} />
                  ))}
                </div>
              </section>

              <p className="relative z-10 mt-6 text-center text-sm italic text-[#7c6f63]">~ final route chosen, base still to decide ~</p>
            </div>

            <aside className="hidden rounded-[24px] border border-[#e5d7c8] bg-white/45 p-5 backdrop-blur lg:block lg:border-0 lg:bg-transparent lg:p-0 lg:pt-24 lg:backdrop-blur-0">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#59613f]">Decision tool</h2>
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
                <h2 className="sr-only">Decision tool</h2>
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
