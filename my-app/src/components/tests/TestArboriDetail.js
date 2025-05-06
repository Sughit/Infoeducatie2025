import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function TestArboriDetail() {
  const { testId } = useParams()
  const navigate = useNavigate()

  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const answers = useMemo(() => {
    if (!test) return []
    return [test.correctAnswer, ...test.wrongAnswers]
      .sort(() => Math.random() - 0.5)
  }, [test])

  useEffect(() => {
    async function fetchTest() {
      const ref = doc(db, 'tests', testId)
      const snap = await getDoc(ref)
      if (snap.exists()) setTest({ id: snap.id, ...snap.data() })
      setLoading(false)
    }
    fetchTest()
  }, [testId])

  if (loading) return <p className="text-center mt-8">Se încarcă…</p>
  if (!test)    return <p className="text-center mt-8">Test inexistent.</p>

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="text-blue-600 underline">
        ← Înapoi
      </button>

      <h2 className="text-2xl font-bold">{test.title || 'Test fără titlu'}</h2>
      <p className="mt-2 text-gray-800">{test.question}</p>

      {test.imageUrl && (
        <img
          src={test.imageUrl}
          alt="Diagramă test"
          className="mb-4 max-h-64 w-full object-contain"
        />
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {answers.map((ans, i) => (
          <li key={i}>
            <button
              type="button"
              disabled={isSubmitted}
              onClick={() => setSelectedAnswer(ans)}
              className={`
                w-full text-left px-4 py-2 border rounded transition
                ${selectedAnswer === ans 
                  ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' 
                  : 'hover:bg-gray-100'}
                ${isSubmitted && ans === test.correctAnswer ? 'border-green-500' : ''}
                ${isSubmitted && selectedAnswer === ans && ans !== test.correctAnswer ? 'border-red-500' : ''}
              `}
            >
              {ans}
            </button>
          </li>
        ))}
      </ul>

      {!isSubmitted && (
        <button
          onClick={() => setIsSubmitted(true)}
          disabled={selectedAnswer === null}
          className="mt-4 w-full bg-blue text-white py-2 rounded disabled:opacity-50"
        >
          Verifică
        </button>
      )}

      {isSubmitted && (
        <div className="mt-4 p-4 rounded bg-white border">
          {selectedAnswer === test.correctAnswer ? (
            <p className="text-green-600 font-semibold">Corect!</p>
          ) : (
            <>
              <p className="text-red-600 font-semibold">Greșit.</p>
              <p>Răspuns corect: <strong>{test.correctAnswer}</strong></p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
