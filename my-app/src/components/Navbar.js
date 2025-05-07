import React, { useState, useEffect, useRef, useContext } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, ChevronDown, User, Sun, Moon } from 'lucide-react'
import { auth } from '../firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { ThemeContext } from './ui/ThemeContext'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lessonsOpen, setLessonsOpen] = useState(false)
  const [user, setUser] = useState(null)

  const { darkMode, toggle } = useContext(ThemeContext)

  const lessonsRef = useRef(null)
  const mobileRef = useRef(null)
  const toggleRef = useRef(null)
  const mobileLessonsRef = useRef(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => setUser(currentUser))
    return unsubscribe
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (!mobileOpen && lessonsOpen && lessonsRef.current && !lessonsRef.current.contains(e.target)) {
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
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileOpen, lessonsOpen])

  const base = 'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200'
  const navClass = ({ isActive }) =>
    `${base} ${
      isActive
        ? 'bg-highlight text-white'
        : 'text-dark-blue hover:bg-highlight/10 hover:text-highlight'
    }`

  const handleSignOut = async () => {
    await signOut(auth)
    setMobileOpen(false)
  }

  return (
    <nav className="fixed top-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
      <Link to="/" className="text-2xl font-extrabold text-highlight">
        Graf.in
      </Link>

      <div className="hidden md:flex items-center space-x-6">
        <NavLink to="/sandbox" className="nav-link" activeclassname="nav-link-active">
          Sandbox
        </NavLink>
        <NavLink to="/simulari" className="nav-link" activeclassname="nav-link-active">
          Simulări
        </NavLink>
        <div ref={lessonsRef} className="relative">
          <button
            onClick={() => setLessonsOpen(!lessonsOpen)}
            className="dropdown-toggle"
          >
            <span className="text-sm font-medium">Lecții</span>
            <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${lessonsOpen ? 'rotate-180' : ''}`} />
          </button>
          {lessonsOpen && (
            <div className="dropdown-menu">
              <Link to="/neorientate" className="dropdown-menu-item">
                Grafuri Neorientate
              </Link>
              <Link to="/orientate" className="dropdown-menu-item">
                Grafuri Orientate
              </Link>
              <Link to="/arbori" className="dropdown-menu-item">
                Arbori
              </Link>
            </div>
          )}
        </div>
        <NavLink to="/tests" className="nav-link" activeclassname="nav-link-active">
          Teste
        </NavLink>
        <NavLink to="/feedback" className="nav-link" activeclassname="nav-link-active">
          Feedback
        </NavLink>
      </div>
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue-dark transition-colors"
            >
              <User className="mr-2 h-5 w-5" /> Profil
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border-2 border-highlight text-highlight rounded-lg hover:bg-highlight hover:text-white transition-colors"
              >
                Conectare
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue-dark transition-colors"
              >
                Înregistrare
              </Link>
            </>
          )}
          <button
            onClick={toggle}
            className="px-3 py-2 rounded-lg hover:bg-highlight/10 transition-colors"
          >
            {darkMode ? <Sun className="h-5 w-5 text-highlight" /> : <Moon className="h-5 w-5 text-highlight" />}
          </button>
        </div>

        <button
          ref={toggleRef}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-md text-dark-blue dark:text-white hover:bg-highlight/10 dark:hover:bg-gray-700 transition-colors"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
  <div ref={mobileRef} className="mobile-menu">
    <NavLink to="/sandbox" className="mobile-menu-item" activeclassname="mobile-menu-item-active">
      Sandbox
    </NavLink>
    <NavLink to="/simulari" className="mobile-menu-item" activeclassname="mobile-menu-item-active">
      Simulări
    </NavLink>
    <button
      onClick={() => setLessonsOpen(!lessonsOpen)}
      className="mobile-dropdown-toggle"
    >
      Lecții
      <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${lessonsOpen ? 'rotate-180' : ''}`} />
    </button>
    {lessonsOpen && (
      <div ref={mobileLessonsRef} className="mobile-dropdown-menu">
        <Link to="/neorientate" className="mobile-dropdown-menu-item">
          Grafuri Neorientate
        </Link>
        <Link to="/orientate" className="mobile-dropdown-menu-item">
          Grafuri Orientate
        </Link>
        <Link to="/arbori" className="mobile-dropdown-menu-item">
          Arbori
        </Link>
      </div>
    )}
    <NavLink to="/tests" className="mobile-menu-item" activeclassname="mobile-menu-item-active">
      Teste
    </NavLink>
    <NavLink to="/feedback" className="mobile-menu-item" activeclassname="mobile-menu-item-active">
      Feedback
    </NavLink>
    {user ? (
      <Link to="/profile" className="mobile-menu-item bg-blue text-white hover:bg-blue-dark">
        <User className="mr-2 h-5 w-5" /> Profil
      </Link>
    ) : (
      <>
        <Link to="/login" className="mobile-menu-item border-2 border-highlight text-highlight hover:bg-highlight hover:text-white">
          Conectare
        </Link>
        <Link to="/signup" className="mobile-menu-item bg-blue text-white hover:bg-blue-dark">
          Înregistrare
        </Link>
      </>
    )}
  </div>

      )}
    </nav>
  )
}
