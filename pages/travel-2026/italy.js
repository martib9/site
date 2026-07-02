import TravelPlanPage from '../../components/TravelPlanPage';
import { cities, costBreakdown, planningRules, shortlist, STORAGE_KEY, VOTERS } from '../../data/travel2026';

const italyTheme = {
  pageBg: 'bg-[#fffaf3]',
  pageStyle: {
    background: 'radial-gradient(circle at 14% 0%, rgba(199,149,72,.22), transparent 28rem), radial-gradient(circle at 86% 10%, rgba(41,75,61,.18), transparent 30rem), linear-gradient(180deg,#fffaf3,#fbf6ef)',
  },
  text: 'text-[#241e18]',
  headingText: 'text-[#8b3f2f]',
  mutedText: 'text-[#6d6258]',
  accentText: 'text-[#8b3f2f]',
  scoreText: 'text-[#294b3d]',
  linkText: 'text-[#8b3f2f]',
  border: 'border-[#e4d7c8]',
  softBorder: 'border-[#e4d7c8]/80',
  divide: 'divide-[#e4d7c8]',
  track: 'bg-[#eadfd2]',
  bar: 'bg-gradient-to-r from-[#294b3d] via-[#8b3f2f] to-[#c79548]',
  buttonPrimary: 'bg-[#8b3f2f] text-[#fff9ef] shadow-lg shadow-[#8b3f2f]/20 hover:bg-[#743326] focus:ring-[#8b3f2f] focus:ring-offset-[#fffaf3]',
  buttonSecondary: 'border border-[#e4d7c8] bg-white/70 text-[#241e18] hover:bg-white focus:ring-[#c79548] focus:ring-offset-[#fffaf3]',
  filterActive: 'border-[#294b3d] bg-[#294b3d] text-[#fff9ef]',
  filterIdle: 'border-[#e4d7c8] bg-white/70 text-[#241e18] hover:bg-white',
  voteActive: 'border-[#294b3d] bg-[#294b3d] font-black text-[#fff9ef]',
  voteIdle: 'border-[#e4d7c8] bg-white/70 text-[#6d6258] hover:bg-white',
  rankPill: 'bg-[#8b3f2f]/10 text-[#8b3f2f]',
  verdictBg: 'bg-[#241e18]',
  votePanelBg: 'bg-[#241e18]',
  noticeText: 'text-[#ffd895]',
  tableHead: 'bg-[#fff5e8] text-[#8b3f2f]',
  noteBox: 'border-[#8b3f2f]/15 bg-[#8b3f2f]/5',
  patternStyle: {
    backgroundImage: 'linear-gradient(90deg, rgba(139,63,47,.045) 1px, transparent 1px), linear-gradient(rgba(41,75,61,.035) 1px, transparent 1px)',
    backgroundSize: '38px 38px',
  },
  imageFade: 'bg-gradient-to-r from-transparent via-transparent to-[#fffaf3]/25',
};

const italyPlan = {
  mark: 'IT',
  image: '/travel-assets/italy-postcard.png',
  postcardLabel: 'Canals, aperitivo, olive light',
  eyebrow: 'Italy New Year 2026/27 - 4 adults - 2 dachshunds',
  title: 'Where should we stay?',
  description:
    'A dog-first comparison for a relaxed 29 Dec-3 Jan trip from Cyprus via Venice or Milan. Includes Lucca and Crema, plus a voting board for Lera V, Lera D, Alina, and Danya.',
  recommendationLead: 'Recommendation:',
  recommendation:
    'choose Treviso unless the group explicitly wants a more romantic/cultural birthday setting, in which case choose Mantua. Lucca is the best new contender if everyone accepts the longer transfer.',
  shortlistIntro: 'Fastest Italy decision set. The full ranked list remains below.',
  costIntro:
    'Estimated per couple, excluding flights, for 5 nights. The modal breaks down accommodation, food, cafes, restaurants, transport, museums, gifts, and pet extras.',
  dogIntro:
    'Dachshund logic matters: flat streets, short loops, low stairs, low fireworks exposure, easy station access, and a comfortable apartment matter more than postcard value.',
  modalIntro:
    'Per couple, excluding flights, for 29 Dec-3 Jan / 5 nights. Assumes a shared pet-friendly 2-bedroom apartment for 4 adults + 2 dogs and a relaxed, non-luxury trip style.',
  footer:
    'Prepared 2026-06-19. Treat transfer times and costs as planning ranges; check exact 29 Dec 2026 and 3 Jan 2027 flights/trains before booking.',
  metaTitle: 'Italy New Year Dog Trip - City Comparison with Voting',
  metaDescription:
    'Dog-first Italy New Year 2026/27 city comparison with shared voting for Treviso, Mantua, Lucca, Ferrara, Cernobbio, and more.',
  theme: italyTheme,
};

export default function ItalyTravelPage() {
  return (
    <TravelPlanPage
      cities={cities}
      costBreakdown={costBreakdown}
      plan={italyPlan}
      planningRules={planningRules}
      shortlist={shortlist}
      storageKey={STORAGE_KEY}
      voters={VOTERS}
    />
  );
}
