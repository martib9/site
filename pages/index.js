import { useState, useEffect } from 'react';
import InputNumeric from '../components/InputNumeric';
import useBudget from '../hooks/useBudget';
import { db } from '../firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

export default function Home() {
  const [pin, setPin] = useState(localStorage.getItem('budget_pin') || '');
  const [step, setStep] = useState(pin ? 'daily' : 'auth');
  const budget = useBudget(pin);
  const [spendInput, setSpendInput] = useState('');
  const [overflowMessage, setOverflowMessage] = useState('');

  useEffect(() => {
    if (budget) setStep('daily');
    else if (pin) setStep('intro');
  }, [budget, pin]);

  const handleSpend = async () => {
    const amt = parseFloat(spendInput);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const newHist = [...budget.history, { amount: amt, timestamp: new Date().toISOString() }];
    const refDoc = doc(db, 'budgets', pin);
    try {
      await updateDoc(refDoc, { history: newHist });
      setSpendInput('');
    } catch (error) {
      console.error('Firestore update error:', error);
      alert('Error updating spend. Try again.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Budget App</h1>
      <InputNumeric value={spendInput} onChange={setSpendInput} placeholder="0.00" />
      <button onClick={handleSpend} className="mt-2 bg-green-600 text-white p-2 rounded-2xl w-full">OK</button>
      <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
        <div
          className="bg-green-600 h-2.5 rounded-full"
          style={{ width: `${Math.min((budget.todaySpend / budget.dailyLimit) * 100, 100)}%` }}
        ></div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around py-3">
        <button className="text-gray-600">Budget</button>
        <button className="text-gray-600">Edit</button>
        <button className="text-gray-600">History</button>
      </div>
    </div>
  );
}