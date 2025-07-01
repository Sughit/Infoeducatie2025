import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase'
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import CodeTestRunner from './CodeTestRunner';

export default function TestNeorientateDetail() {
  const { testId } = useParams()
  const navigate = useNavigate()

  const [test, setTest] = useState(null)
  const [answers, setAnswers] = useState([])
  const [codeAnswers, setCodeAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) return
      try {
        const ref = doc(db, 'tests', testId)
        const docSnap = await getDoc(ref)
        if (docSnap.exists()) {
          let data = docSnap.data()
          if (!data.questions && data.question) {
            data = {
              ...data,
              questions: [
                {
                  question: data.question,
                  imageUrl: data.imageUrl || '',
                  correctAnswer: data.correctAnswer,
                  wrongAnswers: Array.isArray(data.wrongAnswers) ? data.wrongAnswers : []
                }
              ]
            }
          }
          setTest(data)
          setAnswers(Array(data.questions.length).fill(''))
        } else {
          setError('Testul nu a fost găsit.')
        }
      } catch (err) {
        console.error(err)
        setError('Eroare la încărcarea testului.')
      }
    }
    fetchTest()
  }, [testId])

  useEffect(() => {
    if (submitted) window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [submitted])

  const handleChange = (qi, val) => {
    setAnswers(prev => {
      const copy = [...prev]
      copy[qi] = val
      return copy
    })
  }

  const score = useMemo(() => {
    if (!test?.questions) return 0
    return test.questions.reduce((acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0), 0)
  }, [answers, test])

  const percentScore = useMemo(() => {
    if (!test?.questions.length) return 0
    return Math.round((score / test.questions.length) * 100)
  }, [score, test])

  const allAnswered = useMemo(() => {
  if (!test?.questions) return false;
  return test.questions.every((q, i) => {
    if (q.type === 'grila') {
      return answers[i] !== '';
    } else if (q.type === 'cod') {
      return (codeAnswers[i]?.trim() || '') !== '';
    }
    return false;
  });
}, [answers, codeAnswers, test]);


  const handleSubmit = async e => {
    e.preventDefault();

    // validare grilă
    const allGrilaAnswered = test.questions.every((q, i) =>
      q.type === 'grila' ? answers[i] !== '' : true
    );
    const allCodAnswered = test.questions.every((q, i) =>
      q.type === 'cod' ? (codeAnswers[i]?.trim() || '').length > 0 : true
    );

    if (!allGrilaAnswered || !allCodAnswered) {
      setError('Te rog răspunde la toate întrebările înainte de a trimite.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Trebuie să fii autentificat pentru a salva rezultatul.');

      let correct = 0;

      for (let i = 0; i < test.questions.length; i++) {
        const q = test.questions[i];
        if (q.type === 'grila') {
          if (answers[i] === q.correctAnswer) correct++;
        } else if (q.type === 'cod') {
          const res = await CodeTestRunner(codeAnswers[i], q.testCases);
          if (res.success && res.passed === q.testCases.length) {
            correct++;
          }
        }
      }

      const finalScore = Math.round((correct / test.questions.length) * 100);

      const attemptsRef = collection(db, 'results', user.uid, 'attempts');
      await addDoc(attemptsRef, {
        testId,
        title: test.title,
        section: 'Grafuri Neorientate',
        score: finalScore,
        timestamp: serverTimestamp()
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };


  if (!test && !error) return <div className="flex items-center justify-center p-6">Se încarcă...</div>
  if (error) return <div className="text-red-600 text-center p-6">{error}</div>

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6 bg-white shadow-lg rounded-lg">
      {!submitted ? (
        <>
          <h2 className="text-2xl font-semibold text-center">
            {test.title}
            <span className="block text-sm text-gray-500">Secțiune: Grafuri Neorientate</span>
          </h2>
          {test.description && <p className="text-center text-gray-600">{test.description}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            {test.questions.map((q, qi) => (
              <div key={qi} className="p-4 border rounded-lg space-y-3">
                <p className="font-medium">
                  Întrebarea {qi + 1}: {q.question}
                </p>

                {q.imageUrl && (
                  <img
                    src={q.imageUrl}
                    alt=""
                    className="max-h-48 object-contain mx-auto"
                  />
                )}

                {q.type === 'grila' ? (
                  <div className="grid grid-cols-1 gap-4">
                    {[q.correctAnswer, ...q.wrongAnswers].sort().map((opt, idx) => {
                      const selected = answers[qi] === opt;
                      return (
                        <label
                          key={idx}
                          onClick={() => handleChange(qi, opt)}
                          className={`relative border rounded-lg p-4 cursor-pointer flex items-center justify-center transition ${
                            selected
                              ? 'ring-2 ring-indigo-500 bg-indigo-50'
                              : 'hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`ans${qi}`}
                            value={opt}
                            checked={selected}
                            onChange={() => handleChange(qi, opt)}
                            className="hidden"
                          />
                          <span className="text-center break-words">{opt}</span>
                          {selected && (
                            <span className="absolute top-2 right-2 font-bold text-indigo-600">
                              ✓
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block font-medium">Scrie codul tău C++</label>
                    <textarea
                      rows={10}
                      className="w-full border rounded p-2 font-mono text-sm"
                      value={codeAnswers[qi] || ''}
                      onChange={e =>
                        setCodeAnswers(prev => ({ ...prev, [qi]: e.target.value }))
                      }
                    />
                  </div>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={!allAnswered}
              className={`w-full py-2 rounded-lg transition ${allAnswered ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
            >
              Trimite testul
            </button>
          </form>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-center">Rezultat</h2>
          <p className="text-center text-lg">
            Ai răspuns corect la <span className="font-bold">{score}</span> din <span className="font-bold">{test.questions.length}</span> întrebări.
          </p>
          {test.questions.map((q, qi) => {
  return (
    <div key={qi} className="p-4 border rounded-lg space-y-3">
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold text-indigo-600">
          Întrebarea {qi + 1}
        </span>
        <p className="font-medium">{q.question}</p>
      </div>

      {q.type === 'grila' ? (
        <div className="grid grid-cols-1 gap-4">
          {[q.correctAnswer, ...q.wrongAnswers].sort().map((opt, idx) => {
            const selected = answers[qi] === opt;
            const isCorrect = opt === q.correctAnswer;
            const outlineClass = isCorrect
              ? 'ring-2 ring-green-500'
              : selected && !isCorrect
              ? 'ring-2 ring-red-500'
              : '';
            return (
              <div key={idx} className={`p-4 border rounded-lg ${outlineClass}`}>
                <span className="break-words">{opt}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm space-y-2">
          <label className="block font-semibold">Codul tău:</label>
          <pre className="bg-gray-100 p-3 rounded text-xs whitespace-pre-wrap font-mono">
            {codeAnswers[qi] || '[Nescris]'}
          </pre>
          <p className="italic text-gray-600">* Rezultatul a fost evaluat automat la trimitere.</p>
        </div>
      )}
    </div>
  );
})}

          <button
            onClick={() => navigate('/tests/neorientate')}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Înapoi la teste
          </button>
        </>
      )}
    </div>
  )
}
