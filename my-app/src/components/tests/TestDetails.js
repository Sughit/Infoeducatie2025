import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import CodeTestRunner from './CodeTestRunner';

export default function TestDetails() {
  const { section, testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [codeAnswers, setCodeAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const ref = doc(db, 'tests', testId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();

        // fallback pentru teste vechi (care au doar `question`, nu `questions`)
        if (!Array.isArray(data.questions) && data.question) {
        data.questions = [{
            question: data.question,
            correctAnswer: data.correctAnswer,
            wrongAnswers: Array.isArray(data.wrongAnswers) ? data.wrongAnswers : [],
            type: 'grila',
            imageUrl: data.imageUrl || ''
        }];
        }

        // normalizează wrongAnswers
        data.questions = (data.questions || []).map(q => ({
        ...q,
        wrongAnswers: Array.isArray(q.wrongAnswers) ? q.wrongAnswers : [],
        }));

        setTest(data);
        setAnswers(Array(data.questions.length).fill(''));

        } else {
          setError('Testul nu a fost găsit.');
        }
      } catch (err) {
        console.error(err);
        setError('Eroare la încărcarea testului.');
      }
    };
    fetchTest();
  }, [testId]);

  const handleChange = (qi, val) => {
    setAnswers(prev => {
      const copy = [...prev];
      copy[qi] = val;
      return copy;
    });
  };

  const allAnswered = useMemo(() => {
    if (!Array.isArray(test?.questions)) return false;
    return test.questions.every((q, i) => {
      if (q.type === 'grila') return answers[i] !== '';
      if (q.type === 'cod') return (codeAnswers[i]?.trim() || '') !== '';
      return false;
    });
  }, [answers, codeAnswers, test]);

const handleSubmit = async e => {
  e.preventDefault();
  if (!allAnswered) return setError('Răspunde la toate întrebările.');

  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Trebuie să fii autentificat.');

    let correct = 0;

    for (let i = 0; i < test.questions.length; i++) {
      const q = test.questions[i];
      if (q.type === 'grila') {
        if (answers[i] === q.correctAnswer) correct++;
      } else if (q.type === 'cod') {
        const res = await CodeTestRunner(codeAnswers[i], q.testCases);
        if (res.success && res.passed === q.testCases.length) correct++;
      }
    }

    const computedScore = Math.round((correct / test.questions.length) * 100);
    setScore(computedScore); // 🔵 pentru afișare în interfață

    await addDoc(collection(db, 'results', user.uid, 'attempts'), {
      testId,
      title: test.title,
      section,
      score: computedScore,
      timestamp: serverTimestamp()
    });

    setSubmitted(true);
  } catch (err) {
    console.error(err);
    setError(err.message);
  }
};


  if (!test && !error) return <div className="p-6 text-center">Se încarcă testul...</div>;
  if (error) return <div className="text-red-600 text-center p-6">{error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 bg-white rounded-lg shadow">
      {!submitted ? (
        <>
          <h2 className="text-2xl font-semibold text-center">{test.title}</h2>
          {test.description && <p className="text-center text-gray-600">{test.description}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {test.questions.map((q, i) => (
              <div key={i} className="p-4 border rounded space-y-2">
                <p className="font-medium">Întrebarea {i + 1}: {q.question}</p>
                {q.imageUrl && <img src={q.imageUrl} alt="" className="max-h-48 mx-auto" />}
                {q.type === 'grila' ? (
                  <div className="grid grid-cols-1 gap-2">
                    {[q.correctAnswer, ...(Array.isArray(q.wrongAnswers) ? q.wrongAnswers : [])]
                      .filter(Boolean)
                      .sort()
                      .map((opt, idx) => (
                        <label key={idx} className={`block border rounded p-2 ${answers[i] === opt ? 'bg-indigo-100' : ''}`}>
                          <input
                            type="radio"
                            name={`q${i}`}
                            checked={answers[i] === opt}
                            onChange={() => handleChange(i, opt)}
                            className="mr-2"
                          />
                          {opt}
                        </label>
                      ))}
                  </div>
                ) : (
                  <textarea
                    rows={8}
                    value={codeAnswers[i] || ''}
                    onChange={e => setCodeAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                    className="w-full border rounded p-2 font-mono"
                    placeholder="Scrie codul C++ aici..."
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={!allAnswered}
              className={`w-full py-2 rounded-lg transition ${
                allAnswered ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              Trimite testul
            </button>
          </form>
        </>
      ) : (
        <>
          {submitted && score !== null && (
            <p className="text-center text-lg text-gray-700">
              Scorul tău: <span className="font-bold">{score}%</span>
            </p>
          )}

          {test.questions.map((q, i) => {
            const isCorrect = q.type === 'grila'
            ? answers[i] === q.correctAnswer
            : null; // pentru cod, nu afișăm detalii aici

            return (
            <div key={i} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                {q.type === 'grila' && (
                  <span className={`text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {isCorrect ? '✓' : '✗'}
                  </span>
                )}
              <p className="font-medium">Întrebarea {i + 1}: {q.question}</p>
              </div>

              {q.imageUrl && (
                <img src={q.imageUrl} alt="" className="max-h-48 mx-auto" />
              )}

              {q.type === 'grila' ? (
                <div className="grid grid-cols-1 gap-2">
                  {[q.correctAnswer, ...(Array.isArray(q.wrongAnswers) ? q.wrongAnswers : [])]
                  .filter(Boolean)
                  .sort()
                  .map((opt, idx) => {
                    const selected = answers[i] === opt;
                    const correct = q.correctAnswer === opt;
                      return (
                        <div
                          key={idx}
                          className={`p-2 border rounded ${
                          correct
                            ? 'bg-green-100 border-green-500'
                            : selected
                            ? 'bg-red-100 border-red-400'
                            : ''
                          }`}
                        >
                          <span className="font-medium">{opt}</span>
                          {correct && <span className="ml-2 text-green-600 font-semibold"></span>}
                          {selected && !correct && <span className="ml-2 text-red-600"></span>}
                        </div>
                      );
                  })}
                </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-700 font-semibold mb-1">Codul tău:</p>
                    <pre className="p-2 bg-gray-100 border rounded text-sm overflow-x-auto whitespace-pre-wrap">
                      {codeAnswers[i]}
                    </pre>
                  </div>
                )}
            </div>
            );
        })}

        <button
            onClick={() => navigate(`/tests/${section}`)}
            className="w-full py-2 mt-4 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
            Înapoi la lista testelor
        </button>
        </>
      )}
    </div>
  );
}
