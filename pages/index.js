import { useState, useEffect } from 'react';
import InputNumeric from '../components/InputNumeric';

export default function Home() {
  const [step, setStep] = useState('auth');
  const [pin, setPin] = useState('');
  const [total, setTotal] = useState('');
  const [days, setDays] = useState(1);
  const [history, setHistory] = useState([]);
  const [spendInput, setSpendInput] = useState('');

  // Load saved data
  useEffect(() => {
    const savedPin = localStorage.getItem('budget_pin');
    const savedTotal = localStorage.getItem('budget_total');
    const savedDays = localStorage.getItem('budget_days');
    const savedHist = JSON.parse(localStorage.getItem('budget_history') || '[]');
    // filter out entries older than 72h
    const cutoff = Date.now() - 72 * 3600 * 1000;
    const filtered = savedHist.filter(e => e.timestamp >= cutoff);
    if (filtered.length !== savedHist.length) {
      localStorage.setItem('budget_history', JSON.stringify(filtered));
    }
    setHistory(filtered);
    if (savedTotal && savedDays) {
      setTotal(savedTotal);
      setDays(Number(savedDays));
      // if PIN already entered, go to daily
      setStep(savedPin === 'true' ? 'daily' : 'auth');
    }
  }, []);

  const handleAuth = () => {
    if (pin === '6699') {
      localStorage.setItem('budget_pin', 'true');
      setStep(total ? 'daily' : 'intro');
    } else alert('Invalid PIN');
  };

  const saveIntro = () => {
    localStorage.setItem('budget_total', total);
    localStorage.setItem('budget_days', days);
    setStep('daily');
  };

  // Compute budgets
  const used = history.reduce((sum, e) => sum + e.amount, 0);
  const remTotal = parseFloat(total || 0) - used;
  const remDaily = parseFloat((remTotal / days || 0).toFixed(2));
  const todayOver = spendInput && Number(spendInput) > remDaily;

  const handleSpend = () => {
    const amt = parseFloat(spendInput);
    if (!amt || amt <= 0) return;
    const newTotal = remTotal - amt;
    const newRemDaily = parseFloat((newTotal / days || 0).toFixed(2));
    const entry = { amount: amt, timestamp: Date.now() };
    const newHist = [...history, entry];
    setHistory(newHist);
    localStorage.setItem('budget_history', JSON.stringify(newHist));
    setSpendInput('');
    if (amt > remDaily) {
      alert(`You spent all money for today! New daily budget is ${newRemDaily}`);
    }
  };

  // Format timestamp
  const fmt = ts => {
    const d = new Date(ts);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth()+1).padStart(2, '0');
    const yy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}.${mm}.${yy}, ${hh}:${mi}`;
  };

  // Screens
  if (step === 'auth') return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Enter PIN</h1>
      <InputNumeric value={pin} onChange={setPin} placeholder="••••" />
      <button onClick={handleAuth} className="mt-4 bg-blue-600 text-white p-3 rounded-2xl w-full">Unlock</button>
    </div>
  );

  if (step === 'intro') return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-semibold">Welcome to LxD budget app</h1>
      <InputNumeric value={total} onChange={setTotal} placeholder="0.00" />
      <label>Select days (1-40):</label>
      <select value={days} onChange={e => setDays(Number(e.target.value))} className="w-full p-4 border rounded-2xl">
        {Array.from({length:40},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}
      </select>
      <p>Days left: {days}</p>
      <p>Money per day: {(parseFloat(total||0)/days).toFixed(2)}</p>
      <div className="flex space-x-4">
        <button onClick={() => setStep('auth')} className="flex-1 bg-gray-300 p-3 rounded-2xl">BACK</button>
        <button onClick={saveIntro} className="flex-1 bg-blue-600 text-white p-3 rounded-2xl">SAVE</button>
      </div>
    </div>
  );

  if (step === 'daily') return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">FOR TODAY YOU HAVE: <span className={remDaily<0||todayOver?'text-red-600':''}>{Math.max(remDaily,0).toFixed(2)}</span></h1>
        <span className="text-sm">You have {remTotal.toFixed(2)} for {days} days</span>
      </div>
      <InputNumeric value={spendInput} onChange={setSpendInput} placeholder="0.00" />
      <button onClick={handleSpend} className="mt-2 bg-green-600 text-white p-2 rounded-2xl">OK</button>
      <div className="fixed bottom-0 left-0 right-0 flex justify-between p-4 bg-white">
        <button onClick={() => setStep('intro')} className="bg-gray-300 p-3 rounded-2xl">EDIT</button>
        <button onClick={() => setStep('history')} className="bg-gray-300 p-3 rounded-2xl">HISTORY</button>
      </div>
    </div>
  );

  if (step === 'history') return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">History (last 72h)</h1>
      <ul className="list-disc pl-5 space-y-2">
        {history.map((e,i)=>(
          <li key={i}>{e.amount.toFixed(2)} ({fmt(e.timestamp)})</li>
        ))}
      </ul>
      <button onClick={() => setStep('daily')} className="mt-4 bg-gray-300 p-3 rounded-2xl">BACK</button>
    </div>
  );

  return null;
}
