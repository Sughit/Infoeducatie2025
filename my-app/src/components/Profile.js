import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../firebase';
import {
  updatePassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from './ui/ThemeContext';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const { darkMode, toggle } = useContext(ThemeContext);

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
    <div className={`min-h-screen p-4 flex flex-col items-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-dark-blue'}`}>
      {/* Dark Mode Toggle */}
      <div className="w-full max-w-md flex justify-end mb-4">
        <button onClick={toggle}>
          {darkMode ? <Sun /> : <Moon />}
        </button>
      </div>

      <div className={`w-full max-w-md rounded-lg shadow p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-dark-blue'}`}>
        <h1 className="text-2xl font-semibold mb-4 text-center">Profil</h1>
        <p className="mb-4 text-center"><strong>Email:</strong> {user.email}</p>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <label className="block">
            Parola veche
            <input
              type="password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className={`mt-1 w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              required
            />
          </label>
          <label className="block">
            Noua parolă
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className={`mt-1 w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              required
            />
          </label>
          <label className="block">
            Confirmă parola nouă
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={`mt-1 w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              required
            />
          </label>
          {message && <p className="text-center text-red-500">{message}</p>}
          <button
            type="submit"
            className="w-full bg-blue text-white py-2 rounded hover:bg-blue-dark transition"
          >
            Schimbă parola
          </button>
        </form>
        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Deconectează-te
        </button>
      </div>
    </div>
  );
}
