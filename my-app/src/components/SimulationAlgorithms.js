// SimulationAlgorithms.js

/**
 * Generates an undirected graph with random edges (bidirectional).
 * @param {number} numNodes
 * @returns {{nodes:Array<{id:number}>, links:Array<{source:number,target:number}>}}
 */
export function generateUndirected(numNodes = 7) {
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
  
  /**
   * Generates a weighted graph: starts with a spanning tree backbone and adds extra edges.
   * @param {number} numNodes
   * @param {number} extraEdges
   */
  export function generateWeightedGraph(numNodes = 7, extraEdges = 10) {
    const nodes = Array.from({ length: numNodes }, (_, i) => ({ id: i + 1 }));
    const links = [];
    // spanning tree backbone
    for (let i = 2; i <= numNodes; i++) {
      const p = Math.floor(Math.random() * (i - 1)) + 1;
      const w = Math.floor(Math.random() * 20) + 1;
      links.push({ source: p, target: i, weight: w });
      links.push({ source: i, target: p, weight: w });
    }
    // extra random edges
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
  
  /**
   * Depth-First Search simulation steps.
   * @param {Array} nodes
   * @param {Array} links
   * @param {number} start
   */
  export function simulateDFS(nodes, links, start) {
    const adj = {};
    nodes.forEach(n => (adj[n.id] = []));
    links.forEach(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      if (!(s in adj)) return;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      adj[s].push(t);
    });
    if (!(start in adj)) return [];
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
  
  /**
   * Breadth-First Search simulation steps.
   * @param {Array} nodes
   * @param {Array} links
   * @param {number} start
   */
  export function simulateBFS(nodes, links, start) {
    const adj = {};
    nodes.forEach(n => (adj[n.id] = []));
    links.forEach(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      if (!(s in adj)) return;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      adj[s].push(t);
    });
    if (!(start in adj)) return [];
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
  
  /**
   * Kruskal's algorithm simulation steps.
   * @param {Array} nodes
   * @param {Array} links
   */
  export function simulateKruskal(nodes, links) {
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
      const added = ru !== rv;
      steps.push({ visited: [], activeEdges: [[u, v]], added });
      if (added) {
        union(u, v);
        count++;
      }
    }
    return steps;
  }
  
  /**
   * Prim's algorithm simulation steps.
   * @param {Array} nodes
   * @param {Array} links
   * @param {number} start
   */
  export function simulatePrim(nodes, links, start) {
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
  