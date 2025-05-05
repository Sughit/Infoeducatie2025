// src/components/Tests.js
import React from 'react'
import { Routes, Route } from 'react-router-dom'

import TestHome               from './tests/TestHome'
import TestCreate             from './tests/TestCreate'
import TestNeorientateList    from './tests/TestNeorientateList'
import TestOrientateList      from './tests/TestOrientateList'
import TestArboriList         from './tests/TestArboriList'
import TestNeorientateDetail  from './tests/TestNeorientateDetail'
import TestOrientateDetail    from './tests/TestOrientateDetail'
import TestArboriDetail       from './tests/TestArboriDetail'

export default function Tests() {
  return (
    <Routes>
      <Route path="/" element={<TestHome />} />
      <Route path="create" element={<TestCreate />} />

      <Route path="neorientate">
        <Route index element={<TestNeorientateList />} />
        <Route path=":testId" element={<TestNeorientateDetail />} />
      </Route>

      <Route path="orientate">
        <Route index element={<TestOrientateList />} />
        <Route path=":testId" element={<TestOrientateDetail />} />
      </Route>

      <Route path="arbori">
        <Route index element={<TestArboriList />} />
        <Route path=":testId" element={<TestArboriDetail />} />
      </Route>
    </Routes>
  )
}
