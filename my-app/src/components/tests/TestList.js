import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function TestList() {
  const { section } = useParams(); // poate fi 'neorientate', 'orientate' sau 'arbori'
  const [tests, setTests] = useState([]);
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDocs(collection(db, 'results', user.uid, 'attempts'));
        setSolvedIds(new Set(snap.docs.map(doc => doc.data().testId)));
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    async function fetchTests() {
      const q = query(collection(db, 'tests'), where('section', '==', section));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({
        id: doc.id,
        solved: solvedIds.has(doc.id),
        ...doc.data()
      }));
      setTests(data);
      setLoading(false);
    }
    fetchTests();
  }, [section, solvedIds]);

  if (loading) return <div className="p-6 text-center">Se încarcă testele...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/tests')}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Înapoi
      </button>
      <h2 className="text-2xl font-semibold text-center capitalize">
        Teste — {section}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map(test => (
          <div
            key={test.id}
            onClick={() => navigate(`/tests/${section}/${test.id}`)}
            className={`border rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition ${
              test.solved ? 'bg-green-100 border-green-400' : ''
            }`}
          >
            <h3 className="text-lg font-semibold">{test.title || '[Fără titlu]'}</h3>
            <p className="text-sm text-gray-600">Dificultate: {test.difficulty || '—'}</p>
            <p className="text-sm text-gray-500">{test.description?.slice(0, 60) || '—'}</p>
            {test.solved && (
              <p className="text-sm text-green-600 font-medium mt-1">Rezolvat</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
