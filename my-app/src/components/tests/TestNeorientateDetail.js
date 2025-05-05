import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function TestNeorientateDetail() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [loading, setLoading] = useState(true)

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
  if (!test) return <p className="text-center mt-8">Test inexistent.</p>

  // Shuffle answers
  const answers = [test.correctAnswer, ...test.wrongAnswers].sort(() => Math.random() - 0.5)

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="text-blue-600 underline">
        ← Înapoi
      </button>

      <h2 className="text-2xl font-bold">
        {test.title || 'Test fără titlu'}
      </h2>
      <p className="mt-2 text-gray-800">
        {test.question}
      </p>

      {test.imageUrl && (
        <img
          src={test.imageUrl}
          alt="Diagramă test"
          className="mb-4 max-h-64 w-full object-contain"
        />
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {answers.map((ans, i) => (
          <li
            key={i}
            className="border rounded px-3 py-2 text-center hover:bg-gray-100 transition"
          >
            {ans}
          </li>
        ))}
      </ul>
    </div>
  )
}
