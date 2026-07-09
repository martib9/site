import TravelPlanPage from '../../components/TravelPlanPage';
import { cities, costBreakdown, planningRules, shortlist, STORAGE_KEY, VOTERS } from '../../data/travelMilan2026';

const milanTheme = {
  pageBg: 'bg-[#fffaf3]',
  pageStyle: {
    background: 'radial-gradient(circle at 12% 0%, rgba(39,76,68,.19), transparent 28rem), radial-gradient(circle at 88% 8%, rgba(134,62,43,.16), transparent 30rem), linear-gradient(180deg,#fffaf3,#f7efe5)',
  },
  text: 'text-[#241e18]',
  headingText: 'text-[#274c44]',
  mutedText: 'text-[#6d6258]',
  accentText: 'text-[#9a4a2d]',
  scoreText: 'text-[#274c44]',
  linkText: 'text-[#274c44]',
  border: 'border-[#e4d4c2]',
  softBorder: 'border-[#e4d4c2]/80',
  divide: 'divide-[#e4d4c2]',
  track: 'bg-[#e9dccd]',
  bar: 'bg-gradient-to-r from-[#274c44] via-[#9a4a2d] to-[#c99a4f]',
  buttonPrimary: 'bg-[#274c44] text-[#fff9ef] shadow-lg shadow-[#274c44]/20 hover:bg-[#1d3933] focus:ring-[#274c44] focus:ring-offset-[#fffaf3]',
  buttonSecondary: 'border border-[#e4d4c2] bg-white/70 text-[#241e18] hover:bg-white focus:ring-[#c99a4f] focus:ring-offset-[#fffaf3]',
  filterActive: 'border-[#274c44] bg-[#274c44] text-[#fff9ef]',
  filterIdle: 'border-[#e4d4c2] bg-white/70 text-[#241e18] hover:bg-white',
  voteActive: 'border-[#274c44] bg-[#274c44] font-black text-[#fff9ef]',
  voteIdle: 'border-[#e4d4c2] bg-white/70 text-[#6d6258] hover:bg-white',
  rankPill: 'bg-[#9a4a2d]/10 text-[#9a4a2d]',
  rankBadge: 'bg-[#9a4a2d]',
  verdictBg: 'bg-gradient-to-br from-[#274c44] to-[#1e3430]',
  votePanelBg: 'bg-gradient-to-br from-[#274c44] to-[#9a4a2d]',
  noticeText: 'text-[#ffd895]',
  tableHead: 'bg-[#fff3e4] text-[#9a4a2d]',
  noteBox: 'border-[#274c44]/15 bg-[#274c44]/5',
  patternStyle: {
    backgroundImage: 'linear-gradient(90deg, rgba(39,76,68,.04) 1px, transparent 1px), linear-gradient(rgba(154,74,45,.035) 1px, transparent 1px)',
    backgroundSize: '38px 38px',
  },
  imageFade: 'bg-gradient-to-r from-transparent via-transparent to-[#fffaf3]/25',
  scriptText: 'text-[#9a4a2d]',
  stamp: 'border-[#bfa891] text-[#9b806a]',
  leaf: 'text-[#59613f]/55',
  dotColor: '#274c44',
  dotEmptyColor: '#ded1c4',
};

const milanPlan = {
  mark: 'MI',
  image: '/travel-assets/milan-postcard.jpg',
  postcardLabel: 'Lake light, Milan access, soft winter',
  eyebrow: 'Final Italy New Year 2026/27 - Milan/Malpensa route',
  title: 'Where should we stay from Milan?',
  scriptLine: 'Italy New Year dog trip',
  description:
    'Final dog-first comparison for 4 adults and 2 dachshunds, assuming Milan/Malpensa tickets. The goal stays practical: cozy walks, good food and coffee, light art, birthday dinners, and a calm New Year.',
  mobileDescription: 'Final Milan-route shortlist: lake bases, easy transfers, dog logistics, and calm winter rhythm.',
  recommendationLead: 'Final recommendation:',
  recommendation:
    'choose Como city or Cernobbio if you want the trip to feel special. Choose Varese if you want the least annoying dog logistics. Keep Montemagno only for a car-based countryside/agriturismo version.',
  shortlistIntro: 'Final Milan-route decision set. The full ranked list remains below.',
  costIntro:
    'Estimated per couple, excluding flights, for 5 nights. The modal breaks down accommodation, food, cafes, restaurants, transport, museums, gifts, and pet extras.',
  dogIntro:
    'Dachshund logic matters: flat or gentle walks, short transfers from Malpensa, low stairs, low fireworks exposure, easy groceries, and a comfortable apartment beat postcard value.',
  modalIntro:
    'Per couple, excluding flights, for 29 Dec-3 Jan / 5 nights. Assumes a shared pet-friendly 2-bedroom apartment for 4 adults + 2 dogs and a relaxed, non-luxury trip style.',
  footer:
    'Prepared 2026-07-09. Treat transfer times and costs as planning ranges; check exact 29 Dec 2026 and 3 Jan 2027 flights, trains, pet rules, and winter ferry schedules before booking.',
  metaTitle: 'Final Italy New Year Dog Trip - Milan Base Comparison',
  metaDescription:
    'Final Milan/Malpensa-based Italy New Year 2026/27 dog-friendly city comparison with voting for Como, Cernobbio, Varese, Lecco, Pavia, Orta, and more.',
  theme: milanTheme,
};

export default function MilanTravelPage() {
  return (
    <TravelPlanPage
      cities={cities}
      costBreakdown={costBreakdown}
      plan={milanPlan}
      planningRules={planningRules}
      shortlist={shortlist}
      storageKey={STORAGE_KEY}
      voters={VOTERS}
    />
  );
}
