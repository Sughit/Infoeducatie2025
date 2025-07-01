import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, ChevronDown, User } from 'lucide-react'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lessonsOpen, setLessonsOpen] = useState(false)
  const [user, setUser] = useState(null)

  // Refs for click-away handling
  const lessonsRef = useRef(null)
  const mobileRef = useRef(null)
  const toggleRef = useRef(null)
  // New ref for mobile dropdown menu
  const mobileLessonsRef = useRef(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    function outside(e) {
      if (!mobileOpen && lessonsRef.current && !lessonsRef.current.contains(e.target)) {
        setLessonsOpen(false)
      }
      
      if (
        mobileOpen &&
        mobileRef.current &&
        !mobileRef.current.contains(e.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target)
      ) {
        setMobileOpen(false)
        setLessonsOpen(false)
      }
    }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [mobileOpen])

  const base = 'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200'
  const navClass = ({ isActive }) =>
    `${base} ${isActive ? 'bg-light-blue/20 text-blue' : 'text-dark-blue hover:bg-light-blue/10 hover:text-blue'}`

  const handleSignOut = async () => {
    await signOut(auth)
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-extrabold text-highlight hover:text-dark-blue">Graf.in</Link>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavLink to="/sandbox" className={navClass}>Sandbox</NavLink>
            <NavLink to="/simulari" className={navClass}>Simulări</NavLink>
            <div ref={lessonsRef} className="relative">
              <button onClick={() => setLessonsOpen(!lessonsOpen)} className={`${base} flex items-center text-dark-blue hover:text-blue hover:bg-light-blue/10`}>
                Lecții<ChevronDown className={`ml-1 h-4 w-4 transition-transform ${lessonsOpen ? 'rotate-180' : ''}`} />
              </button>
              {lessonsOpen && (
                <div className="absolute left-0 mt-2 w-44 bg-white shadow-lg rounded-lg py-2 z-10">
                  <Link to="/neorientate" className={`${base} block text-dark-blue hover:text-blue hover:bg-light-blue/10`}>Grafuri Neorientate</Link>
                  <Link to="/orientate" className={`${base} block text-dark-blue hover:text-blue hover:bg-light-blue/10`}>Grafuri Orientate</Link>
                  <Link to="/arbori" className={`${base} block text-dark-blue hover:text-blue hover:bg-light-blue/10`}>Arbori</Link>
                </div>
              )}
            </div>
            <NavLink to="/tests" className={navClass}>Teste</NavLink>
            <NavLink to="/feedback" className={navClass}>Feedback</NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Link to="/profile" className="flex items-center px-4 py-2 bg-blue text-white rounded-lg hover:bg-light-blue">
                <User className="mr-2 h-5 w-5" />Profil
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 border-2 border-highlight text-highlight rounded-lg hover:bg-highlight hover:text-white">Conectare</Link>
                <Link to="/signup" className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-light-blue">Înregistrare</Link>
              </>
            )}
          </div>

          <button ref={toggleRef} onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-md text-dark-blue hover:text-blue hover:bg-light-blue/10">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div ref={mobileRef} className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white z-40">
          <Link to="/sandbox" className={`${base} block text-dark-blue`}>Sandbox</Link>
          <Link to="/simulari" className={`${base} block text-dark-blue`}>Simulări</Link>
          <button onClick={() => setLessonsOpen(!lessonsOpen)} className={`${base} flex items-center w-full text-dark-blue`}>
            Lecții<ChevronDown className={`ml-auto h-4 w-4 transition-transform ${lessonsOpen ? 'rotate-180' : ''}`} />
          </button>
          {lessonsOpen && (
            <div ref={mobileLessonsRef} className="pl-4 space-y-1">
              <Link to="/neorientate" className={`${base} block text-dark-blue`}>Grafuri Neorientate</Link>
              <Link to="/orientate" className={`${base} block text-dark-blue`}>Grafuri Orientate</Link>
              <Link to="/arbori" className={`${base} block text-dark-blue`}>Arbori</Link>
            </div>
          )}
          <Link to="/tests" className={`${base} block text-dark-blue`}>Teste</Link>
          <Link to="/feedback" className={`${base} block text-dark-blue`}>Feedback</Link>
          {user ? (
            <Link to="/profile" className="block px-4 py-2 flex items-center bg-blue text-white rounded-lg">
              <User className="mr-2 h-5 w-5" />Profil
            </Link>
          ) : (
            <>
              <Link to="/login" className="block px-4 py-2 border-2 border-highlight text-highlight rounded-lg hover:bg-highlight hover:text-white">Conectare</Link>
              <Link to="/signup" className="block px-4 py-2 bg-blue text-white rounded-lg hover:bg-light-blue">Înregistrare</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
