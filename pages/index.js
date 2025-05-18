import { useState, useEffect } from 'react';
import InputNumeric from '../components/InputNumeric';
import { db } from '../firebase';
import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';(ref, async snap => {
        if (snap.exists()) {
          const data = snap.data();
          setTotal(data.total);
          setInitialDays(data.initialDays);
          setStartDate(data.startDate);
          setHistory(data.history || []);
          // Move to correct screen
          setStep(data.total ? 'daily' : 'intro');
        }
      });
      return unsub;
    }
  }, [pin]);

  const handleAuth = () => {
    if (pin === '6699') {
      setStep('intro');
    } else alert('Invalid PIN');
  };

  const saveIntro = async () => {
    const ref = doc(db, 'budgets', pin);
    const now = new Date().toISOString();
    await setDoc(ref, {
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
    const ref = doc(db, 'budgets', pin);
    await updateDoc(ref, { history: newHist });
    setSpendInput('');
    if (amt > parseFloat(remDaily)) {
      const newDaily = (parseFloat(remTotal) - amt) / daysLeft;
      alert(`You spent all money for today! New daily budget is ${newDaily.toFixed(2)}`);
    }
  };

  const fmt = ts => {
    const d = new Date(ts);
    return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}, ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
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
      <select value={initialDays} onChange={e => setInitialDays(Number(e.target.value))} className="w-full p-4 border rounded-2xl">
        {Array.from({length:40},(_,i)=><option key={i} value={i+1}>{i+1}</option>)}
      </select>
      <p>Days: {initialDays}</p>
      <p>Initial daily: {(parseFloat(total||0)/initialDays).toFixed(2)}</p>
      <div className="flex space-x-4">
        <button onClick={() => setStep('auth')} className="flex-1 bg-gray-300 p-3 rounded-2xl">BACK</button>
        <button onClick={saveIntro} className="flex-1 bg-blue-600 text-white p-3 rounded-2xl">SAVE</button>
      </div>
    </div>
  );

  if (step === 'daily') return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">FOR TODAY YOU HAVE: <span className={parseFloat(remDaily)<0?'text-red-600':''}>{(parseFloat(remDaily)-parseFloat(spendInput||0)).toFixed(2)}</span></h1>
        <span className="text-sm">Remaining {remTotal} over {daysLeft} days</span>
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
        {history.map((e,i)=>(<li key={i}>{parseFloat(e.amount).toFixed(2)} ({fmt(e.timestamp)})</li>))}
      </ul>
      <button onClick={() => setStep('daily')} className="mt-4 bg-gray-300 p-3 rounded-2xl">BACK</button>
    </div>
  );

  return null;
}
