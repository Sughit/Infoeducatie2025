import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDocs, orderBy as fbOrderBy, limit as fbLimit } from 'firebase/firestore'

export default function TestOrientateList() {
  const [tests, setTests] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showSolved, setShowSolved] = useState('all')
  const [sortDiff, setSortDiff] = useState('none')
  const [solvedIds, setSolvedIds] = useState(new Set())
  const navigate = useNavigate()

  // fetch user's solved test IDs
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async user => {
      if (user) {
        const snap = await getDocs(collection(db, 'results', user.uid, 'attempts'))
        const ids = new Set(snap.docs.map(d => d.data().testId))
        setSolvedIds(ids)
      } else {
        setSolvedIds(new Set())
      }
    })
    return unsub
  }, [])

  // fetch all tests
  useEffect(() => {
    async function fetchTests() {
      const q = query(
        collection(db, 'tests'),
        where('section', '==', 'orientate')
      )
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ id: d.id, solved: solvedIds.has(d.id), ...d.data() }))
      setTests(data)
      setLoading(false)
    }
    fetchTests()
  }, [solvedIds])

  // apply filters/sorting
  useEffect(() => {
    let res = tests.map(t => ({ ...t, solved: solvedIds.has(t.id) }))
    if (search) {
      res = res.filter(t => t.title?.toLowerCase().includes(search.toLowerCase()))
    }
    if (showSolved !== 'all') {
      res = res.filter(t => showSolved === 'solved' ? t.solved : !t.solved)
    }
    if (sortDiff !== 'none') {
      res.sort((a, b) => {
        const map = { usor: 1, mediu: 2, dificil: 3 }
        const da = Number(a.difficulty) || map[a.difficulty] || 0
        const db = Number(b.difficulty) || map[b.difficulty] || 0
        return sortDiff === 'asc' ? da - db : db - da
      })
    }
    setFiltered(res)
  }, [search, showSolved, sortDiff, tests, solvedIds])

  if (loading) return <p className="text-center mt-8">Se încarcă teste…</p>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button onClick={() => navigate('/tests')} className="mb-4 px-4 py-2 bg-blue text-white rounded">Înapoi</button>
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
        <input
          type="text" value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Caută test..."
          className="flex-1 p-2 border rounded mb-2 sm:mb-0"
        />
        <select value={showSolved} onChange={e => setShowSolved(e.target.value)} className="p-2 border rounded mb-2 sm:mb-0">
          <option value="all">Toate</option>
          <option value="solved">Rezolvate</option>
          <option value="unsolved">Nerezolvate</option>
        </select>
        <select value={sortDiff} onChange={e => setSortDiff(e.target.value)} className="p-2 border rounded">
          <option value="none">Sortare dificultate</option>
          <option value="asc">Ușoare → Grele</option>
          <option value="desc">Grele → Ușoare</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <p className="text-center col-span-full mt-8">Nu există teste care să îndeplinească criteriile.</p>
        ) : (
          filtered.map(test => (
            <div
              key={test.id}
              onClick={() => navigate(`/tests/orientate/${test.id}`)}
              className={`cursor-pointer border rounded-lg p-2 hover:shadow-lg transition ${test.solved ? 'bg-green-100 border-green-400' : ''}`}
            >
              <h3 className="text-lg font-semibold mb-2">{test.title || test.question.slice(0,50)+'…'}</h3>
              <p className="text-sm text-gray-500 mb-1">Dificultate: <span className="font-medium">{test.difficulty||'N/A'}</span></p>
              <p className="text-gray-700">{test.description?test.description.slice(0,40)+'…':test.question.slice(0,40)+'…'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}