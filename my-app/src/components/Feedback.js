// src/components/Feedback.js
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Feedback() {
  const [email, setEmail]     = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser]       = useState(null);
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => {
      if (u) {
        setUser(u);
        setEmail(u.email);
      }
    });
    return unsubscribe;
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);
    if (!email || !message) {
      setStatus({ type: 'error', text: 'Completează toate câmpurile.' });
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        email,
        message,
        uid: user?.uid || null,
        createdAt: serverTimestamp(),
      });
      setStatus({ type: 'success', text: 'Mulțumim pentru feedback!' });
      setMessage('');
      if (!user) setEmail('');
    } catch {
      setStatus({ type: 'error', text: 'Eroare, încearcă din nou.' });
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Feedback</h1>
        {status && (
          <p className={`mb-4 text-center ${status.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
            {status.text}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
              required
              readOnly={!!user}
            />
          </label>
          <label className="block">
            Mesaj
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="mt-1 w-full p-2 border rounded h-32 resize-none"
              required
            />
          </label>
          <button
            type="submit"
            className={`w-full bg-blue text-white py-2 rounded hover:bg-light-blue transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Trimit...' : 'Trimite'}
          </button>
        </form>
      </div>
    </div>
  );
}
