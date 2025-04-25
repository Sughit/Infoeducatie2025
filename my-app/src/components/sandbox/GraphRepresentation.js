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
  export function generateAdjList(n, links) {
    const adjList = {};
    for (let i = 1; i <= n; i++) adjList[i] = [];
    links.forEach(({ source, target }) => {
      if (adjList[source]) adjList[source].push(target);
    });
    return adjList;
  }
  
  /**
   * Generates an edge list representation.
   * @param {Array<{source:number, target:number}>} links
   * @returns {Array<[number,number]>}
   */
  export function generateEdgeList(links) {
    return links.map(({ source, target }) => [source, target]);
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
    const m = links.length;
    const matrix = Array.from({ length: n }, () => Array(m).fill(0));
    links.forEach((l, idx) => {
      const s = typeof l.source === 'object' ? l.source.id : l.source;
      const t = typeof l.target === 'object' ? l.target.id : l.target;
      if (s >= 1 && s <= n) matrix[s - 1][idx] = directed ? -1 : 1;
      if (t >= 1 && t <= n) matrix[t - 1][idx] = 1;
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
    // build adjacency list for directed graph
    const adj = {};
    for (let i = 1; i <= n; i++) adj[i] = [];
    links.forEach(({ source, target }) => {
      if (adj[source]) adj[source].push(target);
    });
  
    // initialize path matrix
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
   * Index (node-1) gives parent id, or 0/null for root.
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
  