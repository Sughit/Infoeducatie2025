import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import {
  generateUndirected,
  generateWeightedGraph,
  simulateDFS,
  simulateBFS,
  simulateKruskal,
  simulatePrim
} from './SimulationAlgorithms';
import { drawGraph } from './sandbox/GraphView';

const algorithms = ['DFS', 'BFS', 'Kruskal', 'Prim', 'BST'];
const margin = 40;

export default function Simulation() {
  // Common state
  const [algorithm, setAlgorithm] = useState('DFS');
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Controls
  const [nodeCount, setNodeCount] = useState('7');
  const [sortedEdges, setSortedEdges] = useState([]);
  const [weightMap, setWeightMap] = useState({});
  const [startNode, setStartNode] = useState(null);

  // BST state
  const [bstTree, setBstTree] = useState(null);
  const [bstInsertVal, setBstInsertVal] = useState('');
  const [bstSearchVal, setBstSearchVal] = useState('');
  const [bstSteps, setBstSteps] = useState([]);
  const [bstCurrentStep, setBstCurrentStep] = useState(0);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const svgRef = useRef();
  const containerRef = useRef();

  // Track container size
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // BST helpers
  const insertIntoBST = useCallback((node, val) => {
    if (!node) return { id: val, left: null, right: null };
    if (val < node.id) node.left = insertIntoBST(node.left, val);
    else if (val > node.id) node.right = insertIntoBST(node.right, val);
    return node;
  }, []);

  const flattenBST = useCallback(root => {
    const n = [], l = [];
    const traverse = node => {
      if (!node) return;
      n.push({ id: node.id });
      if (node.left) { l.push({ source: node.id, target: node.left.id }); traverse(node.left); }
      if (node.right) { l.push({ source: node.id, target: node.right.id }); traverse(node.right); }
    };
    traverse(root);
    return { nodes: n, links: l };
  }, []);

  const handleBstInsert = () => {
    const val = Number(bstInsertVal);
    if (isNaN(val)) return;
    const newRoot = insertIntoBST(bstTree, val);
    setBstTree(newRoot);
    const { nodes: n, links: l } = flattenBST(newRoot);
    setNodes(n);
    setLinks(l);
    setStartNode(newRoot.id);
    setBstInsertVal('');
    setBstSteps([]);
    setBstCurrentStep(0);
  };

  const handleBstSearch = () => {
    const val = Number(bstSearchVal);
    if (isNaN(val) || !bstTree) return;
    const seq = [];
    const searchNode = node => {
      if (!node) return;
      seq.push(node.id);
      if (val === node.id) return;
      if (val < node.id) searchNode(node.left);
      else searchNode(node.right);
    };
    searchNode(bstTree);
    setBstSteps(seq);
    setBstCurrentStep(0);
  };

  // Graph helpers
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const findNode = id => nodes.find(n => n.id === (id.id ?? id)) || { x: 0, y: 0 };
  const isEdgeActive = (edge, active) => active.some(([u, v]) => {
    const su = u.id ?? u, sv = v.id ?? v;
    const es = edge.source.id ?? edge.source, et = edge.target.id ?? edge.target;
    return (su === es && sv === et) || (su === et && sv === es);
  });

  const generateGraph = size => {
    let graph;
    if (['Kruskal', 'Prim'].includes(algorithm)) {
      // — weighted graph generation & sorting —
      graph = generateWeightedGraph(size, 10);
      let edges = graph.links
        .map(l => {
          const u = typeof l.source === 'object' ? l.source.id : l.source;
          const v = typeof l.target === 'object' ? l.target.id : l.target;
          return u < v ? { u, v, w: l.weight } : null;
        })
        .filter(Boolean);
      // dedupe + sort
      edges = edges.filter((e, i, arr) =>
        arr.findIndex(x => x.u === e.u && x.v === e.v) === i
      );
      edges.sort((a, b) => a.w - b.w || a.u - b.u);
      setSortedEdges(edges);
      // build weightMap
      const wm = {};
      edges.forEach(e => { wm[`${e.u}-${e.v}`] = e.w; });
      setWeightMap(wm);
    } else {
      // — unweighted graph —
      graph = generateUndirected(size);
      setSortedEdges([]);
      setWeightMap({});
    }
  
    // extract nodes & links
    const { nodes: ns, links: ls } = graph;
    setStartNode(ns[0]?.id ?? null);
  
    // — headless force-layout for initial positions —
    const { width, height } = containerRef.current.getBoundingClientRect();
    const sim = d3.forceSimulation(ns)
      .force('link',    d3.forceLink(ls).id(d => d.id).distance(
                        algorithm === 'Prim' ? 120 : 80
                      ))
      .force('charge',  d3.forceManyBody().strength(-200))
      .force('center',  d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(25))
      .stop();
  
    // tick until “settled”
    for (let i = 0; i < 300; i++) sim.tick();
  
    // clamp into margins
    ns.forEach(n => {
      n.x = clamp(n.x, margin, width  - margin);
      n.y = clamp(n.y, margin, height - margin);
    });
  
    // update React state with positioned nodes & links
    setNodes([...ns]);
    setLinks(ls.map(l => ({ ...l })));
  
    // reset any traversal/MST/BST state
    setSteps([]);
    setCurrentStep(0);
    setBstTree(null);
    setBstSteps([]);
    setBstCurrentStep(0);
  };

  useEffect(() => {
    if (algorithm !== 'BST') {
      const sz = parseInt(nodeCount) > 0 ? parseInt(nodeCount) : 7;
      generateGraph(sz);
    } else {
      // In BST mode, we don’t build a graph until first insert
      setNodes([]);
      setLinks([]);
      setSteps([]);
      setCurrentStep(0);
      setBstTree(null);
    }
  }, [algorithm, nodeCount]);
  

  useEffect(()=>{
    if(algorithm==='BST'||!nodes.length||(algorithm!=='BST'&&['DFS','BFS'].includes(algorithm)&&startNode==null))return;
    let sim=[];
    if(algorithm==='DFS')sim=simulateDFS(nodes,links,startNode);
    if(algorithm==='BFS')sim=simulateBFS(nodes,links,startNode);
    if(algorithm==='Kruskal')sim=simulateKruskal(nodes,links);
    if(algorithm==='Prim')sim=simulatePrim(nodes,links,startNode);
    setSteps(sim);
    setCurrentStep(0);
  },[nodes,links,algorithm,startNode,weightMap]);

  const activeEdges = steps[currentStep]?.activeEdges ?? [];
  const kruskalTaken = [];
  if(algorithm==='Kruskal')steps.slice(0,currentStep+1).forEach(s=>s.activeEdges?.forEach(([u,v])=>{
    const a=Math.min(u,v),b=Math.max(u,v),k=`${a}-${b}`;
    if(!kruskalTaken.find(e=>e.u===a&&e.v===b))kruskalTaken.push({u:a,v:b,w:weightMap[k]});
  }));
  const primTaken=[];
  if(algorithm==='Prim')steps.slice(0,currentStep+1).forEach(s=>s.activeEdges?.forEach(([u,v])=>{
    const a=Math.min(u,v),b=Math.max(u,v),k=`${a}-${b}`;
    if(!primTaken.find(e=>e.u===a&&e.v===b))primTaken.push({u:a,v:b,w:weightMap[k]});
  }));
  const takenEdges = algorithm==='Kruskal'?kruskalTaken:algorithm==='Prim'?primTaken:[];
  const kruskalRemaining=algorithm==='Kruskal'?sortedEdges.filter(e=>!kruskalTaken.find(t=>t.u===e.u&&t.v===e.v)):[];
  const primRemaining=algorithm==='Prim'?sortedEdges.filter(e=>!primTaken.find(t=>t.u===e.u&&t.v===e.v)):[];

  // Draw/update graph whenever nodes, links, steps, or dimensions change
  useEffect(() => {
    // wait for data and size
    if (!nodes.length || !dimensions.width || !dimensions.height) return;

    // BST: delegate to drawGraph
    if (algorithm === 'BST') {
      if (!bstTree) return;
      drawGraph(svgRef.current, nodes, links, true, false);
      return;
    }

    // compute active/taken edges
    const activeEdges = steps[currentStep]?.activeEdges ?? [];
    const takenEdges = [];
    if (['Kruskal','Prim'].includes(algorithm)) {
      steps.slice(0, currentStep+1).forEach(s => s.activeEdges?.forEach(([u,v]) => {
        const a = Math.min(u,v), b = Math.max(u,v), key = `${a}-${b}`;
        if (!takenEdges.find(e => e.u===a&&e.v===b)) takenEdges.push({u:a,v:b,w:weightMap[key]});
      }));
    }

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const width = dimensions.width;
    const height = dimensions.height;
    const g = svg.append('g');

    // draw links
    const link = g.selectAll('line')
      .data(links)
      .enter().append('line')
        .attr('stroke', d => {
          const u = d.source.id ?? d.source, v = d.target.id ?? d.target;
          const key = `${Math.min(u,v)}-${Math.max(u,v)}`;
          if (takenEdges.some(e=>`${e.u}-${e.v}`===key)) return 'orange';
          if (activeEdges.some(([a,b])=>(a===u&&b===v)||(a===v&&b===u))) return 'orange';
          return '#999';
        })
        .attr('stroke-width', d =>
          activeEdges.some(([a,b])=>(a===d.source.id&&b===d.target.id)||(a===d.target.id&&b===d.source.id))
          || takenEdges.some(e=>e.u===d.source.id&&e.v===d.target.id)
          ? 4 : 2
        )
        .attr('x1', d => clamp(d.source.x, margin, width - margin))
        .attr('y1', d => clamp(d.source.y, margin, height - margin))
        .attr('x2', d => clamp(d.target.x, margin, width - margin))
        .attr('y2', d => clamp(d.target.y, margin, height - margin))
        .lower();

    // draw nodes with drag
    const nodeG = g.selectAll('g.node')
      .data(nodes)
      .enter().append('g')
        .attr('class','node')
        .attr('transform', d=>`translate(${clamp(d.x,margin,width-margin)},${clamp(d.y,margin,height-margin)})`)
        .call(d3.drag()
          .on('start', function(event,d){ this.parentNode.appendChild(this); })
          .on('drag', function(event,d){
            d.x = clamp(event.x,margin,width-margin);
            d.y = clamp(event.y,margin,height-margin);
            d3.select(this).attr('transform',`translate(${d.x},${d.y})`);
            link.filter(l=>{
              const su=l.source.id??l.source, sv=l.target.id??l.target;
              return su===d.id||sv===d.id;
            })
            .attr('x1',l=>clamp(l.source.x,margin,width-margin))
            .attr('y1',l=>clamp(l.source.y,margin,height-margin))
            .attr('x2',l=>clamp(l.target.x,margin,width-margin))
            .attr('y2',l=>clamp(l.target.y,margin,height-margin));
          })
        );

    nodeG.append('circle')
      .attr('r',12)
      .attr('fill', d => {
        if (['DFS','BFS'].includes(algorithm) && steps[currentStep]?.visited.includes(d.id)) return 'orange';
        if (['Kruskal','Prim'].includes(algorithm) && takenEdges.some(e=>e.u===d.id||e.v===d.id)) return 'orange';
        return '#007bff';
      });

    nodeG.append('text')
      .attr('dy',-16)
      .attr('text-anchor','middle')
      .attr('font-size','10px')
      .text(d=>d.id);

  }, [algorithm, nodes, links, steps, currentStep, bstCurrentStep, weightMap, dimensions]);

  // UI lists
  const visitedListUI = ['DFS','BFS'].includes(algorithm)?steps[currentStep]?.visited||[]:[];
  const activeUI = ['DFS','BFS'].includes(algorithm)?activeEdges[0]:null;

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-4rem)] overflow-hidden">
      <div ref={containerRef} className="w-full h-1/2 md:w-1/2 md:h-full border-b md:border-b-0 md:border-r relative">
        <svg ref={svgRef} className="w-full h-full absolute inset-0" />
      </div>
      <div className="w-full h-1/2 md:w-1/2 md:h-full p-4 flex flex-col overflow-auto space-y-4">
        <h2 className="text-2xl font-semibold">Simulări Algoritmi</h2>
        <div className="flex flex-wrap space-x-2">
          {algorithms.map(algo=>(
            <button key={algo} onClick={()=>setAlgorithm(algo)} className={`px-3 py-1 rounded ${algorithm===algo?'bg-highlight text-white':'bg-gray-200'}`}>{algo}</button>
          ))}
        </div>

        {/* BST UI */}
        {algorithm==='BST'&&(
          <>
            <div className="flex space-x-2">
              <input type="number" value={bstInsertVal} onChange={e=>setBstInsertVal(e.target.value)} placeholder="Valoare" className="border rounded px-2 py-1 flex-grow" />
              <button onClick={handleBstInsert} className="bg-blue text-white px-3 py-1 rounded">Inserare</button>
            </div>
            <div className="flex space-x-2">
              <input type="number" value={bstSearchVal} onChange={e=>setBstSearchVal(e.target.value)} placeholder="Caută valoare" className="border rounded px-2 py-1 flex-grow" />
              <button onClick={handleBstSearch} className="bg-green-500 text-white px-3 py-1 rounded">Caută</button>
            </div>
            {bstSteps.length>0&&(
              <div>
                <h3 className="font-medium">Pași Căutare BST</h3>
                <div className="flex space-x-1 overflow-x-auto py-2">
                  {bstSteps.map((v,i)=>(<div key={i} className={`px-2 py-1 border rounded ${i===bstCurrentStep?'bg-highlight text-white':''}`}>{v}</div>))}
                </div>
                <div className="flex space-x-2">
                  <button onClick={()=>setBstCurrentStep(s=>Math.max(0,s-1))} className="px-2 py-1 bg-blue text-white rounded">Prev</button>
                  <button onClick={()=>setBstCurrentStep(s=>Math.min(bstSteps.length-1,s+1))} className="px-2 py-1 bg-blue text-white rounded">Urm</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Other Algorithms UI */}
        {algorithm!=='BST'&&(
          <>
            <div className="flex items-center space-x-2">
              <input type="number" min="1" placeholder="nr noduri" value={nodeCount} onChange={e=>setNodeCount(e.target.value)} className="w-20 border rounded px-2 py-1" />
              <button onClick={()=>generateGraph(parseInt(nodeCount)||7)} className="px-3 py-1 bg-green-500 text-white rounded">Regenerate</button>
              {['DFS','BFS'].includes(algorithm)&&(
                <div className="flex items-center space-x-2">
                  <label>Nod start:</label>
                  <select value={startNode||''} onChange={e=>setStartNode(Number(e.target.value))} className="border rounded px-2 py-1">
                    {nodes.map(n=><option key={n.id} value={n.id}>{n.id}</option>)}
                  </select>
                </div>
              )}
            </div>
            {['DFS','BFS'].includes(algorithm)&&(
              <>
                <h3 className="font-medium">Noduri vizitate</h3>
                <div className="overflow-x-auto mb-4"><table className="table-auto border-collapse"><thead><tr>{visitedListUI.map((n,i)=><th key={i} className="border px-2 py-1">{n}</th>)}</tr></thead></table></div>
                <h3 className="font-medium">Muchie activă</h3>
                <div className="p-2 bg-gray-100 rounded mb-4 text-center">{activeUI?`${activeUI[0]} - ${activeUI[1]}`:'-'}</div>
              </>
            )}
            {algorithm==='Kruskal'&&(
              <>
                <h3 className="font-medium">Muchii rămase</h3>
                <table className="mb-2 w-full table-auto border-collapse text-sm"><thead><tr className="bg-gray-100"><th className="border px-2 py-1">Muchie</th><th className="border px-2 py-1">Cost</th></tr></thead><tbody>
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
                <h3 className="font-medium">Muchii alese</h3>
                <table className="mb-4 w-full table-auto border-collapse text-sm"><thead><tr className="bg-gray-100"><th className="border px-2 py-1">Muchie</th><th className="border px-2 py-1">Cost</th></tr></thead><tbody>
                  {kruskalTaken.map(e=><tr key={`${e.u}-${e.v}`}><td className="border px-2 py-1">{e.u}-{e.v}</td><td className="border px-2 py-1 text-center">{e.w}</td></tr>)}
                </tbody></table>
              </>
            )}
            {algorithm==='Prim'&&(
              <>
                <h3 className="font-medium">Muchii rămase</h3>
                <table className="mb-2 w-full table-auto border-collapse text-sm"><tbody>
                  {primRemaining.map(e=><tr key={`${e.u}-${e.v}`}><td className="border px-2 py-1">{e.u}-{e.v}</td><td className="border px-2 py-1 text-center"><input type="number" min="1" value={weightMap[`${e.u}-${e.v}`]} disabled={currentStep>0} onChange={ev=>{
                    const w=Number(ev.target.value); setWeightMap(wm=>({...wm,[`${e.u}-${e.v}`]:w})); setLinks(ls=>ls.map(l=>{
                      const su=typeof l.source==='object'?l.source.id:l.source; const sv=typeof l.target==='object'?l.target.id:l.target;
                      if((su===e.u&&sv===e.v)||(su===e.v&&sv===e.u)) return{...l,weight:w}; return l;
                    }));
                  }} className="w-16 text-center border rounded"/></td></tr>)}
                </tbody></table>
                <h3 className="font-medium">Muchii alese</h3>
                <table className="mb-4 w-full table-auto border-collapse text-sm"><tbody>
                  {primTaken.map(e=><tr key={`${e.u}-${e.v}`}><td className="border px-2 py-1">{e.u}-{e.v}</td><td className="border px-2 py-1 text-center">{e.w}</td></tr>)}
                </tbody></table>
              </>
            )}
            <div className="flex space-x-2">
              <button onClick={()=>setCurrentStep(s=>Math.max(0,s-1))} className="px-2 py-1 bg-blue text-white rounded">Prev</button>
              <button onClick={()=>setCurrentStep(s=>Math.min(steps.length-1,s+1))} className="px-2 py-1 bg-blue text-white rounded">Urm</button>
              <span>Pas {currentStep+1}/{steps.length}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
