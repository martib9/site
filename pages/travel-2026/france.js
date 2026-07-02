import TravelPlanPage from '../../components/TravelPlanPage';
import { cities, costBreakdown, planningRules, shortlist, STORAGE_KEY, VOTERS } from '../../data/travelFrance2026';

const franceTheme = {
  pageBg: 'bg-[#fffdf8]',
  pageStyle: {
    background: 'radial-gradient(circle at 12% 0%, rgba(34,58,94,.16), transparent 28rem), radial-gradient(circle at 88% 8%, rgba(134,45,62,.14), transparent 30rem), linear-gradient(180deg,#fffdf8,#fff8ef)',
  },
  text: 'text-[#22202a]',
  headingText: 'text-[#223a5e]',
  mutedText: 'text-[#6f6872]',
  accentText: 'text-[#862d3e]',
  scoreText: 'text-[#223a5e]',
  linkText: 'text-[#223a5e]',
  border: 'border-[#e7d9ca]',
  softBorder: 'border-[#e7d9ca]/85',
  divide: 'divide-[#e7d9ca]',
  track: 'bg-[#eee0d2]',
  bar: 'bg-gradient-to-r from-[#223a5e] via-[#862d3e] to-[#c8a15a]',
  buttonPrimary: 'bg-[#223a5e] text-[#fffaf2] shadow-lg shadow-[#223a5e]/20 hover:bg-[#172942] focus:ring-[#223a5e] focus:ring-offset-[#fff8ef]',
  buttonSecondary: 'border border-[#e7d9ca] bg-white/70 text-[#223a5e] hover:bg-white focus:ring-[#862d3e] focus:ring-offset-[#fff8ef]',
  filterActive: 'border-[#223a5e] bg-[#223a5e] text-[#fffaf2]',
  filterIdle: 'border-[#e7d9ca] bg-white/70 text-[#22202a] hover:bg-white',
  voteActive: 'border-[#223a5e] bg-[#223a5e] font-black text-[#fffaf2]',
  voteIdle: 'border-[#e7d9ca] bg-white/70 text-[#6f6872] hover:bg-white',
  rankPill: 'bg-[#862d3e]/10 text-[#862d3e]',
  verdictBg: 'bg-gradient-to-br from-[#223a5e] to-[#17253c]',
  votePanelBg: 'bg-gradient-to-br from-[#223a5e] to-[#862d3e]',
  noticeText: 'text-[#ffe2a3]',
  tableHead: 'bg-[#fff2e1] text-[#862d3e]',
  noteBox: 'border-[#223a5e]/15 bg-[#223a5e]/5',
  patternStyle: {
    backgroundImage: 'linear-gradient(90deg, rgba(34,58,94,.04) 1px, transparent 1px), linear-gradient(rgba(134,45,62,.035) 1px, transparent 1px)',
    backgroundSize: '38px 38px',
  },
  imageFade: 'bg-gradient-to-r from-transparent via-transparent to-[#fff8ef]/30',
};

const francePlan = {
  mark: 'FR',
  image: '/travel-assets/france-postcard.png',
  postcardLabel: 'Cafe, river stone, winter lights',
  eyebrow: 'France New Year 2026/27 - 4 adults - 2 dachshunds',
  title: 'Small cities around Paris',
  description:
    'A dog-first comparison for a relaxed 29 Dec-3 Jan trip via Paris/CDG: cozy streets, short daily walks, food, coffee, light art, a calm New Year, and enough winter life to avoid feeling stranded.',
  recommendationLead: 'Executive recommendation:',
  recommendation:
    'choose Chartres as the safest all-round base. Choose Rouen if food and culture matter more than small-town quiet. Choose Senlis only if everyone accepts weaker transport logistics for maximum charm.',
  shortlistIntro: 'Fastest France decision set. The full ranked list remains below.',
  costIntro:
    'Estimated per couple, excluding flights, for 5 nights. The modal breaks down accommodation, food, cafes, restaurants, transport, museums, gifts, and pet extras.',
  dogIntro:
    'Dachshund logic matters: short loops, low stairs, low fireworks exposure, easy station access, train pet rules, and a comfortable apartment are more important than the prettiest postcard town.',
  modalIntro:
    'Per couple, excluding flights, for 29 Dec-3 Jan / 5 nights. Assumes a shared pet-friendly 2-bedroom apartment for 4 adults + 2 dogs and a relaxed, non-luxury trip style.',
  footer:
    'Prepared 2026-07-02. Treat transfer times and costs as planning ranges; check exact 29 Dec 2026 and 3 Jan 2027 Cyprus Airways flights, SNCF trains, and pet rules before booking.',
  metaTitle: 'France New Year Dog Trip - City Comparison with Voting',
  metaDescription:
    'Dog-first France New Year 2026/27 city comparison with shared voting for Chartres, Rouen, Senlis, Fontainebleau, Chantilly, and more.',
  theme: franceTheme,
};

export default function FranceTravelPage() {
  return (
    <TravelPlanPage
      cities={cities}
      costBreakdown={costBreakdown}
      plan={francePlan}
      planningRules={planningRules}
      shortlist={shortlist}
      storageKey={STORAGE_KEY}
      voters={VOTERS}
    />
  );
}
