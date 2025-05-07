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

  // support multiple questions
  const [questions, setQuestions] = useState([
    { question: '', imageFile: null, correctAnswer: '', wrongAnswers: ['', '', ''] }
  ]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // handlers
  const handleQuestionChange = (qi, field, value) => {
    const copy = [...questions];
    copy[qi][field] = value;
    setQuestions(copy);
  };
  const handleWrongChange = (qi, wi, value) => {
    const copy = [...questions];
    copy[qi].wrongAnswers[wi] = value;
    setQuestions(copy);
  };
  const addQuestion = () => setQuestions(prev => [...prev, { question: '', imageFile: null, correctAnswer: '', wrongAnswers: ['', '', ''] }]);
  const removeQuestion = qi => setQuestions(prev => prev.filter((_, i) => i !== qi));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = [];
      for (const q of questions) {
        let imageUrl = '';
        if (q.imageFile) {
          const fileRef = ref(storage, `tests/${Date.now()}_${q.imageFile.name}`);
          await uploadBytes(fileRef, q.imageFile);
          imageUrl = await getDownloadURL(fileRef);
        }
        payload.push({
          question: q.question.trim(),
          imageUrl,
          correctAnswer: q.correctAnswer.trim(),
          wrongAnswers: q.wrongAnswers.map(w => w.trim())
        });
      }

      await addDoc(collection(db, 'tests'), {
        section,
        title: title.trim(),
        difficulty,
        description: description.trim(),
        questions: payload,
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
        {/* meta fields */}
        <label className="block">
          Secțiune
          <select value={section} onChange={e => setSection(e.target.value)} className="mt-1 w-full border rounded px-2 py-1">
            <option value="neorientate">Grafuri Neorientate</option>
            <option value="orientate">Grafuri Orientate</option>
            <option value="arbori">Arbori</option>
          </select>
        </label>
        <label className="block">
          Titlu
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" required />
        </label>
        <label className="block">
          Dificultate
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="mt-1 w-full border rounded px-2 py-1" required>
            <option value="usor">Ușor</option>
            <option value="mediu">Mediu</option>
            <option value="dificil">Dificil</option>
          </select>
        </label>
        <label className="block">
          Descriere
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} className="mt-1 w-full border rounded px-2 py-1" required />
        </label>

        {/* dynamic questions */}
        {questions.map((q, qi) => (
          <div key={qi} className="p-4 border rounded relative space-y-2">
            {questions.length > 1 && (
              <button type="button" onClick={() => removeQuestion(qi)} className="absolute top-2 right-2 text-red-500">×</button>
            )}
            <label className="block">
              Întrebarea #{qi + 1}
              <textarea value={q.question} onChange={e => handleQuestionChange(qi, 'question', e.target.value)} rows={3} className="mt-1 w-full border rounded px-2 py-1" required />
            </label>
            <label className="block">
              Imagine (opțional)
              <input type="file" accept="image/*" onChange={e => handleQuestionChange(qi, 'imageFile', e.target.files[0] || null)} className="mt-1" />
            </label>
            <label className="block">
              Răspuns corect
              <input type="text" value={q.correctAnswer} onChange={e => handleQuestionChange(qi, 'correctAnswer', e.target.value)} className="mt-1 w-full border rounded px-2 py-1" required />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {q.wrongAnswers.map((w, wi) => (
                <label key={wi} className="block">
                  Răspuns greșit #{wi + 1}
                  <input type="text" value={w} onChange={e => handleWrongChange(qi, wi, e.target.value)} className="mt-1 w-full border rounded px-2 py-1" required />
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="w-full py-2 bg-yellow-500 text-white rounded">Adaugă întrebare</button>

        <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded disabled:opacity-50" disabled={loading}>
          {loading ? 'Se încarcă...' : 'Salvează testul'}
        </button>
      </form>
      <button onClick={() => navigate('/tests')} className="mt-2 text-sm underline">Anulează și întoarce-te</button>
    </div>
  );
}
