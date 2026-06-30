import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { cities, costBreakdown, planningRules, shortlist, STORAGE_KEY, VOTERS } from '../data/travel2026';

const filters = [
  { id: 'all', label: 'All cities' },
  { id: 'shortlist', label: 'Shortlist' },
  { id: 'dog', label: 'Best for dogs' },
  { id: 'logistics', label: 'Lowest friction' },
];

const scorePercent = (score) => `${Math.round(score * 10)}%`;

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

const countVotes = (votes) => {
  const counts = Object.fromEntries(cities.map((city) => [city.id, 0]));
  Object.values(votes).forEach((cityId) => {
    if (counts[cityId] !== undefined) counts[cityId] += 1;
  });
  return counts;
};

const Button = ({ children, variant = 'primary', ...props }) => (
  <button
    type="button"
    className={[
      'inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#fffaf3]',
      variant === 'primary'
        ? 'bg-[#8b3f2f] text-[#fff9ef] shadow-lg shadow-[#8b3f2f]/20 hover:bg-[#743326] focus:ring-[#8b3f2f]'
        : 'border border-[#e4d7c8] bg-white/70 text-[#241e18] hover:bg-white focus:ring-[#c79548]',
    ].join(' ')}
    {...props}
  >
    {children}
  </button>
);

const ScoreBar = ({ value }) => (
  <div className="h-2.5 overflow-hidden rounded-full bg-[#eadfd2]">
    <div className="h-full rounded-full bg-gradient-to-r from-[#294b3d] to-[#c79548]" style={{ width: scorePercent(value) }} />
  </div>
);

const VoteControls = ({ cityId, votes, onVote }) => {
  const counts = countVotes(votes);
  return (
    <div className="mt-4 min-w-[190px]">
      <div className="h-2 overflow-hidden rounded-full bg-[#eadfd2]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#294b3d] to-[#c79548] transition-[width]"
          style={{ width: `${(counts[cityId] || 0) * 25}%` }}
        />
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <b className="text-[#294b3d]">{counts[cityId] || 0}/4</b>
        <span className="text-xs text-[#6d6258]">votes</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {VOTERS.map((person) => {
          const active = votes[person] === cityId;
          return (
            <button
              key={person}
              type="button"
              onClick={() => onVote(person, cityId)}
              className={[
                'rounded-full border px-2.5 py-1.5 text-xs transition focus:outline-none focus:ring-2 focus:ring-[#c79548]',
                active
                  ? 'border-[#294b3d] bg-[#294b3d] font-black text-[#fff9ef]'
                  : 'border-[#e4d7c8] bg-white/70 text-[#6d6258] hover:bg-white',
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

const CityCard = ({ city, votes, onVote }) => (
  <article className="rounded-[26px] border border-[#e4d7c8] bg-white/75 p-5 shadow-xl shadow-stone-900/5">
    <div className="flex items-center justify-between gap-3">
      <span className="rounded-full bg-[#8b3f2f]/10 px-2.5 py-1 text-xs font-black text-[#8b3f2f]">#{city.rank}</span>
      <span className="font-black text-[#294b3d]">{city.score}/10</span>
    </div>
    <h3 className="mt-4 text-2xl font-black text-[#241e18]">{city.name}</h3>
    <p className="mt-2 min-h-16 text-sm leading-6 text-[#6d6258]">{city.summary}</p>
    <div className="mt-4">
      <ScoreBar value={city.score} />
    </div>
    <dl className="mt-4 grid grid-cols-2 gap-3">
      <div>
        <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6d6258]">Transfer</dt>
        <dd className="mt-1 font-black">{city.transfer}</dd>
      </div>
      <div>
        <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#6d6258]">Cost</dt>
        <dd className="mt-1 font-black">{city.cost}</dd>
      </div>
    </dl>
    <VoteControls cityId={city.id} votes={votes} onVote={onVote} />
  </article>
);

export default function Travel2026Page() {
  const [votes, setVotes] = useState({});
  const [hydrated, setHydrated] = useState(false);
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedVotes = decodeVotes(params.get('votes'));
    const storedVotes = (() => {
      try {
        return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
      } catch {
        return {};
      }
    })();
    const nextVotes = sharedVotes || storedVotes;
    setVotes(nextVotes);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextVotes));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  }, [hydrated, votes]);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  const voteCounts = useMemo(() => countVotes(votes), [votes]);
  const voteSummary = useMemo(
    () =>
      cities
        .map((city) => ({ ...city, votes: voteCounts[city.id] || 0 }))
        .filter((city) => city.votes > 0)
        .sort((a, b) => b.votes - a.votes || a.rank - b.rank),
    [voteCounts]
  );

  const visibleCities = useMemo(() => {
    if (filter === 'shortlist') return cities.filter((city) => shortlist.includes(city.id));
    if (filter === 'dog') return [...cities].filter((city) => city.dogs >= 8).sort((a, b) => b.dogs - a.dogs || a.rank - b.rank);
    if (filter === 'logistics') return [...cities].filter((city) => city.access >= 8).sort((a, b) => b.access - a.access || a.rank - b.rank);
    return cities;
  }, [filter]);

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
        <title>Italy New Year Dog Trip - City Comparison with Voting</title>
        <meta
          name="description"
          content="Dog-first Italy New Year 2026/27 city comparison with shared voting for Treviso, Mantua, Lucca, Ferrara, Cernobbio, and more."
        />
      </Head>

      <main className="min-h-screen bg-[radial-gradient(circle_at_15%_5%,rgba(199,149,72,.25),transparent_28rem),radial-gradient(circle_at_85%_10%,rgba(41,75,61,.18),transparent_28rem),linear-gradient(180deg,#fffaf3,#fbf6ef)] text-[#241e18]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:py-12 lg:px-6 lg:py-16">
          <header className="rounded-[32px] border border-[#e4d7c8] bg-white/75 p-7 shadow-2xl shadow-stone-900/10 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.13em] text-[#8b3f2f]">Italy New Year 2026/27 - 4 adults - 2 dachshunds</p>
                <h1 className="mt-3 max-w-4xl font-serif text-5xl font-black leading-[0.95] sm:text-7xl lg:text-8xl">Where should we stay?</h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6d6258]">
                  A dog-first comparison for a relaxed 29 Dec-3 Jan trip from Cyprus via Venice or Milan. Includes Lucca and Crema,
                  plus a voting board for Lera V, Lera D, Alina, and Danya.
                </p>
                <div className="mt-6 max-w-4xl rounded-3xl bg-[#241e18] p-5 leading-7 text-[#fff9ef]">
                  <b className="text-[#ffd895]">Recommendation:</b> choose <b className="text-[#ffd895]">Treviso</b> unless the group explicitly wants a more romantic/cultural birthday setting, in which case choose <b className="text-[#ffd895]">Mantua</b>. <b className="text-[#ffd895]">Lucca</b> is the best new contender if everyone accepts the longer transfer.
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button onClick={() => setModalOpen(true)}>Cost estimate</Button>
                  <Button variant="secondary" onClick={() => document.querySelector('#voting')?.scrollIntoView({ behavior: 'smooth' })}>Voting</Button>
                  <Button variant="secondary" onClick={() => document.querySelector('#comparison')?.scrollIntoView({ behavior: 'smooth' })}>Comparison</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {cities.slice(0, 4).map((city) => (
                  <div key={city.id} className="rounded-2xl border border-[#e4d7c8] bg-white/70 p-4">
                    <b className="block text-xl">{city.name}</b>
                    <span className="text-xs text-[#6d6258]">{city.summary}</span>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <section className="mt-9">
            <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-serif text-4xl font-black">Top shortlist</h2>
                <p className="mt-2 text-sm text-[#6d6258]">Fastest decision set. The full ranked list remains below.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={[
                      'rounded-full border px-3 py-2 text-sm font-bold transition',
                      filter === item.id ? 'border-[#294b3d] bg-[#294b3d] text-[#fff9ef]' : 'border-[#e4d7c8] bg-white/70 text-[#241e18] hover:bg-white',
                    ].join(' ')}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleCities.slice(0, filter === 'all' ? 6 : visibleCities.length).map((city) => (
                <CityCard key={city.id} city={city} votes={votes} onVote={toggleVote} />
              ))}
            </div>
          </section>

          <section id="voting" className="mt-9 rounded-[28px] bg-[#241e18] p-6 text-[#fff9ef] shadow-2xl shadow-stone-900/10">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="font-serif text-4xl font-black">Group voting</h2>
                <p className="mt-3 max-w-2xl leading-7 text-[#fff9ef]/75">
                  Each person gets one final vote. Clicking another city moves that person&apos;s vote. Votes are saved in this browser and can also be shared by link.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button onClick={resetVotes}>Reset votes</Button>
                  <Button variant="secondary" onClick={copyShareLink}>Copy share link</Button>
                  <Button variant="secondary" onClick={copySummary}>Copy summary</Button>
                </div>
                {notice && <p className="mt-3 text-sm font-bold text-[#ffd895]">{notice}</p>}
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                {voteSummary.length ? (
                  <div className="space-y-2">
                    {voteSummary.map((city) => (
                      <div key={city.id} className="grid grid-cols-[1fr_52px] items-center gap-3 border-b border-white/10 py-2 last:border-0">
                        <span className="font-bold">{city.name}</span>
                        <b className="text-right text-[#ffd895]">{city.votes}/4</b>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm leading-6 text-[#fff9ef]/70">No votes yet. Click a name under a city to start.</p>
                )}
              </div>
            </div>
          </section>

          <section className="mt-9">
            <h2 className="mb-4 font-serif text-4xl font-black">Overall suitability ranking</h2>
            <div className="rounded-[28px] border border-[#e4d7c8] bg-white/75 p-5">
              <div className="space-y-1">
                {cities.map((city) => (
                  <div key={city.id} className="grid grid-cols-[minmax(120px,210px)_1fr_54px] items-center gap-3 border-b border-[#e4d7c8]/80 py-2 last:border-0">
                    <span className="font-bold">{city.name}</span>
                    <ScoreBar value={city.score} />
                    <b className="text-right text-[#294b3d]">{city.score}/10</b>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="comparison" className="mt-9">
            <h2 className="mb-4 font-serif text-4xl font-black">Full comparison</h2>

            <div className="hidden overflow-auto rounded-[28px] border border-[#e4d7c8] bg-white/75 shadow-2xl shadow-stone-900/10 lg:block">
              <table className="w-full min-w-[1180px] border-collapse">
                <thead>
                  <tr className="bg-[#fff5e8] text-left text-xs uppercase tracking-[0.05em] text-[#8b3f2f]">
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
                    <th className="p-3">Brutal note</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city) => (
                    <tr key={city.id} className="border-b border-[#e4d7c8]/80 align-top last:border-0">
                      <td className="p-3 text-xl font-black text-[#8b3f2f]">{city.rank}</td>
                      <td className="p-3">
                        <b>{city.name}</b>
                        <br />
                        <span className="text-xs text-[#6d6258]">{city.airport}</span>
                      </td>
                      <td className="p-3">{city.transfer}</td>
                      <td className="p-3">{city.cost}</td>
                      <td className="p-3">{city.dogs}/10</td>
                      <td className="p-3">{city.access}/10</td>
                      <td className="p-3">{city.taste}/10</td>
                      <td className="p-3">{city.calm}/10</td>
                      <td className="p-3">
                        <VoteControls cityId={city.id} votes={votes} onVote={toggleVote} />
                      </td>
                      <td className="p-3">
                        <b>{city.score}/10</b>
                        <br />
                        <span className="mt-1 inline-block rounded-full bg-[#8b3f2f]/10 px-2 py-1 text-xs font-black text-[#8b3f2f]">{city.status}</span>
                      </td>
                      <td className="max-w-sm p-3 leading-6 text-[#6d6258]">{city.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 lg:hidden">
              {cities.map((city) => (
                <article key={city.id} className="rounded-3xl border border-[#e4d7c8] bg-white/75 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-[#8b3f2f]">#{city.rank}</p>
                      <h3 className="text-xl font-black">{city.name}</h3>
                      <p className="text-xs text-[#6d6258]">{city.airport}</p>
                    </div>
                    <b className="text-[#294b3d]">{city.score}/10</b>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div><dt className="text-[#6d6258]">Transfer</dt><dd className="font-bold">{city.transfer}</dd></div>
                    <div><dt className="text-[#6d6258]">Cost</dt><dd className="font-bold">{city.cost}</dd></div>
                    <div><dt className="text-[#6d6258]">Dogs</dt><dd className="font-bold">{city.dogs}/10</dd></div>
                    <div><dt className="text-[#6d6258]">Access</dt><dd className="font-bold">{city.access}/10</dd></div>
                  </dl>
                  <p className="mt-4 leading-6 text-[#6d6258]">{city.note}</p>
                  <VoteControls cityId={city.id} votes={votes} onVote={toggleVote} />
                </article>
              ))}
            </div>
          </section>

          <section className="mt-9 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#e4d7c8] bg-white/70 p-5">
              <h3 className="text-xl font-black">Cost assumption</h3>
              <p className="mt-2 leading-7 text-[#6d6258]">Estimated per couple, excluding flights, for 5 nights. The modal breaks down accommodation, food, cafes, restaurants, transport, museums, gifts, and pet extras.</p>
              <div className="mt-4"><Button variant="secondary" onClick={() => setModalOpen(true)}>Open cost breakdown</Button></div>
            </div>
            <div className="rounded-3xl border border-[#e4d7c8] bg-white/70 p-5">
              <h3 className="text-xl font-black">Dog assumption</h3>
              <p className="mt-2 leading-7 text-[#6d6258]">Dachshund logic matters: flat streets, short loops, low stairs, low fireworks exposure, easy station access, and a comfortable apartment matter more than postcard value.</p>
            </div>
          </section>

          <footer className="mt-8 text-sm leading-6 text-[#6d6258]">
            Prepared 2026-06-19. Treat transfer times and costs as planning ranges; check exact 29 Dec 2026 and 3 Jan 2027 flights/trains before booking.
          </footer>
        </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#241e18]/55 p-5" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setModalOpen(false)}>
          <section className="max-h-[86vh] w-full max-w-4xl overflow-auto rounded-[28px] border border-[#e4d7c8] bg-[#fffaf3] shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="cost-modal-title">
            <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-[#e4d7c8] bg-[#fffaf3]/95 p-5 backdrop-blur">
              <div>
                <h2 id="cost-modal-title" className="font-serif text-3xl font-black">What the estimate covers</h2>
                <p className="mt-2 leading-6 text-[#6d6258]">Per couple, excluding flights, for 29 Dec-3 Jan / 5 nights. Assumes a shared pet-friendly 2-bedroom apartment for 4 adults + 2 dogs and a relaxed, non-luxury trip style.</p>
              </div>
              <button type="button" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#e4d7c8] bg-white text-2xl" onClick={() => setModalOpen(false)} aria-label="Close cost breakdown">x</button>
            </div>
            <div className="p-5">
              <div className="divide-y divide-[#e4d7c8]">
                {costBreakdown.map(([label, text, amount]) => (
                  <div key={label} className="grid gap-2 py-3 md:grid-cols-[170px_1fr_130px]">
                    <b className="text-[#294b3d]">{label}</b>
                    <span className="leading-6 text-[#6d6258]">{text}</span>
                    <strong>{amount}</strong>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-3xl border border-[#8b3f2f]/15 bg-[#8b3f2f]/5 p-5">
                <h3 className="font-black">Rule of thumb</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 leading-7 text-[#6d6258]">
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
