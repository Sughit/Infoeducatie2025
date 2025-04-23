import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function Sandbox() {
  const graphRef = useRef();
  const containerRef = useRef();
  const [matrix, setMatrix] = useState([]);
  const [layoutMode, setLayoutMode] = useState('matrix');  // 'matrix', 'adjList', 'edgeList'
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [directed, setDirected] = useState(true);
  const [isTree, setIsTree] = useState(false);

  function updateGraph(ns, ls, treeMode = false, dirMode = true) {
    setNodes(ns);
    setLinks(ls);
    setDirected(dirMode);
    setIsTree(treeMode);
    setMatrix(generateAdjacencyMatrix(ns.length, ls));
    draw(ns, ls, treeMode, dirMode);
  }

  function generateDirected() {
    const num = Math.min(Math.floor(Math.random() * 10) + 5, 10);
    const ns = Array.from({ length: num }, (_, i) => ({ id: i + 1 }));
    const ls = [];
    for (let i = 1; i <= num; i++) {
      const t = Math.floor(Math.random() * num) + 1;
      if (i !== t) ls.push({ source: i, target: t });
    }
    updateGraph(ns, ls, false, true);
  }

  function generateUndirected() {
    const num = Math.min(Math.floor(Math.random() * 10) + 5, 10);
    const ns = Array.from({ length: num }, (_, i) => ({ id: i + 1 }));
    const ls = [];
    for (let i = 1; i <= num; i++) {
      for (let j = i + 1; j <= num; j++) {
        if (Math.random() < 0.3) {
          ls.push({ source: i, target: j });
          ls.push({ source: j, target: i });
        }
      }
    }
    updateGraph(ns, ls, false, false);
  }

  function generateFreeTree() {
    const num = Math.min(Math.floor(Math.random() * 10) + 5, 10);
    const ns = Array.from({ length: num }, (_, i) => ({ id: i + 1 }));
    const ls = [];
    for (let i = 2; i <= num; i++) {
      const parent = Math.floor(Math.random() * (i - 1)) + 1;
      ls.push({ source: parent, target: i });
      ls.push({ source: i, target: parent });
    }
    updateGraph(ns, ls, false, false);
  }

  function generateRootedTree() {
    const num = Math.min(Math.floor(Math.random() * 10) + 5, 10);
    const ns = Array.from({ length: num }, (_, i) => ({ id: i + 1 }));
    const ls = [];
    for (let i = 2; i <= num; i++) {
      const parent = Math.floor(Math.random() * (i - 1)) + 1;
      ls.push({ source: parent, target: i });
    }
    updateGraph(ns, ls, true, true);
  }

  function addNode() {
    const newId = nodes.length + 1;
    const ns = [...nodes, { id: newId }];
    let ls = [...links];
    if (isTree) {
      const parent = Math.floor(Math.random() * (newId - 1)) + 1;
      ls.push({ source: parent, target: newId });
    } else if (!directed) {
      const neighbor = Math.floor(Math.random() * (newId - 1)) + 1;
      ls.push({ source: newId, target: neighbor });
      ls.push({ source: neighbor, target: newId });
    } else {
      const neighbor = Math.floor(Math.random() * (newId - 1)) + 1;
      if (neighbor !== newId) ls.push({ source: newId, target: neighbor });
    }
    updateGraph(ns, ls, isTree, directed);
  }

  function removeLastNode() {
    if (nodes.length === 0) return;
    const removeId = nodes.length;
    const ns = nodes.slice(0, -1);
    const raw = links.filter(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      return s !== removeId && t !== removeId;
    });
    const ls = raw.map(l => ({
      source: typeof l.source === 'object' ? l.source.id : l.source,
      target: typeof l.target === 'object' ? l.target.id : l.target
    }));
    setMatrix(prev => prev.slice(0, -1).map(row => row.slice(0, -1)));
    updateGraph(ns, ls, isTree, directed);
  }

  function generateAdjacencyMatrix(n, links) {
    const m = Array.from({ length: n }, () => Array(n).fill(0));
    links.forEach(l => {
      const s = l.source - 1;
      const t = l.target - 1;
      if (s >= 0 && s < n && t >= 0 && t < n) m[s][t] = 1;
    });
    return m;
  }

  function handleMatrixChange(i, j, value) {
    const newMatrix = matrix.map(row => [...row]);
    const num = Number(value);
    newMatrix[i][j] = num;
    if (!directed) newMatrix[j][i] = num;
    setMatrix(newMatrix);
  }

  function refreshGraphFromMatrix() {
    const ns = nodes.map(n => ({ id: n.id }));
    const ls = [];
    matrix.forEach((row, i) => row.forEach((val, j) => {
      if (val === 1) ls.push({ source: i + 1, target: j + 1 });
    }));
    updateGraph(ns, ls, isTree, directed);
  }

  function draw(nodesData, linksData, treeMode = false, dirMode = true) {
    const svg = d3.select(graphRef.current);
    if (!nodesData || nodesData.length === 0) {
      svg.selectAll('*').remove();
      return;
    }
    const { width, height } = containerRef.current.getBoundingClientRect();
    svg.selectAll('*').remove();
    const g = svg.append('g');
    const zoomBehavior = d3.zoom().scaleExtent([0.1, 10]).on('zoom', e => g.attr('transform', e.transform));
    svg.call(zoomBehavior);
    svg.append('rect').attr('width', width).attr('height', height).style('fill', 'none').style('pointer-events', 'all').lower();
    svg.append('defs').append('marker')
      .attr('id', 'arrow').attr('viewBox', '0 0 10 10').attr('refX', 5).attr('refY', 5)
      .attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
      .append('path').attr('d', 'M0,0 L10,5 L0,10 Z').attr('fill', '#999');
    if (!treeMode) {
      const sim = d3.forceSimulation(nodesData)
        .force('link', d3.forceLink(linksData).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(width / 2, height / 2));
      const link = g.selectAll('path.link').data(linksData).enter().append('path')
        .attr('class', 'link').attr('fill', 'none').attr('stroke', '#999').attr('stroke-width', 2);
      if (dirMode) link.attr('marker-mid', 'url(#arrow)');
      const node = g.selectAll('circle.node').data(nodesData).enter().append('circle')
        .attr('class', 'node').attr('r', 8).attr('fill', '#007bff')
        .call(d3.drag()
          .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
          .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
        );
      const label = g.selectAll('text.label').data(nodesData).enter().append('text')
        .attr('class', 'label').text(d => d.id).attr('font-size', '10px').attr('dy', -12).attr('text-anchor', 'middle');
      sim.on('tick', () => {
        link.attr('d', d => {
          const x1 = d.source.x, y1 = d.source.y, x2 = d.target.x, y2 = d.target.y;
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
          return `M${x1},${y1} L${mx},${my} L${x2},${y2}`;
        });
        node.attr('cx', d => d.x).attr('cy', d => d.y);
        label.attr('x', d => d.x).attr('y', d => d.y);
      });
      return;
    }
    const stratify = d3.stratify().id(d => d.id).parentId(d => (d.parentId === null ? null : d.parentId));
    const data = nodesData.map(n => {
      const child = n.id;
      const parentLink = linksData.find(l => l.target === child);
      return { id: child.toString(), parentId: child === 1 ? null : parentLink ? parentLink.source.toString() : null };
    });
    const root = stratify(data);
    const treeLayout = d3.tree().size([width, height]);
    treeLayout(root);
    g.selectAll('path.link').data(root.links()).enter().append('path')
      .attr('class', 'link').attr('fill', 'none').attr('stroke', '#999').attr('stroke-width', 2)
      .attr('d', d3.linkVertical().x(d => d.x).y(d => d.y));
    g.selectAll('circle.node').data(root.descendants()).enter().append('circle')
      .attr('class', 'node').attr('r', d => d.data.id === '1' ? 12 : 8)
      .attr('fill', d => d.data.id === '1' ? 'orange' : '#007bff')
      .attr('cx', d => d.x).attr('cy', d => d.y);
    g.selectAll('text.label').data(root.descendants()).enter().append('text')
      .attr('class', 'label').text(d => d.data.id).attr('font-size', '10px')
      .attr('x', d => d.x).attr('y', d => d.y - (d.data.id === '1' ? 16 : 12))
      .attr('text-anchor', 'middle');
  }

  const parentVector = isTree ? nodes.map(n => n.id === 1 ? 0 : (links.find(l => l.target === n.id)?.source || 0)) : null;

  useEffect(() => {
    if (nodes.length) draw(nodes, links, isTree, directed);
  }, [nodes, links, isTree, directed]);

  return (
    <div className="flex h-full">
      <div className="w-3/5 flex flex-col space-y-3 p-3">
        <div className="bg-white p-2 shadow rounded">
          <h2 className="text-lg font-medium mb-1">Controls</h2>
          <div className="grid grid-cols-2 gap-1 text-sm">
            <button onClick={generateUndirected} className="px-2 py-1 bg-blue text-white rounded hover:bg-blue/90">Neorientat</button>
            <button onClick={generateDirected} className="px-2 py-1 bg-blue text-white rounded hover:bg-blue/90">Orientat</button>
            <button onClick={generateFreeTree} className="px-2 py-1 bg-blue text-white rounded hover:bg-blue/90">Arbore</button>
            <button onClick={generateRootedTree} className="px-2 py-1 bg-blue text-white rounded hover:bg-blue/90">Rădăcină</button>
            <button onClick={addNode} className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600">+ Nod</button>
            <button onClick={removeLastNode} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">- Nod</button>
          </div>
        </div>
        <div ref={containerRef} className="h-96 border border-gray-300 rounded overflow-hidden">
          <svg ref={graphRef} className="w-full h-full" />
        </div>
        <div className="flex items-center space-x-2">
        <button onClick={refreshGraphFromMatrix} className="self-start px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">Refresh</button>
        <div>
          <select value={layoutMode} onChange={e=>setLayoutMode(e.target.value)} className="px-2 py-1 border rounded text-sm">
            <option value="matrix">Matrice Adiacentă</option>
            <option value="adjList">Liste Vecini</option>
            <option value="edgeList">Vector Muchii</option>
          </select>
        </div>
      </div>
        {!isTree ? (
          <div className="overflow-auto max-h-48 border-t pt-2">
            <h3 className="text-sm font-medium mb-1">Matrice Adiacentă</h3>
            <table className="w-full table-auto border-collapse text-xs">
              <thead>
                <tr><th className="p-1"></th>{matrix.map((_, j) => <th key={j} className="p-1 border">{j+1}</th>)}</tr>
              </thead>
              <tbody>{matrix.map((row,i)=>(<tr key={i}><th className="p-1 border">{i+1}</th>{row.map((val,j)=>(<td key={j} className="p-1 border text-center"><select value={val} onChange={e=>handleMatrixChange(i,j,e.target.value)} className="w-full text-xs p-0 bg-white"><option value={0}>0</option><option value={1}>1</option></select></td>))}</tr>))}</tbody>
            </table>
          </div>
        ) : (
          <div className="pt-2 border-t text-sm font-mono"><strong>Vector părinți:</strong> [{parentVector.join(', ')}]</div>
        )}
      </div>
      <aside className="w-2/5 border-l border-gray-200 p-4 overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Mini Test</h2>
        <div className="space-y-4 text-sm">
          <div><p className="font-medium">1. Câte componente conexe?</p><input type="number" className="mt-1 w-full p-1 border rounded text-sm" /></div>
          <div><p className="font-medium">2. Câte cicluri?</p><input type="number" className="mt-1 w-full p-1 border rounded text-sm" /></div>
          <div><p className="font-medium">3. Graf orientat?</p><select className="mt-1 w-full p-1 border rounded text-sm"><option value="true">Da</option><option value="false">Nu</option></select></div>
        </div>
      </aside>
    </div>
  );
}
