import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  updatePassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser]                 = useState(null);
  const [oldPassword, setOldPassword]   = useState('');
  const [newPassword, setNewPassword]   = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage]           = useState(null);
  const navigate                        = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (u) setUser(u);
      else navigate('/login');
    });
    return unsub;
  }, [navigate]);

  const handleChangePassword = async e => {
    e.preventDefault();
    setMessage(null);
    if (newPassword !== confirmPassword) {
      setMessage('Parolele noi nu coincid');
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        oldPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setMessage('Parola schimbată cu succes.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center">Profil</h1>
        <p className="mb-4 text-center"><strong>Email:</strong> {user.email}</p>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <label className="block">
            Parola veche
            <input
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </label>
          <label className="block">
            Noua parolă
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </label>
          <label className="block">
            Confirmă parola nouă
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full bg-blue text-white py-2 rounded hover:bg-light-blue transition"
          >
            Schimbă parola
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        <button
          onClick={handleLogout}
          className="mt-6 w-full border-2 border-highlight text-highlight py-2 rounded hover:bg-highlight hover:text-white transition"
        >
          Deconectare
        </button>
      </div>
    </div>
  );
}
