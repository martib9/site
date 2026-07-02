import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const filters = [
  { id: 'all', label: 'All cities' },
  { id: 'shortlist', label: 'Shortlist' },
  { id: 'dog', label: 'Best for dogs' },
  { id: 'logistics', label: 'Lowest friction' },
];

const scorePercent = (score) => `${Math.round(score * 10)}%`;
const scoreLabel = (score) => `${Number.isInteger(score) ? score : score.toFixed(1).replace('.0', '')}/10`;

const encodeVotes = (votes) => {
  if (typeof window === 'undefined') return '';
  return window.btoa(unescape(encodeURIComponent(JSON.stringify(votes))));
};

const decodeVotes = (value) => {
  if (typeof window === 'undefined' || !value) return null;
  try {
    return JSON.parse(decodeURIComponent(escape(window.atob(value))));
  } catch {
    return null;
  }
};

const countVotes = (cities, votes) => {
  const counts = Object.fromEntries(cities.map((city) => [city.id, 0]));
  Object.values(votes).forEach((cityId) => {
    if (counts[cityId] !== undefined) counts[cityId] += 1;
  });
  return counts;
};

const Button = ({ children, theme, variant = 'primary', ...props }) => (
  <button
    type="button"
    className={[
      'inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55',
      variant === 'primary' ? theme.buttonPrimary : theme.buttonSecondary,
    ].join(' ')}
    {...props}
  >
    {children}
  </button>
);

const ScoreBar = ({ theme, value }) => (
  <div className={['h-2.5 overflow-hidden rounded-full', theme.track].join(' ')}>
    <div className={['h-full rounded-full', theme.bar].join(' ')} style={{ width: scorePercent(value) }} />
  </div>
);

const VoteControls = ({ cities, cityId, ready, theme, votes, voters, onVote }) => {
  const counts = countVotes(cities, votes);
  return (
    <div className="mt-4 min-w-[190px]">
      <div className={['h-2 overflow-hidden rounded-full', theme.track].join(' ')}>
        <div
          className={['h-full rounded-full transition-[width]', theme.bar].join(' ')}
          style={{ width: `${(counts[cityId] || 0) * 25}%` }}
        />
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <b className={theme.scoreText}>{counts[cityId] || 0}/4</b>
        <span className={['text-xs', theme.mutedText].join(' ')}>votes</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {voters.map((person) => {
          const active = votes[person] === cityId;
          return (
            <button
              key={person}
              type="button"
              disabled={!ready}
              onClick={() => onVote(person, cityId)}
              className={[
                'rounded-full border px-2.5 py-1.5 text-xs transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-55',
                active ? theme.voteActive : theme.voteIdle,
              ].join(' ')}
              aria-pressed={active}
            >
              {person}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const CityCard = ({ cities, city, ready, theme, votes, voters, onVote }) => (
  <article className={['rounded-[26px] border bg-white/75 p-5 shadow-xl shadow-stone-900/5', theme.border].join(' ')}>
    <div className="flex items-center justify-between gap-3">
      <span className={['rounded-full px-2.5 py-1 text-xs font-black', theme.rankPill].join(' ')}>#{city.rank}</span>
      <span className={['font-black', theme.scoreText].join(' ')}>{scoreLabel(city.score)}</span>
    </div>
    <h3 className={['mt-4 text-2xl font-black', theme.headingText].join(' ')}>{city.name}</h3>
    <p className={['mt-2 min-h-16 text-sm leading-6', theme.mutedText].join(' ')}>{city.summary}</p>
    <div className="mt-4">
      <ScoreBar theme={theme} value={city.score} />
    </div>
    <dl className="mt-4 grid grid-cols-2 gap-3">
      <div>
        <dt className={['text-[11px] font-bold uppercase tracking-[0.08em]', theme.mutedText].join(' ')}>Transfer</dt>
        <dd className="mt-1 font-black">{city.transfer}</dd>
      </div>
      <div>
        <dt className={['text-[11px] font-bold uppercase tracking-[0.08em]', theme.mutedText].join(' ')}>Cost</dt>
        <dd className="mt-1 font-black">{city.cost}</dd>
      </div>
    </dl>
    <VoteControls cities={cities} cityId={city.id} ready={ready} theme={theme} votes={votes} voters={voters} onVote={onVote} />
  </article>
);

export default function TravelPlanPage({ cities, costBreakdown, plan, planningRules, shortlist, storageKey, voters }) {
  const [votes, setVotes] = useState({});
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const theme = plan.theme;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedVotes = decodeVotes(params.get('votes'));
    const storedVotes = (() => {
      try {
        return JSON.parse(window.localStorage.getItem(storageKey)) || {};
      } catch {
        return {};
      }
    })();
    const nextVotes = sharedVotes || storedVotes;
    setVotes(nextVotes);
    window.localStorage.setItem(storageKey, JSON.stringify(nextVotes));
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(votes));
  }, [hydrated, storageKey, votes]);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  const voteCounts = useMemo(() => countVotes(cities, votes), [cities, votes]);
  const voteSummary = useMemo(
    () =>
      cities
        .map((city) => ({ ...city, votes: voteCounts[city.id] || 0 }))
        .filter((city) => city.votes > 0)
        .sort((a, b) => b.votes - a.votes || a.rank - b.rank),
    [cities, voteCounts]
  );

  const visibleCities = useMemo(() => {
    if (filter === 'shortlist') return cities.filter((city) => shortlist.includes(city.id));
    if (filter === 'dog') return [...cities].filter((city) => city.dogs >= 8).sort((a, b) => b.dogs - a.dogs || a.rank - b.rank);
    if (filter === 'logistics') return [...cities].filter((city) => city.access >= 8).sort((a, b) => b.access - a.access || a.rank - b.rank);
    return cities;
  }, [cities, filter, shortlist]);

  const toggleVote = (person, cityId) => {
    setVotes((current) => {
      const next = { ...current };
      if (next[person] === cityId) delete next[person];
      else next[person] = cityId;
      return next;
    });
  };

  const resetVotes = () => {
    setVotes({});
    setNotice('Votes reset');
  };

  const copyShareLink = async () => {
    const encoded = encodeVotes(votes);
    const url = `${window.location.origin}${window.location.pathname}${encoded ? `?votes=${encoded}` : ''}`;
    await navigator.clipboard?.writeText(url);
    setNotice('Share link copied');
  };

  const copySummary = async () => {
    const lines = voteSummary.length
      ? voteSummary.map((city) => `${city.name}: ${city.votes}/4`).join('\n')
      : 'No votes yet.';
    await navigator.clipboard?.writeText(lines);
    setNotice('Vote summary copied');
  };

  return (
    <>
      <Head>
        <title>{plan.metaTitle}</title>
        <meta name="description" content={plan.metaDescription} />
      </Head>

      <main className={['min-h-screen overflow-hidden', theme.pageBg, theme.text].join(' ')} style={theme.pageStyle}>
        <div className="pointer-events-none fixed inset-0 opacity-[0.16]" aria-hidden="true">
          <div className="absolute inset-0" style={theme.patternStyle} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-5 sm:py-8 lg:px-6 lg:py-12">
          <nav className="mb-4 flex items-center justify-between gap-3 text-sm">
            <Link href="/travel-2026" className={['font-black', theme.linkText].join(' ')}>
              Back to plans
            </Link>
            <div className={['rounded-full border bg-white/65 px-3 py-1.5 font-bold', theme.border, theme.mutedText].join(' ')}>
              martib.app / travel-2026
            </div>
          </nav>

          <header className={['overflow-hidden rounded-[28px] border bg-white/80 shadow-2xl shadow-stone-900/10 sm:rounded-[34px]', theme.border].join(' ')}>
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[260px] overflow-hidden lg:min-h-[520px]">
                <img src={plan.image} alt="" className="h-full min-h-[260px] w-full object-cover lg:min-h-[520px]" />
                <div className={['absolute inset-0', theme.imageFade].join(' ')} />
                <div className={['absolute bottom-4 left-4 rounded-full border bg-white/80 px-3 py-1 text-xs font-black backdrop-blur', theme.border, theme.linkText].join(' ')}>
                  {plan.postcardLabel}
                </div>
              </div>
              <div className="relative p-6 sm:p-9 lg:p-12">
                <div className={['absolute right-4 top-2 font-serif text-[8rem] font-black leading-none opacity-[0.07] sm:text-[11rem]', theme.headingText].join(' ')} aria-hidden="true">
                  {plan.mark}
                </div>
                <p className={['relative text-xs font-black uppercase tracking-[0.13em]', theme.accentText].join(' ')}>{plan.eyebrow}</p>
                <h1 className={['relative mt-3 max-w-3xl font-serif text-5xl font-black leading-[0.95] sm:text-6xl lg:text-7xl', theme.headingText].join(' ')}>
                  {plan.title}
                </h1>
                <p className={['relative mt-5 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8', theme.mutedText].join(' ')}>
                  {plan.description}
                </p>
                <div className={['relative mt-6 max-w-3xl rounded-3xl p-5 leading-7 text-white', theme.verdictBg].join(' ')}>
                  <b>{plan.recommendationLead}</b> {plan.recommendation}
                </div>
                <div className="relative mt-6 flex flex-wrap gap-3">
                  <Button theme={theme} disabled={!hydrated} onClick={() => setModalOpen(true)}>Cost estimate</Button>
                  <Button theme={theme} disabled={!hydrated} variant="secondary" onClick={() => document.querySelector('#voting')?.scrollIntoView({ behavior: 'smooth' })}>Voting</Button>
                  <Button theme={theme} disabled={!hydrated} variant="secondary" onClick={() => document.querySelector('#comparison')?.scrollIntoView({ behavior: 'smooth' })}>Comparison</Button>
                </div>
              </div>
            </div>
          </header>

          <section className="mt-8 sm:mt-10">
            <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className={['font-serif text-4xl font-black', theme.headingText].join(' ')}>Top shortlist</h2>
                <p className={['mt-2 text-sm', theme.mutedText].join(' ')}>{plan.shortlistIntro}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={!hydrated}
                    onClick={() => setFilter(item.id)}
                    className={[
                      'rounded-full border px-3 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-55',
                      filter === item.id ? theme.filterActive : theme.filterIdle,
                    ].join(' ')}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleCities.slice(0, filter === 'all' ? 6 : visibleCities.length).map((city) => (
                <CityCard key={city.id} cities={cities} city={city} ready={hydrated} theme={theme} votes={votes} voters={voters} onVote={toggleVote} />
              ))}
            </div>
          </section>

          <section id="voting" className={['mt-8 rounded-[28px] p-5 text-white shadow-2xl shadow-stone-900/10 sm:p-6', theme.votePanelBg].join(' ')}>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="font-serif text-4xl font-black">Group voting</h2>
                <p className="mt-3 max-w-2xl leading-7 text-white/75">
                  Each person gets one final vote. Clicking another city moves that person&apos;s vote. Votes are saved in this browser and can also be shared by link.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button theme={theme} disabled={!hydrated} onClick={resetVotes}>Reset votes</Button>
                  <Button theme={theme} disabled={!hydrated} variant="secondary" onClick={copyShareLink}>Copy share link</Button>
                  <Button theme={theme} disabled={!hydrated} variant="secondary" onClick={copySummary}>Copy summary</Button>
                </div>
                {notice && <p className={['mt-3 text-sm font-bold', theme.noticeText].join(' ')}>{notice}</p>}
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                {voteSummary.length ? (
                  <div className="space-y-2">
                    {voteSummary.map((city) => (
                      <div key={city.id} className="grid grid-cols-[1fr_52px] items-center gap-3 border-b border-white/10 py-2 last:border-0">
                        <span className="font-bold">{city.name}</span>
                        <b className={['text-right', theme.noticeText].join(' ')}>{city.votes}/4</b>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm leading-6 text-white/70">No votes yet. Click a name under a city to start.</p>
                )}
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h2 className={['mb-4 font-serif text-4xl font-black', theme.headingText].join(' ')}>Overall suitability ranking</h2>
            <div className={['rounded-[28px] border bg-white/75 p-4 sm:p-5', theme.border].join(' ')}>
              <div className="space-y-1">
                {cities.map((city) => (
                  <div key={city.id} className={['grid grid-cols-[minmax(104px,210px)_1fr_54px] items-center gap-3 border-b py-2 last:border-0', theme.softBorder].join(' ')}>
                    <span className="text-sm font-bold sm:text-base">{city.name}</span>
                    <ScoreBar theme={theme} value={city.score} />
                    <b className={['text-right text-sm sm:text-base', theme.scoreText].join(' ')}>{scoreLabel(city.score)}</b>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="comparison" className="mt-8">
            <h2 className={['mb-4 font-serif text-4xl font-black', theme.headingText].join(' ')}>Full comparison</h2>

            <div className={['hidden overflow-auto rounded-[28px] border bg-white/75 shadow-2xl shadow-stone-900/10 lg:block', theme.border].join(' ')}>
              <table className="w-full min-w-[1180px] border-collapse">
                <thead>
                  <tr className={['text-left text-xs uppercase tracking-[0.05em]', theme.tableHead].join(' ')}>
                    <th className="p-3">#</th>
                    <th className="p-3">Base</th>
                    <th className="p-3">Transfer</th>
                    <th className="p-3">Cost / couple</th>
                    <th className="p-3">Dogs</th>
                    <th className="p-3">Access</th>
                    <th className="p-3">Taste</th>
                    <th className="p-3">NY calm</th>
                    <th className="p-3">Votes</th>
                    <th className="p-3">Overall</th>
                    <th className="p-3">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city) => (
                    <tr key={city.id} className={['border-b align-top last:border-0', theme.softBorder].join(' ')}>
                      <td className={['p-3 text-xl font-black', theme.accentText].join(' ')}>{city.rank}</td>
                      <td className="p-3">
                        <b>{city.name}</b>
                        <br />
                        <span className={['text-xs', theme.mutedText].join(' ')}>{city.airport}</span>
                      </td>
                      <td className="p-3">{city.transfer}</td>
                      <td className="p-3">{city.cost}</td>
                      <td className="p-3">{scoreLabel(city.dogs)}</td>
                      <td className="p-3">{scoreLabel(city.access)}</td>
                      <td className="p-3">{scoreLabel(city.taste)}</td>
                      <td className="p-3">{scoreLabel(city.calm)}</td>
                      <td className="p-3">
                        <VoteControls cities={cities} cityId={city.id} ready={hydrated} theme={theme} votes={votes} voters={voters} onVote={toggleVote} />
                      </td>
                      <td className="p-3">
                        <b>{scoreLabel(city.score)}</b>
                        <br />
                        <span className={['mt-1 inline-block rounded-full px-2 py-1 text-xs font-black', theme.rankPill].join(' ')}>{city.status}</span>
                      </td>
                      <td className={['max-w-sm p-3 leading-6', theme.mutedText].join(' ')}>{city.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 lg:hidden">
              {cities.map((city) => (
                <article key={city.id} className={['rounded-3xl border bg-white/75 p-4', theme.border].join(' ')}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={['text-sm font-black', theme.accentText].join(' ')}>#{city.rank}</p>
                      <h3 className={['text-xl font-black', theme.headingText].join(' ')}>{city.name}</h3>
                      <p className={['text-xs', theme.mutedText].join(' ')}>{city.airport}</p>
                    </div>
                    <b className={theme.scoreText}>{scoreLabel(city.score)}</b>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div><dt className={theme.mutedText}>Transfer</dt><dd className="font-bold">{city.transfer}</dd></div>
                    <div><dt className={theme.mutedText}>Cost</dt><dd className="font-bold">{city.cost}</dd></div>
                    <div><dt className={theme.mutedText}>Dogs</dt><dd className="font-bold">{scoreLabel(city.dogs)}</dd></div>
                    <div><dt className={theme.mutedText}>Access</dt><dd className="font-bold">{scoreLabel(city.access)}</dd></div>
                  </dl>
                  <p className={['mt-4 leading-6', theme.mutedText].join(' ')}>{city.note}</p>
                  <VoteControls cities={cities} cityId={city.id} ready={hydrated} theme={theme} votes={votes} voters={voters} onVote={toggleVote} />
                </article>
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className={['rounded-3xl border bg-white/70 p-5', theme.border].join(' ')}>
              <h3 className={['text-xl font-black', theme.headingText].join(' ')}>Cost assumption</h3>
              <p className={['mt-2 leading-7', theme.mutedText].join(' ')}>{plan.costIntro}</p>
              <div className="mt-4"><Button theme={theme} disabled={!hydrated} variant="secondary" onClick={() => setModalOpen(true)}>Open cost breakdown</Button></div>
            </div>
            <div className={['rounded-3xl border bg-white/70 p-5', theme.border].join(' ')}>
              <h3 className={['text-xl font-black', theme.headingText].join(' ')}>Dog assumption</h3>
              <p className={['mt-2 leading-7', theme.mutedText].join(' ')}>{plan.dogIntro}</p>
            </div>
          </section>

          <footer className={['mt-8 text-sm leading-6', theme.mutedText].join(' ')}>
            {plan.footer}
          </footer>
        </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#241e18]/55 p-5" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setModalOpen(false)}>
          <section className={['max-h-[86vh] w-full max-w-4xl overflow-auto rounded-[28px] border bg-[#fffaf3] shadow-2xl', theme.border].join(' ')} role="dialog" aria-modal="true" aria-labelledby="cost-modal-title">
            <div className={['sticky top-0 flex items-start justify-between gap-4 border-b bg-[#fffaf3]/95 p-5 backdrop-blur', theme.border].join(' ')}>
              <div>
                <h2 id="cost-modal-title" className={['font-serif text-3xl font-black', theme.headingText].join(' ')}>What the estimate covers</h2>
                <p className={['mt-2 leading-6', theme.mutedText].join(' ')}>{plan.modalIntro}</p>
              </div>
              <button type="button" className={['grid h-10 w-10 shrink-0 place-items-center rounded-full border bg-white text-2xl', theme.border].join(' ')} onClick={() => setModalOpen(false)} aria-label="Close cost breakdown">x</button>
            </div>
            <div className="p-5">
              <div className={['divide-y', theme.divide].join(' ')}>
                {costBreakdown.map(([label, text, amount]) => (
                  <div key={label} className="grid gap-2 py-3 md:grid-cols-[170px_1fr_130px]">
                    <b className={theme.scoreText}>{label}</b>
                    <span className={['leading-6', theme.mutedText].join(' ')}>{text}</span>
                    <strong>{amount}</strong>
                  </div>
                ))}
              </div>
              <div className={['mt-5 rounded-3xl border p-5', theme.noteBox].join(' ')}>
                <h3 className="font-black">Rule of thumb</h3>
                <ul className={['mt-2 list-disc space-y-1 pl-5 leading-7', theme.mutedText].join(' ')}>
                  {planningRules.map((rule) => <li key={rule}>{rule}</li>)}
                </ul>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
