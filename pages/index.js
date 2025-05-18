// File: pages/index.js
import { useState, useEffect } from 'react';
import InputNumeric from '../components/InputNumeric';
import { db } from '../firebase';
import { doc, setDoc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';

export default function Home() {
  const [step, setStep] = useState('auth');
  const [pin, setPin] = useState('');
  const [total, setTotal] = useState('');
  const [initialDays, setInitialDays] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [history, setHistory] = useState([]);
  const [spendInput, setSpendInput] = useState('');
  const [overflowMessage, setOverflowMessage] = useState('');

  // Fetch and populate budget state from Firestore
  const fetchBudget = async (enteredPin) => {
    const refDoc = doc(db, 'budgets', enteredPin);
    const snap = await getDoc(refDoc);
    if (snap.exists()) {
      const d = snap.data();
      setTotal(String(d.total));
      setInitialDays(d.initialDays);
      setStartDate(d.startDate);
      setHistory(d.history || []);
      setStep(d.total ? 'daily' : 'intro');
    } else {
      setStep('intro');
    }
  };

  // On mount, check for saved PIN and auto-login
  useEffect(() => {
    const savedPin = localStorage.getItem('budget_pin');
    if (savedPin === '6699') {
      setPin(savedPin);
      fetchBudget(savedPin);
    }
  }, []);

  // Sync Firestore on PIN entry
  useEffect(() => {
    if (pin.length === 4) {
      const refDoc = doc(db, 'budgets', pin);
      const unsub = onSnapshot(refDoc, snap => {
        if (snap.exists()) {
          const data = snap.data();
          setTotal(String(data.total));
          setInitialDays(data.initialDays);
          setStartDate(data.startDate);
          setHistory(data.history || []);
          setStep(data.total ? 'daily' : 'intro');
        }
      });
      return () => unsub();
    }
  }, [pin]);

  // Derived budget logic
  const today = new Date();
  const daysElapsed = startDate
    ? Math.floor((today - new Date(startDate)) / (1000 * 60 * 60 * 24))
    : 0;
  const daysLeft = Math.max(initialDays - daysElapsed, 0);
  const used = history.reduce((sum, e) => sum + e.amount, 0);
  const remTotal = (parseFloat(total || 0) - used).toFixed(2);
  const remDaily = daysLeft > 0 ? (remTotal / daysLeft).toFixed(2) : '0.00';

  // Sum of today’s spends
  const sumToday = history.reduce((sum, e) => {
    const d = new Date(e.timestamp);
    return d.toDateString() === new Date().toDateString() ? sum + e.amount : sum;
  }, 0);
  // Today's remaining budget
  const numTodayRem = parseFloat(remDaily) - sumToday;
  const displayToday = Math.max(numTodayRem, 0).toFixed(2);

  const fmt = ts => {
    const d = new Date(ts);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}.${mm}.${yy}, ${hh}:${mi}`;
  };

  // Fetch and populate budget state from Firestore
  const fetchBudget = async (enteredPin) => {
    const refDoc = doc(db, 'budgets', enteredPin);
    const snap = await getDoc(refDoc);
    if (snap.exists()) {
      const d = snap.data();
      setTotal(String(d.total));
      setInitialDays(d.initialDays);
      setStartDate(d.startDate);
      setHistory(d.history || []);
      setStep(d.total ? 'daily' : 'intro');
    } else {
      setStep('intro');
    }
  };

  const handleAuth = async () => {
    console.log('Unlock clicked, pin=', pin);
    try {
      if (pin !== '6699') {
        alert('Invalid PIN');
        return;
      }
      // Persist PIN and load budget
      localStorage.setItem('budget_pin', pin);
      await fetchBudget(pin);
    } catch (err) {
      console.error('handleAuth error', err);
      alert('Error unlocking, see console');
    }
  };

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

  const handleSpend = async () => {
    const amt = parseFloat(spendInput);
    if (!amt || amt <= 0) return;
    const newHist = [...history, { amount: amt, timestamp: new Date().toISOString() }];
    const refDoc = doc(db, 'budgets', pin);
    await updateDoc(refDoc, { history: newHist });
    setHistory(newHist);
    setSpendInput('');
    if (amt > parseFloat(remDaily)) {
      const newDaily = ((parseFloat(remTotal) - amt) / daysLeft).toFixed(2);
      setOverflowMessage(`You spent all money for today! New daily budget is ${newDaily}`);
    } else {
      setOverflowMessage('');
    }
  };

  // Screens
  if (step === 'auth') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Enter PIN</h1>
        <InputNumeric value={pin} onChange={setPin} placeholder="••••" />
        <button onClick={handleAuth} className="mt-4 bg-blue-600 text-white p-3 rounded-2xl w-full">Unlock</button>
      </div>
    );
  }

  if (step === 'intro') {
    return (
      <div className="p-8 space-y-6">
        <h1 className="text-3xl font-semibold">Welcome to LxD budget app</h1>
        <InputNumeric value={total} onChange={setTotal} placeholder="0.00" />
        <label>Select days (1-40):</label>
        <select
          value={initialDays}
          onChange={e => setInitialDays(Number(e.target.value))}
          className="w-full p-4 border rounded-2xl"
        >
          {Array.from({ length: 40 }, (_, i) => (
            <option key={i} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        <p>Days: {initialDays}</p>
        <p>Initial daily: {(parseFloat(total || 0) / initialDays).toFixed(2)}</p>
        <div className="flex space-x-4">
          <button onClick={() => setStep('auth')} className="flex-1 bg-gray-300 p-3 rounded-2xl">BACK</button>
          <button onClick={saveIntro} className="flex-1 bg-blue-600 text-white p-3 rounded-2xl">SAVE</button>
        </div>
      </div>
    );
  }

  if (step === 'daily') {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">
            FOR TODAY YOU HAVE: {' '}
            <span className={numTodayRem < 0 ? 'text-red-600' : ''}>
              {displayToday}
            </span>
          </h1>
          <span className="text-sm">Remaining {remTotal} over {daysLeft} days</span>
        </div>
        <InputNumeric value={spendInput} onChange={setSpendInput} placeholder="0.00" />
        <button onClick={handleSpend} className="mt-2 bg-green-600 text-white p-2 rounded-2xl w-full">OK</button>
        {overflowMessage && (
          <div className="text-red-600 mt-2">
            {overflowMessage}
          </div>
        )}
        <div className="fixed bottom-0 left-0 right-0 flex justify-between p-4 bg-white">
          <button onClick={() => setStep('intro')} className="bg-gray-300 p-3 rounded-2xl">EDIT</button>
          <button onClick={() => setStep('history')} className="bg-gray-300 p-3 rounded-2xl">HISTORY</button>
        </div>
      </div>
    );
  }

  if (step === 'history') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">History (last 72h)</h1>
        <ul className="list-disc pl-5 space-y-2">
          {history.map((e, i) => (
            <li key={i}>{parseFloat(e.amount).toFixed(2)} ({fmt(e.timestamp)})</li>
          ))}
        </ul>
        <button onClick={() => setStep('daily')} className="mt-4 bg-gray-300 p-3 rounded-2xl">BACK</button>
      </div>
    );
  }

  return null;
}
