// src/utils/GraphRepresentation.js

/**
 * Generates an adjacency matrix for a graph.
 * @param {number} n - Number of nodes
 * @param {Array<{source:number, target:number}>} links
 * @returns {number[][]}
 */
export function generateAdjacencyMatrix(n, links) {
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
    links.forEach(({ source, target }) => {
      if (source >= 1 && source <= n && target >= 1 && target <= n) {
        matrix[source - 1][target - 1] = 1;
      }
    });
    return matrix;
  }
  
  /**
   * Generates an adjacency list representation.
   * @param {number} n - Number of nodes
   * @param {Array<{source:number, target:number}>} links
   * @returns {{[key:number]: number[]}}
   */
  export function generateAdjList(n, links, directed = true) {
    const adjList = {};
    for (let i = 1; i <= n; i++) adjList[i] = [];
    if (directed) {
      links.forEach(({ source, target }) => {
        const s = typeof source === 'object' ? source.id : source;
        const t = typeof target === 'object' ? target.id : target;
        adjList[s]?.push(t);
      });
    } else {
      // undirected: add both directions
      links.forEach(({ source, target }) => {
        const s = typeof source === 'object' ? source.id : source;
        const t = typeof target === 'object' ? target.id : target;
        if (adjList[s] && !adjList[s].includes(t)) adjList[s].push(t);
        if (adjList[t] && !adjList[t].includes(s)) adjList[t].push(s);
      });
    }
    return adjList;
  }
  
  /**
   * Generates an edge list representation.
   * Each column represents an edge: first row is source, second row is target.
   * For undirected graphs, duplicates are removed by including only edges with source < target.
   * @param {Array<{source:number, target:number}>} links
   * @param {boolean} directed - indicates if the graph is directed
   * @returns {Array<[number,number]>}
   */
  export function generateEdgeList(links, directed = true) {
    const edges = [];
    if (directed) {
      links.forEach(({ source, target }) => {
        const s = typeof source === 'object' ? source.id : source;
        const t = typeof target === 'object' ? target.id : target;
        edges.push([s, t]);
      });
    } else {
      const seen = new Set();
      links.forEach(({ source, target }) => {
        const s = typeof source === 'object' ? source.id : source;
        const t = typeof target === 'object' ? target.id : target;
        const a = Math.min(s, t);
        const b = Math.max(s, t);
        const key = `${a},${b}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push([a, b]);
        }
      });
    }
    return edges;
  }
  
  /**
   * Generates the incidence matrix for a graph.
   * For undirected graphs, entry is 1 if node is incident to edge.
   * For directed graphs, entry is -1 for source, +1 for target.
   * @param {number} n - Number of nodes
   * @param {Array<{source:number, target:number}>} links
   * @param {boolean} directed
   * @returns {number[][]}
   */
  export function generateIncidenceMatrix(n, links, directed = false) {
    // For directed, keep order; for undirected, dedupe by (min,max)
    let edges = [];
    if (directed) {
      edges = links.map(l => {
        const s = typeof l.source === 'object' ? l.source.id : l.source;
        const t = typeof l.target === 'object' ? l.target.id : l.target;
        return [s, t];
      });
    } else {
      const seen = new Set();
      links.forEach(l => {
        const s = typeof l.source === 'object' ? l.source.id : l.source;
        const t = typeof l.target === 'object' ? l.target.id : l.target;
        const a = Math.min(s, t);
        const b = Math.max(s, t);
        const key = `${a},${b}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push([a, b]);
        }
      });
    }
    const m = edges.length;
    const matrix = Array.from({ length: n }, () => Array(m).fill(0));
    edges.forEach(([s, t], idx) => {
      if (s >= 1 && s <= n) {
        matrix[s - 1][idx] = directed ? -1 : 1;
      }
      if (t >= 1 && t <= n) {
        matrix[t - 1][idx] = 1;
      }
    });
    return matrix;
  }
  
  /**
   * Generates the path matrix via breadth-first search for directed graph.
   * @param {number} n - Number of nodes
   * @param {Array<{source:number, target:number}>} links
   * @returns {number[][]}
   */
  export function generatePathMatrix(n, links) {
    const adj = {};
    for (let i = 1; i <= n; i++) adj[i] = [];
    links.forEach(({ source, target }) => {
      const s = typeof source === 'object' ? source.id : source;
      const t = typeof target === 'object' ? target.id : target;
      adj[s]?.push(t);
    });
  
    const path = Array.from({ length: n }, () => Array(n).fill(0));
  
    for (let i = 1; i <= n; i++) {
      const visited = Array(n + 1).fill(false);
      const queue = [i];
      visited[i] = true;
      while (queue.length) {
        const u = queue.shift();
        (adj[u] || []).forEach(v => {
          if (!visited[v]) {
            visited[v] = true;
            path[i - 1][v - 1] = 1;
            queue.push(v);
          }
        });
      }
    }
  
    return path;
  }
  
  /**
   * Generates the parent vector for a rooted tree.
   * Index (node-1) gives parent id, or 0 for root.
   * @param {number} n - Number of nodes
   * @param {Array<{source:number, target:number}>} links
   * @returns {Array<number>}
   */
  export function generateParentVector(n, links) {
    const parent = Array(n).fill(0);
    links.forEach(({ source, target }) => {
      const s = typeof source === 'object' ? source.id : source;
      const t = typeof target === 'object' ? target.id : target;
      if (t >= 1 && t <= n) parent[t - 1] = s;
    });
    return parent;
  }
  