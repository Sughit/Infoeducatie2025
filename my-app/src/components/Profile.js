// Profile.js
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
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else navigate('/login');
    });
    return unsubscribe;
  }, [navigate]);

  const handleChangePassword = async (e) => {
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
      // Reauthenticate user
      await reauthenticateWithCredential(auth.currentUser, credential);
      // Update to new password
      await updatePassword(auth.currentUser, newPassword);
      setMessage('Parola a fost schimbată cu succes.');
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
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Profil</h1>
        <p className="mb-4"><strong>Email:</strong> {user.email}</p>
        <form onSubmit={handleChangePassword}>
          <label className="block mb-2">
            Parola veche
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </label>
          <label className="block mb-2">
            Noua parolă
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </label>
          <label className="block mb-2">
            Confirmă parola nouă
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </label>
          <button type="submit" className="w-full bg-blue text-white py-2 rounded hover:bg-light-blue">
            Schimbă parola
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
        <button
          onClick={handleLogout}
          className="mt-6 w-full border-2 border-highlight text-highlight py-2 rounded hover:bg-highlight hover:text-white"
        >
          Deconectare
        </button>
      </div>
    </div>
  );
}
