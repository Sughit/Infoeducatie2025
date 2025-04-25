// src/components/Sandbox.js
import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import {
  generateDirected,
  generateUndirected,
  generateFreeTree,
  generateRootedTree,
  addNode,
  removeLastNode
} from './sandbox/Logic';
import { drawGraph } from './sandbox/GraphView';
import {
  generateAdjacencyMatrix,
  generateAdjList,
  generateEdgeList
} from './sandbox/GraphRepresentation';

export default function Sandbox() {
  const graphRef = useRef();
  const containerRef = useRef();
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [directed, setDirected] = useState(true);
  const [isTree, setIsTree] = useState(false);
  const [layoutMode, setLayoutMode] = useState('matrix'); // 'matrix', 'adjList', 'edgeList'
  const [matrix, setMatrix] = useState([]);

  // initialize empty graph
  useEffect(() => {
    const { nodes: ns, links: ls } = generateDirected(5);
    updateGraph(ns, ls, false, true);
  }, []);

  function updateGraph(ns, ls, treeMode, dirMode) {
    setNodes(ns);
    setLinks(ls);
    setDirected(dirMode);
    setIsTree(treeMode);
    setMatrix(generateAdjacencyMatrix(ns.length, ls));
    drawGraph(graphRef.current, ns, ls, treeMode, dirMode);
  }

  // Handlers
  const handleGenerateUndirected = () => {
    const { nodes: ns, links: ls } = generateUndirected( Math.min(Math.floor(Math.random() * 10) + 5, 10) );
    updateGraph(ns, ls, false, false);
  };
  const handleGenerateDirected = () => {
    const { nodes: ns, links: ls } = generateDirected( Math.min(Math.floor(Math.random() * 10) + 5, 10) );
    updateGraph(ns, ls, false, true);
  };
  const handleGenerateFreeTree = () => {
    const { nodes: ns, links: ls } = generateFreeTree( Math.min(Math.floor(Math.random() * 10) + 5, 10) );
    updateGraph(ns, ls, false, false);
  };
  const handleGenerateRootedTree = () => {
    const { nodes: ns, links: ls } = generateRootedTree( Math.min(Math.floor(Math.random() * 10) + 5, 10) );
    updateGraph(ns, ls, true, true);
  };
  const handleAddNode = () => {
    const { nodes: ns, links: ls } = addNode(nodes, links, directed, isTree);
    updateGraph(ns, ls, isTree, directed);
  };
  const handleRemoveLastNode = () => {
    const { nodes: ns, links: ls } = removeLastNode(nodes, links);
    updateGraph(ns, ls, isTree, directed);
  };
  
  // Update matrix & links on cell change
  function handleMatrixCellChange(i, j, value) {
    const newMatrix = matrix.map(row => [...row]);
    const num = Number(value);
    newMatrix[i][j] = num;
    if (!directed) newMatrix[j][i] = num;
    setMatrix(newMatrix);

    // Sync links with matrix edits
    let updatedLinks = links.filter(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      // keep existing links unchanged unless it matches edited cell
      if (s === i+1 && t === j+1) return num === 1;
      if (!directed && s === j+1 && t === i+1) return num === 1;
      return true;
    });
    if (num === 1) {
      updatedLinks.push({ source: i+1, target: j+1 });
      if (!directed) updatedLinks.push({ source: j+1, target: i+1 });
    }
    setLinks(updatedLinks);
    drawGraph(graphRef.current, nodes, updatedLinks, isTree, directed);
  }

  // Refresh is now optional since links auto-sync
  function handleRefreshFromMatrix() {
    updateGraph(nodes, links, isTree, directed);
  }

  // Redraw on state change
  useEffect(() => {
    if (nodes.length) drawGraph(graphRef.current, nodes, links, isTree, directed);
  }, [nodes, links, isTree, directed]);

  // Representations
  const adjList = generateAdjList(nodes.length, links);
  const edgeList = generateEdgeList(links);

  return (
    <div className="flex h-full">
      <div className="w-3/5 flex flex-col space-y-3 p-3">
        <div className="bg-white p-2 shadow rounded">
          <h2 className="text-lg font-medium mb-1">Controls</h2>
          <div className="grid grid-cols-2 gap-1 text-sm">
            <button onClick={handleGenerateUndirected} className="px-2 py-1 bg-blue text-white rounded">Neorientat</button>
            <button onClick={handleGenerateDirected} className="px-2 py-1 bg-blue text-white rounded">Orientat</button>
            <button onClick={handleGenerateFreeTree} className="px-2 py-1 bg-blue text-white rounded">Arbore</button>
            <button onClick={handleGenerateRootedTree} className="px-2 py-1 bg-blue text-white rounded">Rădăcină</button>
            <button onClick={handleAddNode} className="px-2 py-1 bg-green-500 text-white rounded">+ Nod</button>
            <button onClick={handleRemoveLastNode} className="px-2 py-1 bg-red-500 text-white rounded">- Nod</button>
          </div>
        </div>
        <div ref={containerRef} className="h-96 border border-gray-300 rounded overflow-hidden">
          <svg ref={graphRef} className="w-full h-full" />
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleRefreshFromMatrix} className="px-3 py-1 bg-indigo-600 text-white text-sm rounded">Refresh</button>
          <select value={layoutMode} onChange={e => setLayoutMode(e.target.value)} className="px-2 py-1 border rounded text-sm">
            <option value="matrix">Matrice Adiacentă</option>
            <option value="adjList">Liste Vecini</option>
            <option value="edgeList">Vector Muchii</option>
          </select>
        </div>
        <div className="overflow-auto max-h-48 border-t pt-2 text-sm">
          {layoutMode === 'matrix' && (
            <>
              <h3 className="font-medium">Matrice Adiacentă</h3>
              <table className="w-full table-auto border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="p-1"></th>
                    {matrix.map((_, j) => <th key={j} className="p-1 border">{j+1}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, i) => (
                    <tr key={i}>
                      <th className="p-1 border">{i+1}</th>
                      {row.map((val, j) => (
                        <td key={j} className="p-1 border text-center">
                          <select value={val} onChange={e => handleMatrixCellChange(i, j, e.target.value)} className="w-full text-xs p-0">
                            <option value={0}>0</option>
                            <option value={1}>1</option>
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {layoutMode === 'adjList' && (
            <div>
              <h3 className="font-medium">Liste Vecini</h3>
              <pre>{JSON.stringify(adjList, null, 2)}</pre>
            </div>
          )}
          {layoutMode === 'edgeList' && (
            <div>
              <h3 className="font-medium">Vector Muchii</h3>
              <pre>{JSON.stringify(edgeList, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
      <aside className="w-2/5 border-l border-gray-200 p-4 overflow-auto text-sm">
        <h2 className="text-xl font-semibold mb-4">Mini Test</h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium">1. Câte componente conexe?</p>
            <input type="number" className="mt-1 w-full p-1 border rounded text-sm" />
          </div>
          <div>
            <p className="font-medium">2. Câte cicluri?</p>
            <input type="number" className="mt-1 w-full p-1 border rounded text-sm" />
          </div>
          <div>
            <p className="font-medium">3. Graf orientat?</p>
            <select className="mt-1 w-full p-1 border rounded text-sm">
              <option value="true">Da</option>
              <option value="false">Nu</option>
            </select>
          </div>
        </div>
      </aside>
    </div>
  );
}