// src/utils/Logic.js

export function generateCompleteGraph(numNodes, directed = true) {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({ id: i + 1 }));
  const links = [];
  if (directed) {
    for (let i = 1; i <= numNodes; i++) {
      for (let j = 1; j <= numNodes; j++) {
        if (i !== j) links.push({ source: i, target: j });
      }
    }
  } else {
    for (let i = 1; i <= numNodes; i++) {
      for (let j = i + 1; j <= numNodes; j++) {
        links.push({ source: i, target: j });
        links.push({ source: j, target: i });
      }
    }
  }
  return { nodes, links };
}

function generateCycleGraph(numNodes, directed = true) {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({ id: i + 1 }));
  const links = [];
  for (let i = 1; i < numNodes; i++) {
    links.push({ source: i, target: i + 1 });
    if (!directed) links.push({ source: i + 1, target: i });
  }
  // close cycle
  links.push({ source: numNodes, target: 1 });
  if (!directed) links.push({ source: 1, target: numNodes });
  return { nodes, links };
}

export function generateHamiltonianGraph(numNodes, directed = true) {
  // A simple cycle is Hamiltonian
  return generateCycleGraph(numNodes, directed);
}

export function generateEulerianGraph(numNodes, directed = true) {
  // A cycle is also Eulerian (all vertices even degree or balanced in/out)
  return generateCycleGraph(numNodes, directed);
}

export function generateTournamentGraph(numNodes) {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({ id: i + 1 }));
  const links = [];
  for (let i = 1; i <= numNodes; i++) {
    for (let j = i + 1; j <= numNodes; j++) {
      if (Math.random() < 0.5) links.push({ source: i, target: j });
      else links.push({ source: j, target: i });
    }
  }
  return { nodes, links };
}

/**
 * Generates a random directed graph.
 * @param {number} numNodes
 * @returns {{ nodes: Array<{id:number}>, links: Array<{source:number, target:number}> }}
 */
export function generateDirected(numNodes = 5) {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({ id: i + 1 }));
  const links = [];
  for (let i = 1; i <= numNodes; i++) {
    const t = Math.floor(Math.random() * numNodes) + 1;
    if (i !== t) links.push({ source: i, target: t });
  }
  return { nodes, links };
}

/**
 * Generates a random undirected graph.
 * @param {number} numNodes
 * @returns {{ nodes: Array<{id:number}>, links: Array<{source:number, target:number}> }}
 */
export function generateUndirected(numNodes = 5) {
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
 * Generates a free (unrooted) tree.
 * @param {number} numNodes
 * @returns {{ nodes: Array<{id:number}>, links: Array<{source:number, target:number}> }}
 */
export function generateFreeTree(numNodes = 5) {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({ id: i + 1 }));
  const links = [];
  for (let i = 2; i <= numNodes; i++) {
    const parent = Math.floor(Math.random() * (i - 1)) + 1;
    links.push({ source: parent, target: i });
    links.push({ source: i, target: parent });
  }
  return { nodes, links };
}

/**
 * Generates a rooted tree (directed).
 * @param {number} numNodes
 * @returns {{ nodes: Array<{id:number}>, links: Array<{source:number, target:number}> }}
 */
export function generateRootedTree(numNodes = 5) {
  const nodes = Array.from({ length: numNodes }, (_, i) => ({ id: i + 1 }));
  const links = [];
  for (let i = 2; i <= numNodes; i++) {
    const parent = Math.floor(Math.random() * (i - 1)) + 1;
    links.push({ source: parent, target: i });
  }
  return { nodes, links };
}

/**
 * Adds a node to the graph, updating links accordingly.
 * For a rooted tree, if it's the first node it becomes root; otherwise it's connected under a random parent.
 */
export function addNode(nodes, links, directed = true, isTree = false) {
  // Determine new node id
  const currentMaxId = nodes.reduce((max, n) => Math.max(max, n.id), 0);
  const newId = currentMaxId + 1;
  const newNodes = [...nodes, { id: newId }];
  const newLinks = [...links];

  if (nodes.length === 0) {
    // First node: becomes root of tree or isolated node
  } else if (isTree) {
    // Connect new node under a random existing node as parent
    const parentId = nodes[Math.floor(Math.random() * nodes.length)].id;
    newLinks.push({ source: parentId, target: newId });
  } else if (!directed) {
    // Undirected: connect bidirectionally to a random existing node
    const neighborId = nodes[Math.floor(Math.random() * nodes.length)].id;
    newLinks.push({ source: newId, target: neighborId });
    newLinks.push({ source: neighborId, target: newId });
  } else {
    // Directed: connect from new node to a random existing node
    const neighborId = nodes[Math.floor(Math.random() * nodes.length)].id;
    newLinks.push({ source: newId, target: neighborId });
  }

  return { nodes: newNodes, links: newLinks };
}

/**
 * Removes the last node (highest id) and all connected edges.
 */
export function removeLastNode(nodes, links) {
  if (nodes.length === 0) return { nodes, links };
  const ids = nodes.map(n => n.id);
  const removeId = Math.max(...ids);
  const newNodes = nodes.filter(n => n.id !== removeId);
  const newLinks = links.filter(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source;
    const t = typeof l.target === 'object' ? l.target.id : l.target;
    return s !== removeId && t !== removeId;
  });
  return { nodes: newNodes, links: newLinks };
}
