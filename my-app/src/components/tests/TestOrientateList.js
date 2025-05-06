// src/components/tests/TestOrientateList.js
import React, { useEffect, useState } from 'react'
import { useNavigate }             from 'react-router-dom'
import { db }                      from '../../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

export default function TestOrientateList() {
  const [tests, setTests]   = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchTests() {
      const q = query(
        collection(db, 'tests'),
        where('section', '==', 'orientate')
      )
      const snap = await getDocs(q)
      setTests(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    fetchTests()
  }, [])

  if (loading) return <p className="text-center mt-8">Se încarcă teste…</p>
  if (tests.length === 0)
    return <p className="text-center mt-8">Nu există teste în această secțiune.</p>

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tests.map(test => (
        <div
          key={test.id}
          onClick={() => navigate(`/tests/orientate/${test.id}`)}
          className="cursor-pointer border rounded-lg p-4 hover:shadow-lg transition"
        >
          <h3 className="text-lg font-semibold mb-2">
            {test.title || test.question.slice(0, 50) + '…'}
          </h3>
          <p className="text-sm text-gray-500 mb-1">
            Dificultate: <span className="font-medium">{test.difficulty || 'N/A'}</span>
          </p>
          <p className="text-gray-700">
            {test.description
              ? (test.description.length > 100 ? test.description.slice(0, 40) + '…' : test.description)
              : (test.question.length > 100 ? test.question.slice(0, 40) + '…' : test.question)}
          </p>
        </div>
      ))}
    </div>
  )
}
