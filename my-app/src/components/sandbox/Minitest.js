import React, { useState, useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * MiniTest component: renders a random subset of 5 questions from a pool
 * Props:
 * - nodes: current node array
 * - links: current link array
 * - directed: boolean flag
 */
export default function MiniTest({ nodes, links, directed }) {
  // Helper to build undirected adjacency list without duplicates
  const buildAdj = useCallback(() => {
    const adj = {};
    for (let i = 1; i <= nodes.length; i++) adj[i] = [];
    links.forEach(l => {
      const s = l.source.id || l.source;
      const t = l.target.id || l.target;
      if (!adj[s].includes(t)) adj[s].push(t);
      if (!adj[t].includes(s)) adj[t].push(s);
    });
    return adj;
  }, [nodes, links]);

  // Build question pool based on graph type
  const pool = useMemo(() => {
    const questions = [];
    questions.push({ key: 'components', text: 'Câte componente conexe?', answer: () => {
      const adj = buildAdj(); const visited = new Set(); let count = 0;
      function dfs(u) { if (visited.has(u)) return; visited.add(u); adj[u].forEach(v => dfs(v)); }
      for (let i = 1; i <= nodes.length; i++) if (!visited.has(i)) { count++; dfs(i); }
      return count;
    }});
    questions.push({ key: 'cycles', text: 'Câte cicluri?', answer: () => {
      const edgeSet = new Set(); links.forEach(l => {
        const s = l.source.id || l.source, t = l.target.id || l.target;
        edgeSet.add(s < t ? `${s},${t}` : `${t},${s}`);
      });
      const compsCount = questions.find(q => q.key === 'components').answer();
      return edgeSet.size - nodes.length + compsCount;
    }});
    if (directed) {
      questions.push({ key: 'maxOutDegree', text: 'Care este gradul extern maxim al unui nod?', answer: () => {
        const outDeg = {}; for (let i = 1; i <= nodes.length; i++) outDeg[i] = 0;
        links.forEach(l => outDeg[l.source.id || l.source]++);
        return Math.max(...Object.values(outDeg));
      }});
      questions.push({ key: 'maxInDegree', text: 'Care este gradul intern maxim al unui nod?', answer: () => {
        const inDeg = {}; for (let i = 1; i <= nodes.length; i++) inDeg[i] = 0;
        links.forEach(l => inDeg[l.target.id || l.target]++);
        return Math.max(...Object.values(inDeg));
      }});
    } else {
      questions.push({ key: 'maxDegree', text: 'Care este gradul maxim al unui nod?', answer: () => {
        const adj = buildAdj(); return Math.max(...Object.values(adj).map(n => n.length));
      }});
    }
    questions.push({ key: 'nodes', text: 'Câte noduri sunt în graf?', answer: () => nodes.length });
    questions.push({ key: 'edges', text: directed ? 'Câte muchii orientate există?' : 'Câte muchii unice există?', answer: () => {
      if (directed) return links.length;
      const setU = new Set(); links.forEach(l => {
        const s = l.source.id || l.source, t = l.target.id || l.target;
        setU.add(s < t ? `${s},${t}` : `${t},${s}`);
      }); return setU.size;
    }});
    if (!directed) {
      const adj = buildAdj();
      const randomRoot = nodes[Math.floor(Math.random() * nodes.length)].id;
      const children = adj[randomRoot] || [];
      if (children.length) questions.push({ key: `childrenOf${randomRoot}`, text: `Dacă nodul ${randomRoot} ar fi rădăcina, care ar fi fii lui?`, answer: () => children.slice() });
      const leaves = Object.entries(adj).filter(([n, nbrs]) => Number(n) !== randomRoot && nbrs.length === 1).map(([n]) => Number(n));
      if (leaves.length) questions.push({ key: `leavesIfRoot${randomRoot}`, text: `Dacă nodul ${randomRoot} ar fi rădăcina, care ar fi frunzele?`, answer: () => leaves.slice() });
    }
    return questions;
  }, [nodes, links, directed, buildAdj]);

  const questions = useMemo(() => [...pool].sort(() => Math.random() - 0.5).slice(0, 5), [pool]);

  const [answersState, setAnswersState] = useState({});
  const [score, setScore] = useState(null);
  const [wrong, setWrong] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key, value) => setAnswersState(prev => ({ ...prev, [key]: value }));

  const handleSubmit = e => {
    e.preventDefault();
    let pts = 0; const incorrect = [];
    questions.forEach(q => {
      const userInput = (answersState[q.key] || '').trim();
      const correctVal = q.answer();
      const correctStr = Array.isArray(correctVal) ? correctVal.slice().sort((a,b)=>a-b).join(',') : correctVal.toString();
      let isCorrect = false;
      if (Array.isArray(correctVal)) {
        const arr = userInput ? userInput.split(',').map(s=>Number(s.trim())).filter(n=>!isNaN(n)) : [];
        isCorrect = JSON.stringify(arr.sort((a,b)=>a-b)) === JSON.stringify(correctVal.slice().sort((a,b)=>a-b));
      } else isCorrect = userInput.toLowerCase() === correctStr.toLowerCase();
      if (isCorrect) pts++; else incorrect.push({ text: q.text, correct: correctStr });
    });
    setScore(pts);
    setWrong(incorrect);
    setSubmitted(true);
  };

  useEffect(() => {
    setScore(null);
    setWrong([]);
    setAnswersState({});
    setSubmitted(false);
  }, [nodes, links, directed]);

  return (
    <div className="relative p-2">
      <h3 className="text-lg font-semibold mb-4">Mini Test</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map(q => (
          <div key={q.key}>
            <label className="font-medium block mb-1">{q.text}</label>
            <input
              type="text"
              value={answersState[q.key]||''}
              onChange={e=>handleChange(q.key,e.target.value)}
              disabled={submitted}
              className="mt-1 w-full p-2 border rounded text-sm"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={submitted}
          className="w-full bg-blue text-white py-2 rounded hover:bg-light-blue transition disabled:opacity-50 disabled:cursor-not-allowed"
        >Verifică</button>
      </form>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95 p-6 rounded-lg shadow-lg"
        >
          <p className="text-xl font-bold mb-2">Scorul tău</p>
          <p className="text-4xl font-extrabold mb-4">
            {score} / {questions.length} {score === questions.length ? '🎉' : '🙂'}
          </p>
          {wrong.length > 0 && (
            <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-inner">
              <p className="text-lg font-semibold text-red-600 mb-2">Răspunsuri incorecte</p>
              <ul className="space-y-2">
                {wrong.map((w, i) => (
                  <li key={i} className="flex justify-between items-start bg-red-50 p-2 rounded">
                    <span className="flex-1 text-gray-800">{w.text}</span>
                    <span className="ml-4 font-mono text-blue-700">{w.correct}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

MiniTest.propTypes = {
  nodes: PropTypes.array.isRequired,
  links: PropTypes.array.isRequired,
  directed: PropTypes.bool.isRequired,
};
