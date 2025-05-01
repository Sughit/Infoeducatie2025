// src/components/Simulation.js
import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

const algorithms = ['DFS', 'BFS', 'Kruskal', 'Prim'];

export default function Simulation() {
  const [algorithm, setAlgorithm] = useState('DFS');
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [sortedEdges, setSortedEdges] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [startNode, setStartNode] = useState(null);
  const [weightMap, setWeightMap] = useState({});
  const [nodeCount, setNodeCount] = useState('');
  const svgRef = useRef();
  const containerRef = useRef();
  const margin = 40;

  // Helpers
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
  const findNode = id => {
    const nid = typeof id === 'object' && id.id !== undefined ? id.id : id;
    return nodes.find(n => n.id === nid) || { x: 0, y: 0 };
  };
  const isNodeVisited = id => steps[currentStep]?.visited?.includes(id) || false;
  const activeEdge = () => steps[currentStep]?.activeEdges?.[0] || null;
  const isEdgeActive = (e, active) => active.some(([u, v]) => {
    const su = u.id ?? u, sv = v.id ?? v;
    const es = e.source.id ?? e.source, et = e.target.id ?? e.target;
    return (su === es && sv === et) || (su === et && sv === es);
  });

  // Generate graph
  const generateGraph = size => {
    let graph;
    if (['Kruskal', 'Prim'].includes(algorithm)) {
      graph = generateWeightedGraph(size, 10);
      // sort by weight then by u
      let edges = graph.links
        .map(l => {
          const u = typeof l.source === 'object' ? l.source.id : l.source;
          const v = typeof l.target === 'object' ? l.target.id : l.target;
          return u < v ? { u, v, w: l.weight } : null;
        })
        .filter(e => e);
      // remove duplicate edge entries
      edges = edges.filter((e, i, arr) => arr.findIndex(x => x.u === e.u && x.v === e.v) === i);
      // sort by weight then by node u
      edges.sort((a, b) => a.w - b.w || a.u - b.u);
      setSortedEdges(edges);
      const wm = {};
      edges.forEach(e => { wm[`${e.u}-${e.v}`] = e.w; });
      setWeightMap(wm);
    } else {
      graph = generateUndirected(size);
      setSortedEdges([]);
      setWeightMap({});
    }
    const { nodes: ns, links: ls } = graph;
    setStartNode(ns[0]?.id || null);
    const { width, height } = containerRef.current.getBoundingClientRect();
    const sim = d3.forceSimulation(ns)
      .force('link', d3.forceLink(ls).id(d => d.id).distance(algorithm === 'Prim' ? 120 : 80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(25))
      .stop();
    for (let i = 0; i < 300; i++) sim.tick();
    ns.forEach(n => {
      n.x = clamp(n.x, margin, width - margin);
      n.y = clamp(n.y, margin, height - margin);
    });
    setNodes([...ns]);
    setLinks(ls.map(l => ({ ...l })));
    setCurrentStep(0);
  };

  // On algorithm change
  useEffect(() => {
    const size = ['DFS', 'BFS'].includes(algorithm)
      ? (parseInt(nodeCount) > 0 ? parseInt(nodeCount) : Math.floor(Math.random() * 8) + 3)
      : (parseInt(nodeCount) > 0 ? parseInt(nodeCount) : 7);
    generateGraph(size);
  }, [algorithm]);

  // Compute steps
  useEffect(() => {
    if (!nodes.length || (['DFS', 'BFS'].includes(algorithm) && startNode == null)) return;
    let simSteps = [];
    switch (algorithm) {
      case 'DFS': simSteps = simulateDFS(nodes, links, startNode); break;
      case 'BFS': simSteps = simulateBFS(nodes, links, startNode); break;
      case 'Kruskal': simSteps = simulateKruskal(nodes, links); break;
      case 'Prim': simSteps = simulatePrim(nodes, links, startNode); break;
    }
    setSteps(simSteps);
    setCurrentStep(0);
  }, [nodes, links, algorithm, startNode, weightMap]);

  // Prepare taken edges for MST
  const kruskalTaken = [];
  if (algorithm === 'Kruskal') {
    steps.slice(0, currentStep + 1).forEach(s => s.activeEdges?.forEach(([u, v]) => {
      const a = Math.min(u, v), b = Math.max(u, v);
      const key = `${a}-${b}`;
      if (!kruskalTaken.find(e => e.u === a && e.v === b)) kruskalTaken.push({ u: a, v: b, w: weightMap[key] });
    }));
  }
  const primTaken = [];
  if (algorithm === 'Prim') {
    steps.slice(0, currentStep + 1).forEach(s => s.activeEdges?.forEach(([u, v]) => {
      const a = Math.min(u, v), b = Math.max(u, v);
      const key = `${a}-${b}`;
      if (!primTaken.find(e => e.u === a && e.v === b)) primTaken.push({ u: a, v: b, w: weightMap[key] });
    }));
  }
  const takenEdges = algorithm === 'Kruskal' ? kruskalTaken :
                     algorithm === 'Prim'    ? primTaken     : [];
  const kruskalRemaining = algorithm === 'Kruskal'
    ? sortedEdges.filter(e => !kruskalTaken.find(t => t.u === e.u && t.v === e.v))
    : [];
  const primRemaining = algorithm === 'Prim'
    ? sortedEdges.filter(e => !primTaken.find(t => t.u === e.u && t.v === e.v))
    : [];

  // Render graph
  useEffect(() => renderGraph(), [nodes, links, currentStep]);
  function renderGraph() {
    const svg = d3.select(svgRef.current); svg.selectAll('*').remove();
    if (!nodes.length) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const g = svg.append('g');
    const active = steps[currentStep]?.activeEdges || [];

    g.selectAll('line').data(links).enter().append('line')
      .attr('x1', d => clamp(findNode(d.source).x, margin, width - margin))
      .attr('y1', d => clamp(findNode(d.source).y, margin, height - margin))
      .attr('x2', d => clamp(findNode(d.target).x, margin, width - margin))
      .attr('y2', d => clamp(findNode(d.target).y, margin, height - margin))
      .attr('stroke', d => {
        const su = typeof d.source === 'object' ? d.source.id : d.source;
        const sv = typeof d.target === 'object' ? d.target.id : d.target;
        const key = `${Math.min(su, sv)}-${Math.max(su, sv)}`;
        if (takenEdges.find(e => `${e.u}-${e.v}` === key)) return 'orange';
        if (isEdgeActive(d, active)) return 'orange';
        return '#999';
      })
      .attr('stroke-width', d => isEdgeActive(d, active) || takenEdges.some(e => `${e.u}-${e.v}` === `${Math.min(d.source,d.target)}-${Math.max(d.source,d.target)}`) ? 4 : 2)
      .lower();

    g.selectAll('circle').data(nodes).enter().append('circle')
      .attr('cx', d => d.x).attr('cy', d => d.y).attr('r', 12)
      .attr('fill', d => {
        if (['DFS','BFS'].includes(algorithm) && (d.id === startNode || isNodeVisited(d.id))) return 'orange';
        if ((algorithm === 'Kruskal' || algorithm === 'Prim') && takenEdges.some(e => e.u === d.id || e.v === d.id)) return 'orange';
        return '#007bff';
      })
      .call(d3.drag().on('drag', (event, d) => {
        const [x, y] = d3.pointer(event, svgRef.current); d.x = clamp(x, margin, width - margin); d.y = clamp(y, margin, height - margin); renderGraph();
      }));

    g.selectAll('text').data(nodes).enter().append('text')
      .attr('x', d => d.x).attr('y', d => d.y - 16)
      .attr('text-anchor', 'middle').attr('font-size', '10px')
      .text(d => d.id);
  }

  // Traversal data
  const visitedList = ['DFS','BFS'].includes(algorithm) ? (steps[currentStep]?.visited || []) : [];
  const actEdge = ['DFS','BFS'].includes(algorithm) ? activeEdge() : null;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <div ref={containerRef} className="w-1/2 h-full border-r relative">
        <svg ref={svgRef} className="w-full h-full absolute inset-0" />
      </div>
      <div className="w-1/2 h-full flex flex-col overflow-auto p-4">
        <h2 className="text-2xl font-semibold mb-4">Simulări Algoritmi</h2>
        <div className="flex flex-wrap items-center space-x-2 mb-4">
          {algorithms.map(algo=>(
            <button key={algo} onClick={()=>setAlgorithm(algo)} className={`px-3 py-1 rounded ${algorithm===algo?'bg-highlight text-white':'bg-gray-200'}`}>{algo}</button>
          ))}
          <input type="number" min="1" placeholder="nr noduri" value={nodeCount} onChange={e=>setNodeCount(e.target.value)} className="w-20 border rounded px-2 py-1" />
          <button onClick={()=>generateGraph(parseInt(nodeCount)||null)} className="px-3 py-1 bg-green-500 text-white rounded">Regenerate</button>
          {['DFS','BFS'].includes(algorithm) && (
            <div className="flex items-center space-x-2">
              <label>Nodul de start:</label>
              <select value={startNode||''} onChange={e=>setStartNode(Number(e.target.value))} className="border rounded px-2 py-1">
                {nodes.map(n=> <option key={n.id} value={n.id}>{n.id}</option>)}
              </select>
            </div>
          )}
        </div>
        {['DFS','BFS'].includes(algorithm) && (
          <>
            <h3 className="font-medium">Noduri vizitate</h3>
            <div className="mb-4 overflow-x-auto">
              <table className="w-max table-auto border-collapse whitespace-nowrap">
                <thead><tr>{visitedList.map((n,i)=><th key={i} className="border px-2 py-1">{n}</th>)}</tr></thead>
              </table>
            </div>
            <h3 className="font-medium">Muchia Activă</h3>
            <div className="mb-4 text-center p-2 bg-gray-100 rounded">{actEdge?`${actEdge[0]} - ${actEdge[1]}`:'-'}</div>
          </>
        )}
        {algorithm==='Kruskal' && (
          <>
            <h3 className="font-medium">Remaining Edges</h3>
            <table className="mb-2 w-full table-auto border-collapse text-sm"><thead><tr className="bg-gray-100"><th className="border px-2 py-1">Edge</th><th className="border px-2 py-1">Weight</th></tr></thead><tbody>
              {kruskalRemaining.map(e=>{
                const key=`${e.u}-${e.v}`;
                return <tr key={key}><td className="border px-2 py-1">{e.u}-{e.v}</td><td className="border px-2 py-1 text-center"><input type="number" min="1" value={weightMap[key]} disabled={currentStep>0} onChange={ev=>{
                  const w=Number(ev.target.value); setWeightMap(wm=>({...wm,[key]:w})); setLinks(ls=>ls.map(l=>{
                    const su=typeof l.source==='object'?l.source.id:l.source; const sv=typeof l.target==='object'?l.target.id:l.target;
                    if((su===e.u&&sv===e.v)||(su===e.v&&sv===e.u)) return{...l,weight:w}; return l;
                  }));
                }} className="w-16 text-center border rounded"/></td></tr>;
              })}
            </tbody></table>
            <h3 className="font-medium">Taken Edges</h3>
            <table className="mb-4 w-full table-auto border-collapse text-sm"><thead><tr className="bg-gray-100"><th className="border px-2 py-1">Edge</th><th className="border px-2 py-1">Weight</th></tr></thead><tbody>
              {kruskalTaken.map(e=><tr key={`${e.u}-${e.v}`}><td className="border px-2 py-1">{e.u}-{e.v}</td><td className="border px-2 py-1 text-center">{e.w}</td></tr>)}
            </tbody></table>
          </>
        )}
        {algorithm==='Prim' && (
          <>
            <h3 className="font-medium">Remaining Edges</h3>
            <table className="mb-2 w-full table-auto border-collapse text-sm"><tbody>
              {primRemaining.map(e=><tr key={`${e.u}-${e.v}`}><td className="border px-2 py-1">{e.u}-{e.v}</td><td className="border px-2 py-1 text-center"><input type="number" min="1" value={weightMap[`${e.u}-${e.v}`]} disabled={currentStep>0} onChange={ev=>{
                const w=Number(ev.target.value); setWeightMap(wm=>({...wm,[`${e.u}-${e.v}`]:w})); setLinks(ls=>ls.map(l=>{
                  const su=typeof l.source==='object'?l.source.id:l.source; const sv=typeof l.target==='object'?l.target.id:l.target;
                  if((su===e.u&&sv===e.v)||(su===e.v&&sv===e.u)) return{...l,weight:w}; return l;
                }));
              }} className="w-16 text-center border rounded"/></td></tr>)}
            </tbody></table>
            <h3 className="font-medium">Taken Edges</h3>
            <table className="mb-4 w-full table-auto border-collapse text-sm"><tbody>
              {primTaken.map(e=><tr key={`${e.u}-${e.v}`}><td className="border px-2 py-1">{e.u}-{e.v}</td><td className="border px-2 py-1 text-center">{e.w}</td></tr>)}
            </tbody></table>
          </>
        )}
        <div className="flex items-center space-x-2 mb-4">
          <button onClick={()=>setCurrentStep(s=>Math.max(0,s-1))} className="px-2 py-1 bg-blue text-white rounded">Prec</button>
          <button onClick={()=>setCurrentStep(s=>Math.min(steps.length-1,s+1))} className="px-2 py-1 bg-blue text-white rounded">Urm</button>
          <span>Pas {currentStep+1}/{steps.length}</span>
        </div>
      </div>
    </div>
  );
}

// Utility functions below...

function generateUndirected(numNodes = 7) {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({ id: i + 1 }));
  const links = [];
  for (let i = 1; i <= numNodes; i++) {
    for (let j = i + 1; j <= numNodes; j++) {
      if (Math.random() < 0.3) {
        links.push({ source: i, target: j });
        links.push({ source: j, target: i });
      }
    }
  }
  return { nodes, links };
}

function generateWeightedGraph(numNodes = 7, extraEdges = 10) {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({ id: i + 1 }));
  const links = [];
  // tree backbone
  for (let i = 2; i <= numNodes; i++) {
    const p = Math.floor(Math.random() * (i - 1)) + 1;
    const w = Math.floor(Math.random() * 20) + 1;
    links.push({ source: p, target: i, weight: w });
    links.push({ source: i, target: p, weight: w });
  }
  // extra edges
  for (let k = 0; k < extraEdges; k++) {
    const u = Math.floor(Math.random() * numNodes) + 1;
    const v = Math.floor(Math.random() * numNodes) + 1;
    if (u !== v) {
      const w = Math.floor(Math.random() * 20) + 1;
      links.push({ source: u, target: v, weight: w });
      links.push({ source: v, target: u, weight: w });
    }
  }
  return { nodes, links };
}

function simulateDFS(nodes, links, start) {
  const adj = {};
  nodes.forEach(n => (adj[n.id] = []));
  links.forEach(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source;
    const t = typeof l.target === 'object' ? l.target.id : l.target;
    adj[s].push(t);
  });
  const visited = new Set();
  const steps = [];
  function dfs(u) {
    visited.add(u);
    steps.push({ visited: Array.from(visited), activeEdges: [] });
    for (const v of adj[u]) {
      if (!visited.has(v)) {
        steps.push({ visited: Array.from(visited), activeEdges: [[u, v]] });
        dfs(v);
      }
    }
  }
  dfs(start);
  return steps;
}

function simulateBFS(nodes, links, start) {
  const adj = {};
  nodes.forEach(n => (adj[n.id] = []));
  links.forEach(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source;
    const t = typeof l.target === 'object' ? l.target.id : l.target;
    adj[s].push(t);
  });
  const visited = new Set([start]);
  const queue = [start];
  const steps = [{ visited: [start], activeEdges: [] }];
  while (queue.length) {
    const u = queue.shift();
    for (const v of adj[u]) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
        steps.push({ visited: Array.from(visited), activeEdges: [[u, v]] });
      }
    }
  }
  return steps;
}

function simulateKruskal(nodes, links) {
  const parent = {};
  function find(u) { return parent[u] === u ? u : (parent[u] = find(parent[u])); }
  function union(u, v) { parent[find(u)] = find(v); }

  const edges = [];
  links.forEach(e => {
    const u = typeof e.source === 'object' ? e.source.id : e.source;
    const v = typeof e.target === 'object' ? e.target.id : e.target;
    if (u < v) edges.push([u, v, e.weight]);
  });
  edges.sort((a, b) => a[2] - b[2] || a[0] - b[0]);

  nodes.forEach(n => { parent[n.id] = n.id; });

  const steps = [];
  let count = 0;
  for (const [u, v, w] of edges) {
    if (count >= nodes.length - 1) break;
    const ru = find(u), rv = find(v);
    steps.push({ visited: [], activeEdges: [[u, v]], added: ru !== rv });
    if (ru !== rv) {
      union(u, v);
      count++;
    }
  }
  return steps;
}

function simulatePrim(nodes, links, start) {
  const visited = new Set([start]);
  let pq = links.filter(l => (typeof l.source === 'object' ? l.source.id : l.source) === start);
  pq.sort((a, b) => a.weight - b.weight);
  const steps = [{ visited: [start], activeEdges: [] }];
  while (pq.length) {
    const e = pq.shift();
    const u = typeof e.source === 'object' ? e.source.id : e.source;
    const v = typeof e.target === 'object' ? e.target.id : e.target;
    steps.push({ visited: Array.from(visited), activeEdges: [[u, v]] });
    if (!visited.has(v)) {
      visited.add(v);
      pq = pq.concat(
        links.filter(l => (typeof l.source === 'object' ? l.source.id : l.source) === v && !visited.has((typeof l.target === 'object' ? l.target.id : l.target)))
      );
      pq.sort((a, b) => a.weight - b.weight);
    }
  }
  return steps;
}
