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
    for (let i = 1; i <= n; i++) {
      adjList[i] = [];
    }
    links.forEach(({ source, target }) => {
      if (adjList[source]) adjList[source].push(target);
    });
    return adjList;
  }
  
  /**
   * Generates an edge list representation.
   * @param {Array<{source:number, target:number}>} links
   * @returns {Array<[number, number]>}
   */
  export function generateEdgeList(links) {
    return links.map(({ source, target }) => [source, target]);
  }
  