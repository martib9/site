import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function useBudget(pin) {
  const [budget, setBudget] = useState(null);

  useEffect(() => {
    if (!pin) return;
    const unsub = onSnapshot(doc(db, 'budgets', pin), snap => {
      setBudget(snap.exists() ? snap.data() : null);
    });
    return unsub;
  }, [pin]);

  return budget;
}