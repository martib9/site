import { useState, useEffect } from 'react';
import InputNumeric from '../components/InputNumeric';
export default function Home() {
  const [step, setStep] = useState('auth');
  const [pin, setPin] = useState('');
  const [total, setTotal] = useState('');
  const [days, setDays] = useState(1);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedTotal = localStorage.getItem('budget_total');
    const storedDays = localStorage.getItem('budget_days');
    if (storedTotal && storedDays) {
      setTotal(storedTotal);
      setDays(Number(storedDays));
      setSaved(true);
      setStep('daily');
    }
  }, []);

  const handleAuth = () => {
    if (pin === '6699') {
      setStep(saved ? 'daily' : 'intro');
    } else {
      alert('Invalid PIN');
    }
  };

  const saveIntro = () => {
    localStorage.setItem('budget_total', total);
    localStorage.setItem('budget_days', days);
    setSaved(true);
    setStep('daily');
  };

  if (step === 'auth') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Enter PIN</h1>
        <InputNumeric value={pin} onChange={setPin} placeholder="••••" />
        <button
          onClick={handleAuth}
          className="mt-4 bg-blue-600 text-white p-3 rounded-2xl w-full"
        >Unlock</button>
      </div>
    );
  }

  if (step === 'intro') {
    const moneyPerDay = (parseFloat(total) / days || 0).toFixed(2);
    return (
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-semibold">Welcome to LxD budget app</h1>
        <p>Please insert your current available money.</p>
        <InputNumeric value={total} onChange={setTotal} placeholder="0.00" />
        <label className="block">Select days (1-40):</label>
        <select
          value={days}
          onChange={e => setDays(Number(e.target.value))}
          className="w-full p-4 rounded-2xl border"
        >
          {Array.from({ length: 40 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        <p>Days left: {days}</p>
        <p>Money per day: {moneyPerDay}</p>
        <div className="flex space-x-4">
          <button
            disabled={!saved}
            onClick={() => setStep('daily')}
            className="flex-1 bg-gray-300 p-3 rounded-2xl"
          >BACK</button>
          <button
            onClick={saveIntro}
            className="flex-1 bg-blue-600 text-white p-3 rounded-2xl"
          >SAVE</button>
        </div>
      </div>
    );
  }

  if (step === 'daily') return <p>Daily Screen Coming Soon</p>;
  return null;
}
