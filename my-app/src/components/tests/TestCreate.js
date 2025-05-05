import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { db, storage } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function TestCreate() {
  const [section, setSection] = useState('neorientate');
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('usor');
  const [description, setDescription] = useState('');
  const [question, setQuestion] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [wrongAnswers, setWrongAnswers] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleWrongChange = (idx, val) => {
    const copy = [...wrongAnswers];
    copy[idx] = val;
    setWrongAnswers(copy);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        const fileRef = ref(storage, `tests/${Date.now()}_${imageFile.name}`);
        await uploadBytes(fileRef, imageFile);
        imageUrl = await getDownloadURL(fileRef);
      }

      await addDoc(collection(db, 'tests'), {
        section,
        title: title.trim(),
        difficulty,
        description: description.trim(),
        question: question.trim(),
        imageUrl,
        correctAnswer: correctAnswer.trim(),
        wrongAnswers: wrongAnswers.map(w => w.trim()),
        createdAt: serverTimestamp(),
      });

      navigate('/tests');
    } catch (err) {
      console.error('Error creating test:', err);
      alert('A apărut o eroare. Verifică consola.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <h2 className="text-2xl font-semibold text-center">Creează un test</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Secțiune
          <select
            value={section}
            onChange={e => setSection(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
          >
            <option value="neorientate">Grafuri Neorientate</option>
            <option value="orientate">Grafuri Orientate</option>
            <option value="arbori">Arbori</option>
          </select>
        </label>

        <label className="block">
          Titlu
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
            required
          />
        </label>

        <label className="block">
          Dificultate
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
            required
          >
            <option value="usor">Ușor</option>
            <option value="mediu">Mediu</option>
            <option value="dificil">Dificil</option>
          </select>
        </label>

        <label className="block">
          Descriere
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            className="mt-1 w-full border rounded px-2 py-1"
            required
          />
        </label>

        <label className="block">
          Enunțul problemei
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            rows={3}
            className="mt-1 w-full border rounded px-2 py-1"
            required
          />
        </label>

        <label className="block">
          Imagine (opțional)
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0] || null)}
            className="mt-1"
          />
        </label>

        <label className="block">
          Răspuns corect
          <input
            type="text"
            value={correctAnswer}
            onChange={e => setCorrectAnswer(e.target.value)}
            className="mt-1 w-full border rounded px-2 py-1"
            required
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {wrongAnswers.map((w, i) => (
            <label key={i} className="block">
              Răspuns greșit #{i + 1}
              <input
                type="text"
                value={w}
                onChange={e => handleWrongChange(i, e.target.value)}
                className="mt-1 w-full border rounded px-2 py-1"
                required
              />
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Se încarcă...' : 'Salvează testul'}
        </button>
      </form>

      <button
        onClick={() => navigate('/tests')}
        className="mt-2 text-sm underline"
      >
        Anulează și întoarce-te
      </button>
    </div>
  );
}
