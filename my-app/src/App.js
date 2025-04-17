// App.js
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Sandbox from './components/Sandbox'
import Feedback from './components/Feedback'
import Login from './components/Login'
import Signup from './components/Signup'

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* Padding-top egal cu înălțimea navbar-ului */}
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sandbox" element={<Sandbox />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
