import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Feedback() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setEmail(u.email);
      }
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!email || !message) {
      setStatus({ type: 'error', text: 'Te rog completează toate câmpurile.' });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        email,
        message,
        createdAt: serverTimestamp(),
        uid: user ? user.uid : null,
      });
      setStatus({ type: 'success', text: 'Mulțumim pentru feedback!' });
      setMessage('');
      if (!user) setEmail('');
    } catch (err) {
      setStatus({ type: 'error', text: 'A apărut o eroare. Încearcă din nou.' });
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Feedback</h1>
      {status && (
        <p className={`mb-4 ${status.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
          {status.text}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <label className="block mb-4">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
            readOnly={!!user}
          />
        </label>
        <label className="block mb-4">
          Mesaj
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded mt-1 h-32 resize-none"
            required
          />
        </label>
        <button
          type="submit"
          className={`w-full bg-blue text-white py-2 rounded mt-2 hover:bg-light-blue ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Se trimite...' : 'Trimite'}
        </button>
      </form>
    </div>
  );
}