import React, { useState, useRef } from 'react';
import * as d3 from 'd3';

export default function Sandbox() {
  const graphRef = useRef();
  const containerRef = useRef();
  const [matrix, setMatrix] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [directed, setDirected] = useState(true);
  const [isTree, setIsTree] = useState(false);

  const containerStyle = { width: '600px', height: '400px', border: '1px solid #ccc', overflow: 'hidden' };
  const layoutStyle = { display: 'flex', padding: '1rem' };
  const controlsStyle = { display: 'flex', flexDirection: 'column', gap: '0.5rem', marginRight: '1rem' };
  const buttonStyle = { padding: '0.5rem', cursor: 'pointer' };

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
    const ns = Array.from({ length: num }, (_, i) => ({ id: i }));
    const ls = [];
    for (let i = 0; i < num; i++) {
      const t = Math.floor(Math.random() * num);
      if (i !== t) ls.push({ source: i, target: t });
    }
    updateGraph(ns, ls, false, true);
  }

  function generateUndirected() {
    const num = Math.min(Math.floor(Math.random() * 10) + 5, 10);
    const ns = Array.from({ length: num }, (_, i) => ({ id: i }));
    const ls = [];
    for (let i = 0; i < num; i++) {
      for (let j = i + 1; j < num; j++) {
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
    const ns = Array.from({ length: num }, (_, i) => ({ id: i }));
    const ls = [];
    for (let i = 1; i < num; i++) {
      const parent = Math.floor(Math.random() * i);
      ls.push({ source: parent, target: i });
      ls.push({ source: i, target: parent });
    }
    updateGraph(ns, ls, false, false);
  }

  function generateRootedTree() {
    const num = Math.min(Math.floor(Math.random() * 10) + 5, 10);
    const ns = Array.from({ length: num }, (_, i) => ({ id: i }));
    const ls = [];
    for (let i = 1; i < num; i++) {
      const parent = Math.floor(Math.random() * i);
      ls.push({ source: parent, target: i });
    }
    updateGraph(ns, ls, true, true);
  }

  function addNode() {
    const newId = nodes.length;
    const ns = [...nodes, { id: newId }];
    const ls = [...links];
    if (isTree && directed) {
      ls.push({ source: 0, target: newId });
    }
    updateGraph(ns, ls, isTree, directed);
  }

  function removeLastNode() {
    if (!nodes.length) return;
    const ns = nodes.slice(0, -1);
    const ls = links.filter(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      return s < ns.length && t < ns.length;
    });
    updateGraph(ns, ls, isTree, directed);
  }

  function generateAdjacencyMatrix(n, links) {
    const m = Array.from({ length: n }, () => Array(n).fill(0));
    links.forEach(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      if (s >= 0 && s < n && t >= 0 && t < n) m[s][t] = 1;
    });
    return m;
  }

  function handleMatrixChange(i, j, value) {
    const newMatrix = matrix.map(row => [...row]);
    newMatrix[i][j] = Number(value);
    setMatrix(newMatrix);
  }

  function refreshGraphFromMatrix() {
    const ns = nodes.map(n => ({ id: n.id }));
    const ls = [];
    matrix.forEach((row, i) => row.forEach((val, j) => {
      if (val === 1) ls.push({ source: i, target: j });
    }));
    updateGraph(ns, ls, isTree, directed);
  }

  function draw(nodesData, linksData, treeMode = false, dirMode = true) {
    const svg = d3.select(graphRef.current);
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

    // Rooted tree
    const stratify = d3.stratify().id(d => d.id).parentId(d => d.parentId);
    const data = nodesData.map(n => ({ id: n.id.toString(), parentId: n.id === 0 ? null : linksData.find(l => l.target === n.id).source.toString() }));
    const root = stratify(data);
    const treeLayout = d3.tree().size([width, height]);
    treeLayout(root);

    g.selectAll('path.link').data(root.links()).enter().append('path')
      .attr('class', 'link').attr('fill', 'none').attr('stroke', '#999').attr('stroke-width', 2)
      .attr('d', d3.linkVertical().x(d => d.x).y(d => d.y));

    g.selectAll('circle.node').data(root.descendants()).enter().append('circle')
      .attr('class', 'node').attr('r', d => d.data.id === '0' ? 12 : 8)
      .attr('fill', d => d.data.id === '0' ? 'orange' : '#007bff')
      .attr('cx', d => d.x).attr('cy', d => d.y);

    g.selectAll('text.label').data(root.descendants()).enter().append('text')
      .attr('class', 'label').text(d => d.data.id).attr('font-size', '10px')
      .attr('x', d => d.x).attr('y', d => d.y - (d.data.id === '0' ? 16 : 12))
      .attr('text-anchor', 'middle');
  }

  return (
    <div style={layoutStyle}>
      <div style={controlsStyle}>
        <button style={buttonStyle} onClick={generateUndirected}>Graf Neorientat</button>
        <button style={buttonStyle} onClick={generateDirected}>Graf Orientat</button>
        <button style={buttonStyle} onClick={generateFreeTree}>Arbore Liber</button>
        <button style={buttonStyle} onClick={generateRootedTree}>Arbore cu Rădăcină</button>
        <button style={buttonStyle} onClick={addNode}>Adaugă Nod</button>
        <button style={buttonStyle} onClick={removeLastNode}>Elimină Nod</button>
      </div>
      <div>
        <div ref={containerRef} style={containerStyle}><svg ref={graphRef} width="100%" height="100%" /></div>
        <button onClick={refreshGraphFromMatrix} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Reîmprospătează Graf</button>
        {matrix.length > 0 && (
          <table style={{ margin:'1rem auto', borderCollapse:'collapse' }}>
            <thead><tr><th></th>{matrix.map((_,j)=><th key={j} style={{ border:'1px solid #aaa', padding:'4px' }}>{j}</th>)}</tr></thead>
            <tbody>
              {matrix.map((row,i)=>(<tr key={i}><th style={{ border:'1px solid #aaa', padding:'4px' }}>{i}</th>{row.map((val,j)=>(
                <td key={j} style={{ border:'1px solid #aaa', padding:'2px' }}>
                  <select value={val} onChange={e=>handleMatrixChange(i,j,e.target.value)}>
                    <option value={0}>0</option><option value={1}>1</option>
                  </select>
                </td>
              ))}</tr>))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
