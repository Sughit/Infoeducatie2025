// App.js
import React, { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Sandbox from './components/Sandbox'
import Simulation from './components/Simulation'
import Feedback from './components/Feedback'
import Login from './components/Login'
import Signup from './components/Signup'
import Profile from './components/Profile'
import { ThemeContext } from './components/ui/ThemeContext';

import Neorientate from './lessons/Neorientate'
import Orientate from './lessons/Orientate'
import Arbori from './lessons/Arbori'

import Tests from './components/Tests'

export default function App() {
  const { darkMode } = useContext(ThemeContext);
  return (
    <div className={darkMode ? 'dark' : ''}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sandbox" element={<Sandbox />} />
              <Route path="/simulari" element={<Simulation />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/neorientate" element={<Neorientate />} />
              <Route path="/orientate" element={<Orientate />} />
              <Route path="/arbori" element={<Arbori />} />

              <Route path="/tests/*" element={<Tests />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  )
}
