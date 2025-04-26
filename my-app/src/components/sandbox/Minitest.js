import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * MiniTest component: renders a random subset of 5 questions from a pool
 * Props:
 * - nodes: current node array
 * - links: current link array
 * - directed: boolean flag
 */
export default function MiniTest({ nodes, links, directed }) {
  // Build question pool based on graph type
  const pool = useMemo(() => {
    const questions = [];
    // Common: components
    questions.push({
      key: 'components',
      text: 'Câte componente conexe?',
      answer: () => {
        const adj = {};
        for (let i = 1; i <= nodes.length; i++) adj[i] = [];
        links.forEach(l => {
          const s = l.source.id || l.source;
          const t = l.target.id || l.target;
          adj[s].push(t);
          adj[t].push(s);
        });
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
    // Common: cycles (cyclomatic number)
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
        const comps = questions.find(q => q.key==='components').answer();
        return edgeSet.size - nodes.length + comps;
      }
    });
    // Conditional degree questions
    if (directed) {
      // Out-degree
      questions.push({
        key: 'maxOutDegree',
        text: 'Care este gradul extern maxim al unui nod?',
        answer: () => {
          const outDeg = {};
          for (let i = 1; i <= nodes.length; i++) outDeg[i] = 0;
          links.forEach(l => {
            const s = l.source.id || l.source;
            outDeg[s]++;
          });
          return Math.max(...Object.values(outDeg));
        }
      });
      // In-degree
      questions.push({
        key: 'maxInDegree',
        text: 'Care este gradul intern maxim al unui nod?',
        answer: () => {
          const inDeg = {};
          for (let i = 1; i <= nodes.length; i++) inDeg[i] = 0;
          links.forEach(l => {
            const t = l.target.id || l.target;
            inDeg[t]++;
          });
          return Math.max(...Object.values(inDeg));
        }
      });
    } else {
      // degree for undirected
      questions.push({
        key: 'maxDegree',
        text: 'Care este gradul maxim al unui nod?',
        answer: () => {
          const deg = {};
          for (let i = 1; i <= nodes.length; i++) deg[i] = 0;
          links.forEach(l => {
            const s = l.source.id || l.source;
            const t = l.target.id || l.target;
            deg[s]++;
            deg[t]++;
          });
          return Math.max(...Object.values(deg));
        }
      });
    }
    // Common: node count
    questions.push({
      key: 'nodes',
      text: 'Câte noduri sunt în graf?',
      answer: () => nodes.length
    });
    // Common: edge count
    questions.push({
      key: 'edges',
      text: directed
        ? 'Câte muchii orientate există?'
        : 'Câte muchii (considerate ca unice) există?',
      answer: () => {
        if (directed) return links.length;
        // unique undirected
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
    return questions;
  }, [nodes, links, directed]);

  // Random subset of 5 questions
  const questions = useMemo(() => {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [pool]);

  const [answersState, setAnswersState] = useState({});
  const [score, setScore] = useState(null);

  const handleChange = (key, value) => {
    setAnswersState(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    let pts = 0;
    questions.forEach(q => {
      const user = (answersState[q.key]||'').toString().trim().toLowerCase();
      const correct = q.answer().toString().toLowerCase();
      if (user === correct) pts++;
    });
    setScore(`${pts} / ${questions.length}`);
  };

  // Reset when graph changes
  useEffect(() => setScore(null), [nodes, links, directed]);

  return (
    <div className="p-2">
      <h3 className="text-lg font-semibold mb-4">Mini Test</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {questions.map(q => (
          <div key={q.key}>
            <label className="font-medium block mb-1">{q.text}</label>
            <input
              type="text"
              value={answersState[q.key]||''}
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
        {score && <p className="mt-2 font-medium">Scor: {score}</p>}
      </form>
    </div>
  );
}

MiniTest.propTypes = {
  nodes: PropTypes.array.isRequired,
  links: PropTypes.array.isRequired,
  directed: PropTypes.bool.isRequired,
};
