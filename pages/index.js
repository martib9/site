// File: pages/index.js
import { useState, useEffect } from 'react';
import InputNumeric from '../components/InputNumeric';
import { db } from '../firebase';
import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getDoc
} from 'firebase/firestore';

export default function Home() {
  const [step, setStep] = useState('auth');
  const [pin, setPin] = useState('');
  const [total, setTotal] = useState('');
  const [initialDays, setInitialDays] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [history, setHistory] = useState([]);
  const [spendInput, setSpendInput] = useState('');

  // 1. Real-time sync when PIN is 4 digits
  useEffect(() => {
    if (pin.length === 4) {
      const refDoc = doc(db, 'budgets', pin);
      const unsub = onSnapshot(refDoc, snap => {
        if (snap.exists()) {
          const d = snap.data();
          setTotal(String(d.total));
          setInitialDays(d.initialDays);
          setStartDate(d.startDate);
          setHistory(d.history || []);
          setStep(d.total ? 'daily' : 'intro');
        }
      });
      return () => unsub();
    }
  }, [pin]);

  // 2. Compute days left & remaining budgets
  const today = new Date();
  const daysElapsed = startDate
    ? Math.floor((today - new Date(startDate)) / 86400000)
    : 0;
  const daysLeft = Math.max(initialDays - daysElapsed, 0);
  const used = history.reduce((sum, e) => sum + e.amount, 0);
  const remTotal = (parseFloat(total || 0) - used).toFixed(2);
  const remDaily = daysLeft > 0 ? (remTotal / daysLeft).toFixed(2) : '0.00';

  // 3. Calculate today’s used & remaining
  const sumToday = history.reduce((sum, e) => {
    const d = new Date(e.timestamp);
    return d.toDateString() === new Date().toDateString()
      ? sum + e.amount
      : sum;
  }, 0);
  const todayRemaining = (parseFloat(remDaily) - sumToday).toFixed(2);

  // 4. Unlock handler: fetch existing doc immediately
  const handleAuth = async () => {
    if (pin === '6699') {
      const refDoc = doc(db, 'budgets', pin);
      const snap = await getDoc(refDoc);
      if (snap.exists()) {
        const d = snap.data();
        setTotal(String(d.total));
        setInitialDays(d.initialDays);
        setStartDate(d.startDate);
        setHistory(d.history || []);
        setStep('daily');
      } else {
        setStep('intro');
      }
    } else {
      alert('Invalid PIN');
    }
  };

  // 5. Save intro data
  const saveIntro = async () => {
    const refDoc = doc(db, 'budgets', pin);
    const now = new Date().toISOString();
    await setDoc(refDoc, {
      total: parseFloat(total),
      initialDays,
      startDate: now,
      history: []
    });
    setStartDate(now);
    setStep('daily');
  };

  // 6. Spend handler
  const handleSpend = async () => {
    const amt = parseFloat(spendInput);
    if (!amt || amt <= 0) return;
    const newHist = [
      ...history,
      { amount: amt, timestamp: new Date().toISOString() }
    ];
    const refDoc = doc(db, 'budgets', pin);
    await updateDoc(refDoc, { history: newHist });
    setHistory(newHist);
    setSpendInput('');
    if (amt > parseFloat(remDaily)) {
      const newDaily = (
        (parseFloat(remTotal) - amt) /
        daysLeft
      ).toFixed(2);
      alert(`You spent all money for today! New daily budget is ${newDaily}`);
    }
  };

  // 7. Timestamp formatter
  const fmt = ts => {
    const d = new Date(ts);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}.${mm}.${yy}, ${hh}:${mi}`;
  };

  // === UI Screens ===

  // Auth screen
  if (step === 'auth') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Enter PIN</h1>
        <InputNumeric
          value={pin}
          onChange={setPin}
          placeholder="••••"
        />
        <button
          onClick={handleAuth}
          className="mt-4 bg-blue-600 text-white p-3 rounded-2xl w-full"
        >
          Unlock
        </button>
      </div>
    );
  }

  // Intro screen
  if (step === 'intro') {
    return (
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-semibold">
          Welcome to LxD budget app
        </h1>
        <InputNumeric
          value={total}
          onChange={setTotal}
          placeholder="0.00"
        />
        <label>Select days (1-40):</label>
        <select
          value={initialDays}
          onChange={e => setInitialDays(Number(e.target.value))}
          className="w-full p-4 border rounded-2xl"
        >
          {Array.from({ length: 40 }, (_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <p>Days: {initialDays}</p>
        <p>
          Initial daily: {(parseFloat(total || 0) / initialDays).toFixed(
            2
          )}
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => setStep('auth')}
            className="flex-1 bg-gray-300 p-3 rounded-2xl"
          >
            BACK
          </button>
          <button
            onClick={saveIntro}
            className="flex-1 bg-blue-600 text-white p-3 rounded-2xl"
          >
            SAVE
          </button>
        </div>
      </div>
    );
  }

  // Daily screen
  if (step === 'daily') {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">
            FOR TODAY YOU HAVE:{' '}
            <span
              className={
                parseFloat(todayRemaining) < 0 ? 'text-red-600' : ''
              }
            >
              {todayRemaining}
            </span>
          </h1>
          <span className="text-sm">
            Remaining {remTotal} over {daysLeft} days
          </span>
        </div>
        <InputNumeric
          value={spendInput}
          onChange={setSpendInput}
          placeholder="0.00"
        />
        <button
          onClick={handleSpend}
          className="mt-2 bg-green-600 text-white p-2 rounded-2xl"
        >
          OK
        </button>
        <div className="fixed bottom-0 left-0 right-0 flex justify-between p-4 bg-white">
          <button
            onClick={() => setStep('intro')}
            className="bg-gray-300 p-3 rounded-2xl"
          >
            EDIT
          </button>
          <button
            onClick={() => setStep('history')}
            className="bg-gray-300 p-3 rounded-2xl"
          >
            HISTORY
          </button>
        </div>
      </div>
    );
  }

  // History screen
  if (step === 'history') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">
          History (last 72h)
        </h1>
        <ul className="list-disc pl-5 space-y-2">
          {history.map((e, i) => (
            <li key={i}>
              {parseFloat(e.amount).toFixed(2)} ({fmt(e.timestamp)})
            </li>
          ))}
        </ul>
        <button
          onClick={() => setStep('daily')}
          className="mt-4 bg-gray-300 p-3 rounded-2xl"
        >
          BACK
        </button>
      </div>
    );
  }

  return null;
}