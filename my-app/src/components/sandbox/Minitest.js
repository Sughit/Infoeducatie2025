import React, { useState, useMemo, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

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
    // Common: components
    questions.push({
      key: 'components',
      text: 'Câte componente conexe?',
      answer: () => {
        const adj = buildAdj();
        const visited = new Set();
        let count = 0;
        function dfs(u) {
          if (visited.has(u)) return;
          visited.add(u);
          adj[u].forEach(v => dfs(v));
        }
        for (let i = 1; i <= nodes.length; i++) {
          if (!visited.has(i)) { count++; dfs(i); }
        }
        return count;
      }
    });
    // Common: cycles
    questions.push({
      key: 'cycles',
      text: 'Câte cicluri?',
      answer: () => {
        const edgeSet = new Set();
        links.forEach(l => {
          const s = l.source.id || l.source;
          const t = l.target.id || l.target;
          const key = s < t ? `${s},${t}` : `${t},${s}`;
          edgeSet.add(key);
        });
        const compsCount = questions.find(q => q.key === 'components').answer();
        return edgeSet.size - nodes.length + compsCount;
      }
    });
    // Directed vs undirected
    if (directed) {
      questions.push({
        key: 'maxOutDegree',
        text: 'Care este gradul extern maxim al unui nod?',
        answer: () => {
          const outDeg = {};
          for (let i = 1; i <= nodes.length; i++) outDeg[i] = 0;
          links.forEach(l => outDeg[l.source.id || l.source]++);
          return Math.max(...Object.values(outDeg));
        }
      });
      questions.push({
        key: 'maxInDegree',
        text: 'Care este gradul intern maxim al unui nod?',
        answer: () => {
          const inDeg = {};
          for (let i = 1; i <= nodes.length; i++) inDeg[i] = 0;
          links.forEach(l => inDeg[l.target.id || l.target]++);
          return Math.max(...Object.values(inDeg));
        }
      });
    } else {
      questions.push({
        key: 'maxDegree',
        text: 'Care este gradul maxim al unui nod?',
        answer: () => {
          const adj = buildAdj();
          return Math.max(...Object.values(adj).map(neighbors => neighbors.length));
        }
      });
    }
    // Common: counts
    questions.push({ key: 'nodes', text: 'Câte noduri sunt în graf?', answer: () => nodes.length });
    questions.push({
      key: 'edges',
      text: directed ? 'Câte muchii orientate există?' : 'Câte muchii unice există?',
      answer: () => {
        if (directed) return links.length;
        const setU = new Set();
        links.forEach(l => {
          const s = l.source.id || l.source;
          const t = l.target.id || l.target;
          const key = s < t ? `${s},${t}` : `${t},${s}`;
          setU.add(key);
        });
        return setU.size;
      }
    });
    // Free trees: children & leaves if root
    if (!directed) {
      const adj = buildAdj();
      const randomRoot = nodes[Math.floor(Math.random() * nodes.length)].id;
      const children = adj[randomRoot] || [];
      if (children.length > 0) {
        questions.push({
          key: `childrenOf${randomRoot}`,
          text: `Dacă nodul ${randomRoot} ar fi rădăcina, care ar fi fii lui?`,
          answer: () => children.slice()
        });
      }
      const leaves = Object.entries(adj)
        .filter(([node, nbrs]) => Number(node) !== randomRoot && nbrs.length === 1)
        .map(([node]) => Number(node));
      if (leaves.length > 0) {
        questions.push({
          key: `leavesIfRoot${randomRoot}`,
          text: `Dacă nodul ${randomRoot} ar fi rădăcina, care ar fi frunzele?`,
          answer: () => leaves.slice()
        });
      }
    }
    return questions;
  }, [nodes, links, directed, buildAdj]);

  // Pick 5 random questions
  const questions = useMemo(
    () => [...pool].sort(() => Math.random() - 0.5).slice(0, 5),
    [pool]
  );

  const [answersState, setAnswersState] = useState({});
  const [score, setScore] = useState(null);
  const [wrong, setWrong] = useState([]);

  const handleChange = (key, value) =>
    setAnswersState(prev => ({ ...prev, [key]: value }));

  const handleSubmit = e => {
    e.preventDefault();
    let pts = 0;
    const incorrect = [];
    questions.forEach(q => {
      const userInput = (answersState[q.key] || '').trim();
      const correctVal = q.answer();
      const correctStr = Array.isArray(correctVal)
        ? correctVal.slice().sort((a,b) => a-b).join(',')
        : correctVal.toString();
      let isCorrect = false;
      if (Array.isArray(correctVal)) {
        const userArr = userInput
          ? userInput.split(',').map(s => Number(s.trim()))
          : [];
        const sortedUser = userArr.filter(n => !isNaN(n)).sort((a,b) => a-b);
        isCorrect = JSON.stringify(sortedUser) ===
          JSON.stringify(correctVal.slice().sort((a,b) => a-b));
      } else {
        isCorrect = userInput.toLowerCase() === correctStr.toLowerCase();
      }
      if (isCorrect) pts++;
      else incorrect.push({ text: q.text, correct: correctStr });
    });
    setScore(`${pts} / ${questions.length}`);
    setWrong(incorrect);
  };

  // Reset when graph or questions change
  useEffect(() => {
    setScore(null);
    setWrong([]);
    setAnswersState({}); // clear previous answers
  }, [nodes, links, directed, pool]);

  return (
    <div className="p-2">
      <h3 className="text-lg font-semibold mb-4">Mini Test</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map(q => (
          <div key={q.key}>
            <label className="font-medium block mb-1">{q.text}</label>
            <input
              type="text"
              value={answersState[q.key] || ''}
              onChange={e => handleChange(q.key, e.target.value)}
              className="mt-1 w-full p-2 border rounded text-sm"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue text-white py-2 rounded hover:bg-light-blue transition"
        >
          Verifică
        </button>
      </form>
      {score && (
        <div className="mt-4">
          <p className="font-medium">Scor: {score}</p>
          {wrong.length > 0 && (
            <div className="mt-2">
              <p className="font-medium">Ai greșit la:</p>
              <ul className="list-disc list-inside">
                {wrong.map((w, i) => (
                  <li key={i}>
                    {w.text} - Răspuns corect: <strong>{w.correct}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

MiniTest.propTypes = {
  nodes: PropTypes.array.isRequired,
  links: PropTypes.array.isRequired,
  directed: PropTypes.bool.isRequired,
};
