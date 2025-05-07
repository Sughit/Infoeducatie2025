import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../firebase';
import '../index.css';
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

  // Auth listener
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
    <div className="h-[calc(100vh-4rem)] pt-10 flex flex-col items-center profile-section">
      <div className="w-full max-w-md profile-container">
        <h1 className="home-title mb-4 text-center">Profil</h1>
        <p className="home-text mb-4 text-center"><strong>Email:</strong> {user.email}</p>

        <form onSubmit={handleChangePassword} className="space-y-4 overflow-y-auto">
          <label className="block home-text">
            Parola veche
            <input
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className="profile-input"
              required
            />
          </label>
          <label className="block home-text">
            Noua parolă
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="profile-input"
              required
            />
          </label>
          <label className="block home-text">
            Confirmă parola nouă
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="profile-input"
              required
            />
          </label>
          {message && <p className="text-center text-red-500 home-text">{message}</p>}
          <button
            type="submit"
            className="profile-button"
          >
            Schimbă parola
          </button>
        </form>
        <button
          onClick={handleLogout}
          className="mt-4 profile-button-danger bg-red-500 hover:bg-red-600"
        >
          Deconectează-te
        </button>
      </div>
    </div>
  );
}
