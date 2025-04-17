import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Parolele nu coincid');
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-4">Înregistrare</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Email
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </label>
        <label className="block mb-2">
          Parolă
          <input
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </label>
        <label className="block mb-2">
          Confirmă parola
          <input
            type="password"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            required
          />
        </label>
        <button type="submit" className="w-full bg-blue text-white py-2 rounded mt-4 hover:bg-light-blue">
          Înregistrare
        </button>
      </form>
      <p className="mt-4">
        Ai deja cont?{' '}
        <Link to="/login" className="text-blue hover:underline">
          Conectează-te
        </Link>
      </p>
    </div>
  );
}