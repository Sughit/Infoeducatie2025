export function generateGraph(type) {
    if (type === 'directed') return generateDirected();
    if (type === 'undirected') return generateUndirected();
    if (type === 'freeTree') return generateFreeTree();
    if (type === 'rootedTree') return generateRootedTree();
    return { nodes: [], links: [], directed: true, isTree: false };
  }
  
  function generateDirected() {
    const num = Math.min(Math.floor(Math.random() * 10) + 5, 10);
    const nodes = Array.from({ length: num }, (_, i) => ({ id: i + 1 }));
    const links = [];
    for (let i = 1; i <= num; i++) {
      const t = Math.floor(Math.random() * num) + 1;
      if (i !== t) links.push({ source: i, target: t });
    }
    return { nodes, links, directed: true, isTree: false };
  }
  
  function generateUndirected() {
    const num = Math.min(Math.floor(Math.random() * 10) + 5, 10);
    const nodes = Array.from({ length: num }, (_, i) => ({ id: i + 1 }));
    const links = [];
    for (let i = 1; i <= num; i++) {
      for (let j = i + 1; j <= num; j++) {
        if (Math.random() < 0.3) {
          links.push({ source: i, target: j });
          links.push({ source: j, target: i });
        }
      }
    }
    return { nodes, links, directed: false, isTree: false };
  }
  
  function generateFreeTree() {
    const num = Math.min(Math.floor(Math.random() * 10) + 5, 10);
    const nodes = Array.from({ length: num }, (_, i) => ({ id: i + 1 }));
    const links = [];
    for (let i = 2; i <= num; i++) {
      const p = Math.floor(Math.random() * (i - 1)) + 1;
      links.push({ source: p, target: i }, { source: i, target: p });
    }
    return { nodes, links, directed: false, isTree: false };
  }
  
  function generateRootedTree() {
    const num = Math.min(Math.floor(Math.random() * 10) + 5, 10);
    const nodes = Array.from({ length: num }, (_, i) => ({ id: i + 1 }));
    const links = [];
    for (let i = 2; i <= num; i++) {
      const p = Math.floor(Math.random() * (i - 1)) + 1;
      links.push({ source: p, target: i });
    }
    return { nodes, links, directed: true, isTree: true };
  }
  
  export function addNodeLogic({ nodes, links, directed, isTree }) {
    const newId = nodes.length + 1;
    const ns = [...nodes, { id: newId }];
    let ls = [...links];
    if (isTree) {
      const p = Math.floor(Math.random() * (newId - 1)) + 1;
      ls.push({ source: p, target: newId });
    } else if (!directed) {
      const n = Math.floor(Math.random() * (newId - 1)) + 1;
      ls.push({ source: newId, target: n }, { source: n, target: newId });
    } else {
      const n = Math.floor(Math.random() * (newId - 1)) + 1;
      if (n !== newId) ls.push({ source: newId, target: n });
    }
    return { nodes: ns, links: ls, directed, isTree };
  }
  
  export function removeNodeLogic({ nodes, links, directed, isTree }) {
    if (!nodes.length) return { nodes, links, directed, isTree };
    const id = nodes.length;
    const ns = nodes.slice(0, -1);
    const ls = links.filter(l => l.source !== id && l.target !== id);
    return { nodes: ns, links: ls, directed, isTree };
  }
  
  export function generateAdjacencyMatrix(n, links) {
    const m = Array.from({ length: n }, () => Array(n).fill(0));
    links.forEach(l => { m[l.source - 1][l.target - 1] = 1; });
    return m;
  }
  
  export function updateMatrixLogic(prev) {
    return prev.slice(0, -1).map(row => row.slice(0, -1));
  }
  
  export function handleMatrixEditLogic(matrix, { nodes }) {
    const ls = [];
    matrix.forEach((row, i) => row.forEach((v, j) => { if (v) ls.push({ source: i + 1, target: j + 1 }); }));
    return ls;
  }