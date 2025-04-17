// Navbar.js
import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [lessonsOpen, setLessonsOpen] = useState(false)
  const [testsOpen,   setTestsOpen]   = useState(false)

  const lessonsRef = useRef(null)
  const testsRef   = useRef(null)
  const mobileRef  = useRef(null)
  const toggleRef  = useRef(null)

  useEffect(() => {
    function outside(e) {
      if (lessonsRef.current && !lessonsRef.current.contains(e.target)) setLessonsOpen(false)
      if (testsRef.current   && !testsRef.current.contains(e.target))   setTestsOpen(false)
      if (
        mobileOpen &&
        mobileRef.current &&
        !mobileRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setMobileOpen(false)
        setLessonsOpen(false)
        setTestsOpen(false)
      }
    }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [mobileOpen])

  const base = 'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200'
  const navClass = ({ isActive }) =>
    `${base} ${isActive ? 'bg-light-blue/20 text-blue' : 'text-dark-blue hover:bg-light-blue/10 hover:text-blue'}`

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* logo */}
          <Link to="/" className="text-2xl font-extrabold text-carmine hover:text-dark-blue">Graf.in</Link>

          {/* meniu desktop */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavLink to="/sandbox"  className={navClass}>Sandbox</NavLink>
            <NavLink to="/simulari" className={navClass}>Simulări</NavLink>
            <div ref={lessonsRef} className="relative">
              <button onClick={() => setLessonsOpen(!lessonsOpen)} className={`${base} flex items-center text-dark-blue hover:text-blue hover:bg-light-blue/10`}>
                Lecții<ChevronDown className={`ml-1 h-4 w-4 transition-transform ${lessonsOpen ? 'rotate-180' : ''}`} />
              </button>
              {lessonsOpen && (
                <div className="absolute left-0 mt-2 w-44 bg-white shadow-lg rounded-lg py-2 z-10">
                  <Link to="/lectii/1" className={`${base} block text-dark-blue hover:text-blue hover:bg-light-blue/10`}>Lecția 1</Link>
                  <Link to="/lectii/2" className={`${base} block text-dark-blue hover:text-blue hover:bg-light-blue/10`}>Lecția 2</Link>
                </div>
              )}
            </div>
            <div ref={testsRef} className="relative">
              <button onClick={() => setTestsOpen(!testsOpen)} className={`${base} flex items-center text-dark-blue hover:text-blue hover:bg-light-blue/10`}>
                Teste<ChevronDown className={`ml-1 h-4 w-4 transition-transform ${testsOpen ? 'rotate-180' : ''}`} />
              </button>
              {testsOpen && (
                <div className="absolute left-0 mt-2 w-44 bg-white shadow-lg rounded-lg py-2 z-10">
                  <Link to="/teste/1" className={`${base} block text-dark-blue hover:text-blue hover:bg-light-blue/10`}>Test 1</Link>
                  <Link to="/teste/2" className={`${base} block text-dark-blue hover:text-blue hover:bg-light-blue/10`}>Test 2</Link>
                </div>
              )}
            </div>
            <NavLink to="/feedback" className={navClass}>Feedback</NavLink>
          </div>

          {/* butoane autentificare */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login"  className="px-4 py-2 border-2 border-carmine text-carmine rounded-lg hover:bg-carmine hover:text-white">Conectare</Link>
            <Link to="/signup" className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-light-blue">Înregistrare</Link>
          </div>

          {/* toggle mobil */}
          <button ref={toggleRef} onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-md text-dark-blue hover:text-blue hover:bg-light-blue/10">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div ref={mobileRef} className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white z-40">
          <Link to="/sandbox"  className={`${base} block text-dark-blue`}>Sandbox</Link>
          <Link to="/simulari" className={`${base} block text-dark-blue`}>Simulări</Link>
          <button onClick={() => setLessonsOpen(!lessonsOpen)} className={`${base} flex items-center w-full text-dark-blue`}>
            Lecții<ChevronDown className={`ml-auto h-4 w-4 transition-transform ${lessonsOpen ? 'rotate-180' : ''}`} />
          </button>
          {lessonsOpen && (
            <div className="pl-4 space-y-1">
              <Link to="/lectii/1" className={`${base} block text-dark-blue`}>Lecția 1</Link>
              <Link to="/lectii/2" className={`${base} block text-dark-blue`}>Lecția 2</Link>
            </div>
          )}
          <button onClick={() => setTestsOpen(!testsOpen)} className={`${base} flex items-center w-full text-dark-blue`}>
            Teste<ChevronDown className={`ml-auto h-4 w-4 transition-transform ${testsOpen ? 'rotate-180' : ''}`} />
          </button>
          {testsOpen && (
            <div className="pl-4 space-y-1">
              <Link to="/teste/1" className={`${base} block text-dark-blue`}>Test 1</Link>
              <Link to="/teste/2" className={`${base} block text-dark-blue`}>Test 2</Link>
            </div>
          )}
          <Link to="/feedback" className={`${base} block text-dark-blue`}>Feedback</Link>
          <Link to="/login"  className="block px-4 py-2 border-2 border-carmine text-carmine rounded-lg hover:bg-carmine hover:text-white">Conectare</Link>
          <Link to="/signup" className="block px-4 py-2 bg-blue text-white rounded-lg hover:bg-light-blue">Înregistrare</Link>
        </div>
      )}
    </nav>
  )
}
