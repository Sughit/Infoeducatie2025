// src/components/Sandbox.js
import React, { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import {
    generateDirected,
    generateUndirected,
    generateFreeTree,
    generateRootedTree,
    addNode,
    removeLastNode,
    generateCompleteGraph,
    generateHamiltonianGraph,
    generateEulerianGraph,
    generateTournamentGraph
} from './sandbox/Logic';
import {
    generateAdjacencyMatrix,
    generateAdjList,
    generateEdgeList,
    generateIncidenceMatrix,
    generatePathMatrix,
    generateParentVector
} from './sandbox/GraphRepresentation';
import { drawGraph } from './sandbox/GraphView';
import MiniTest from './sandbox/Minitest';

export default function Sandbox() {
    const graphRef = useRef();
    const containerRef = useRef();
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [directed, setDirected] = useState(true);
    const [isTree, setIsTree] = useState(false);
    const [layoutMode, setLayoutMode] = useState('matrix');
    const [matrix, setMatrix] = useState([]);

    useEffect(() => {
        const { nodes: ns, links: ls } = generateDirected(5);
        updateGraph(ns, ls, false, true);
    }, []);

    function updateGraph(ns, ls, treeMode, dirMode) {
        setNodes(ns.map(n => ({ ...n })), ls.map(l => ({ ...l }))); // Asigură-te că nodes și links sunt copii
        setDirected(dirMode);
        setIsTree(treeMode);
        setMatrix(generateAdjacencyMatrix(ns.length, ls));
        // Modifică apelul drawGraph pentru a accepta direct nodes și links
        drawGraph(graphRef.current, ns, ls, treeMode, dirMode);
        setLayoutMode(getModes(treeMode, dirMode)[0].value);
    }

    function getModes(treeMode, dirMode) {
        if (treeMode && dirMode) return [{ value: 'parent', label: 'Vectorul de Tați' }];
        const base = [
            { value: 'matrix', label: 'Matricea de Adiacentă' },
            { value: 'adjList', label: 'Listele Vecinilor' },
            { value: 'edgeList', label: 'Vectorul Muchie' }
        ];
        return dirMode
            ? base.concat([
                { value: 'incidence', label: 'Matricea de Incidență' },
                { value: 'path', label: 'Matricea Drumurilor' }
            ])
            : base;
    }

    const handleGenerateUndirected = () => {
        const { nodes: ns, links: ls } = generateUndirected(Math.min(Math.floor(Math.random() * 10) + 5, 10));
        updateGraph(ns, ls, false, false);
    };
    const handleGenerateDirected = () => {
        const { nodes: ns, links: ls } = generateDirected(Math.min(Math.floor(Math.random() * 10) + 5, 10));
        updateGraph(ns, ls, false, true);
    };
    const handleGenerateFreeTree = () => {
        const { nodes: ns, links: ls } = generateFreeTree(Math.min(Math.floor(Math.random() * 10) + 5, 10));
        updateGraph(ns, ls, false, false);
    };
    const handleGenerateRootedTree = () => {
        const { nodes: ns, links: ls } = generateRootedTree(Math.min(Math.floor(Math.random() * 10) + 5, 10));
        updateGraph(ns, ls, true, true);
    };
    const handleGenerateCompleteGraph = () => {
        const { nodes: ns, links: ls } = generateCompleteGraph(nodes.length, directed);
        updateGraph(ns, ls, false, directed);
    };
    const handleGenerateHamiltonianGraph = () => {
        const { nodes: ns, links: ls } = generateHamiltonianGraph(nodes.length, directed);
        updateGraph(ns, ls, false, directed);
    };
    const handleGenerateEulerianGraph = () => {
        const { nodes: ns, links: ls } = generateEulerianGraph(nodes.length, directed);
        updateGraph(ns, ls, false, directed);
    };
    const handleGenerateTournamentGraph = () => {
        const { nodes: ns, links: ls } = generateTournamentGraph(nodes.length);
        updateGraph(ns, ls, false, true);
    };

    const handleAddNode = () => {
        const { nodes: ns, links: ls } = addNode(nodes, links, directed, isTree);
        updateGraph(ns, ls, isTree, directed);
        const oldMatrix = matrix;
        const newSize = oldMatrix.length + 1;
        const newMatrix = oldMatrix.map(row => [...row, 0]);
        newMatrix.push(Array(newSize).fill(0));
        ls.forEach(l => {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t = typeof l.target === 'object' ? l.target.id : l.target;
            if (s === newSize || t === newSize) {
                newMatrix[s - 1][t - 1] = 1;
                if (!directed) newMatrix[t - 1][s - 1] = 1;
            }
        });
        setMatrix(newMatrix);
    };
    const handleRemoveLastNode = () => {
        const { nodes: ns, links: ls } = removeLastNode(nodes, links);
        updateGraph(ns, ls, isTree, directed);
        const oldMatrix = matrix;
        const newMatrix = oldMatrix
            .slice(0, -1)
            .map(row => row.slice(0, -1));
        setMatrix(newMatrix);
    };

    function handleMatrixCellChange(i, j, value) {
        const newMatrix = matrix.map(row => [...row]);
        const num = Number(value);
        newMatrix[i][j] = num;
        if (!directed) newMatrix[j][i] = num;
        setMatrix(newMatrix);
        let updated = links.filter(l => {
            const s = typeof l.source === 'object' ? l.source.id : l.source;
            const t = typeof l.target === 'object' ? l.target.id : l.target;
            if (s === i + 1 && t === j + 1) return num === 1;
            if (!directed && s === j + 1 && t === i + 1) return num === 1;
            return true;
        });
        if (num === 1) {
            updated.push({ source: i + 1, target: j + 1 });
            if (!directed) updated.push({ source: j + 1, target: i + 1 });
        }
        setLinks(updated);
        drawGraph(graphRef.current, nodes, updated, isTree, directed);
    }

    const handleRefresh = () => updateGraph(nodes, links, isTree, directed);

    const handleSetNewRoot = (newRootId) => {
        const rootNodeId = parseInt(newRootId);
        if (!isNaN(rootNodeId) && rootNodeId >= 1 && rootNodeId <= nodes.length) {
            const hierarchicalData = createHierarchicalData(nodes, links, rootNodeId);
            // 'hierarchicalData' este acum o structură potrivită pentru d3.stratify()
            // Va trebui să ajustezi funcția drawGraph pentru a procesa această structură
            updateGraph(hierarchicalData, [], true, true); // Trecem hierarchicalData ca 'nodes' și o listă goală de 'links'
        } else {
            alert("ID invalid!");
        }
    };

    const createHierarchicalData = (currentNodes, currentLinks, rootNodeId) => {
      const nodeMap = new Map(currentNodes.map(node => [node.id, { ...node, children: [] }]));
      const root = nodeMap.get(rootNodeId);
      if (!root) {
          console.error("Root node not found!");
          return [];
      }
  
      // Verifică că există doar un singur nod fără parentId
      const rootNodes = currentNodes.filter(node => !currentLinks.some(link => link.target === node.id));
      if (rootNodes.length > 1) {
          alert("Multiple roots detected! There can only be one root node.");
          return [];
      }
  
      currentLinks.forEach(link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          const sourceNode = nodeMap.get(sourceId);
          const targetNode = nodeMap.get(targetId);
  
          if (sourceNode && targetNode) {
              targetNode.parentId = sourceId; // Adăugăm parentId pentru stratify
              sourceNode.children.push(targetNode);
          }
      });
  
      // Convertim map-ul în array-ul de date necesar pentru d3.stratify()
      const hierarchicalArray = Array.from(nodeMap.values()).map(node => ({
          id: node.id.toString(), // d3.stratify() necesită ID-uri string
          parentId: node.parentId ? node.parentId.toString() : null,
          ...node // Păstrează celelalte proprietăți ale nodului
      }));
  
      return hierarchicalArray;
  };

    const adjList = generateAdjList(nodes.length, links);
    const edgeList = generateEdgeList(links, directed);
    const incidenceMatrix = directed ? generateIncidenceMatrix(nodes.length, links, true) : null;
    const pathMatrix = directed ? generatePathMatrix(nodes.length, links) : null;
    const parentVector = isTree && directed ? generateParentVector(nodes.length, links) : null;
    const modes = getModes(isTree, directed);

    return (
        <div className="flex flex-col md:flex-row h-full p-3 space-y-3 md:space-y-0 md:space-x-3">
            <div className="flex flex-col md:w-3/5 space-y-3">
                <div className="bg-white p-2 shadow rounded">
                    <h2 className="text-lg font-medium mb-1">Controls</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                        <button onClick={handleGenerateUndirected} className="px-2 py-1 bg-blue text-white rounded">Graf Neorientat</button>
                        <button onClick={handleGenerateDirected} className="px-2 py-1 bg-blue text-white rounded">Graf Orientat</button>
                        <button onClick={handleGenerateFreeTree} className="px-2 py-1 bg-blue text-white rounded">Arbore Liber</button>
                        <button onClick={handleGenerateRootedTree} className="px-2 py-1 bg-blue text-white rounded">Arbore cu Rădăcină</button>
                        <button onClick={handleGenerateCompleteGraph} className="px-2 py-1 bg-blue text-white rounded">Graf Complet</button>
                        <button onClick={handleGenerateHamiltonianGraph} className="px-2 py-1 bg-blue text-white rounded">Graf Hamiltonian</button>
                        <button onClick={handleGenerateEulerianGraph} className="px-2 py-1 bg-blue text-white rounded">Graf Eulerian</button>
                        <button onClick={handleGenerateTournamentGraph} className="px-2 py-1 bg-blue text-white rounded">Graf Turneu</button>
                        <button onClick={handleAddNode} className="px-2 py-1 bg-green-500 text-white rounded">+ Nod</button>
                        <button onClick={handleRemoveLastNode} className="px-2 py-1 bg-red-500 text-white rounded">- Nod</button>
                    </div>
                </div>
                <div ref={containerRef} className="h-64 sm:h-96 border border-gray-300 rounded overflow-hidden">
                    <svg ref={graphRef} className="w-full h-full" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={handleRefresh} className="px-2 py-1 bg-blue text-white rounded text-sm">Reîmprospătează</button>
                    <select value={layoutMode} onChange={e => setLayoutMode(e.target.value)} className="px-2 py-1 border rounded text-sm flex-grow">
                        {modes.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    {layoutMode === 'matrix' && (
                        <table className="w-full table-auto border-collapse text-xs">
                            <thead><tr><th></th>{matrix.map((_, j) => <th key={j} className="border px-1">{j+1}</th>)}</tr></thead>
                            <tbody>{matrix.map((row,i)=>(<tr key={i}><th className="border px-1">{i+1}</th>{row.map((val,j)=>(<td key={j} className="border px-1 text-center"><select value={val} onChange={e=>handleMatrixCellChange(i,j,e.target.value)} className="w-full text-xs p-0 bg-white"><option value={0}>0</option><option value={1}>1</option></select></td>))}</tr>))}</tbody>
                        </table>
                    )}
                    {layoutMode === 'adjList' && (
                        <table className="w-full table-auto border-collapse text-xs">
                            <thead><tr className="bg-gray-100"><th className="border px-2 py-1">Nod</th><th className="border px-2 py-1">Vecini</th></tr></thead>
                            <tbody>{Object.entries(adjList).map(([node,nbrs])=>(<tr key={node}><td className="border px-2 py-1 text-center">{node}</td><td className="border px-2 py-1">{nbrs.join(', ')}</td></tr>))}</tbody>
                        </table>
                    )}
                    {layoutMode === 'edgeList' && (
                        <table className="w-full table-auto border-collapse text-xs">
                            <thead><tr className="bg-gray-100">{edgeList.map((_,idx)=><th key={idx} className="border px-2 py-1">u{idx+1}</th>)}</tr></thead>
                            <tbody><tr>{edgeList.map(([s],idx)=><td key={idx} className="border px-2 py-1 text-center">{s}</td>)}</tr><tr>{edgeList.map(([,t],idx)=><td key={idx} className="border px-2 py-1 text-center">{t}</td>)}</tr></tbody>
                        </table>
                    )}
                    {layoutMode === 'incidence' && incidenceMatrix && (
                        <table className="w-full table-auto border-collapse text-xs">
                            <thead><tr><th></th>{links.map((_,j)=><th key={j} className="border px-1">u{j+1}</th>)}</tr></thead>
                            <tbody>{incidenceMatrix.map((row,i)=>(<tr key={i}><th className="border px-1">{i+1}</th>{row.map((v,j)=><td key={j} className="border px-1 text-center">{v}</td>)}</tr>))}</tbody>
                        </table>
                    )}
                    {layoutMode === 'path' && pathMatrix && (
                        <table className="w-full table-auto border-collapse text-xs">
                            <thead><tr><th></th>{pathMatrix.map((_,j)=><th key={j} className="border px-1">{j+1}</th>)}</tr></thead>
                            <tbody>{pathMatrix.map((row,i)=>(<tr key={i}><th className="border px-1">{i+1}</th>{row.map((v,j)=><td key={j} className="border px-1 text-center">{v}</td>)}</tr>))}</tbody>
                        </table>
                    )}
                    {layoutMode === 'parent' && nodes.length > 0 && (
    <div className="space-y-2">
        <button
            onClick={() => {
                const newRoot = prompt("Introdu ID-ul noului nod rădăcină:");
                if (newRoot) {
                    handleSetNewRoot(newRoot);
                }
            }}
            className="px-2 py-1 bg-purple-500 text-white rounded text-sm"
        >
            Schimbă Rădăcina
        </button>

        {/* Afișează informații despre structura arborescentă dacă este cazul */}
        {isTree && directed && layoutMode === 'parent' && (
            <table className="w-full table-auto border-collapse text-xs">
                <thead>
                    <tr>
                        <th className="border px-2 py-1">Nod</th>
                        <th className="border px-2 py-1">Părinte</th>
                    </tr>
                </thead>
                <tbody>
                    {nodes.map(node => (
                        <tr key={node.id}>
                            <td className="border px-2 py-1 text-center">{node.id}</td>
                            <td className="border px-2 py-1 text-center">{node.parentId || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
    </div>
)}
                </div>
            </div>
            <div className="md:w-2/5 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0">
                <MiniTest nodes={nodes.filter(n => !n.children)} links={links} directed={directed} />
            </div>
        </div>
    );
}