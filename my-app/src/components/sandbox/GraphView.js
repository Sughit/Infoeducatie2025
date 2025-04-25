// src/components/GraphView.js
import * as d3 from 'd3';

/**
 * Draws a graph using D3.js without reinitializing zoom on updates.
 */
export function drawGraph(svgElement, nodes, links, isTree = false, directed = true) {
  const svg = d3.select(svgElement);
  if (!nodes || nodes.length === 0) {
    svg.selectAll('*').remove();
    return;
  }
  const container = svg.node().parentNode;
  const { width, height } = container.getBoundingClientRect();

  // Clear only graph content, preserve zoom behavior
  svg.selectAll('g.graph-content').remove();
  let g = svg.select('g.zoom-group');
  if (g.empty()) {
    svg.selectAll('*').remove();
    // Initialize zoom once
    g = svg.append('g').classed('zoom-group', true);
    const zoomBehavior = d3.zoom().scaleExtent([0.1, 10]).on('zoom', e => g.attr('transform', e.transform));
    svg.call(zoomBehavior);
    // background to capture zoom events
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .lower();
    // arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrow').attr('viewBox', '0 0 10 10')
      .attr('refX', 5).attr('refY', 5)
      .attr('markerWidth', 6).attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path').attr('d', 'M0,0 L10,5 L0,10 Z').attr('fill', '#999');
  }

  // Main graph group
  const content = g.append('g').classed('graph-content', true);

  if (!isTree) {
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = content.selectAll('path.link')
      .data(links)
      .enter().append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('marker-mid', directed ? 'url(#arrow)' : null);

    const node = content.selectAll('circle.node')
      .data(nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', 8)
      .attr('fill', '#007bff')
      .call(d3.drag()
        .on('start', (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on('end', (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    const label = content.selectAll('text.label')
      .data(nodes)
      .enter().append('text')
      .attr('class', 'label')
      .text(d => d.id)
      .attr('font-size', '10px')
      .attr('text-anchor', 'middle')
      .attr('dy', -12);

    simulation.on('tick', () => {
      link.attr('d', d => {
        const x1 = d.source.x, y1 = d.source.y;
        const x2 = d.target.x, y2 = d.target.y;
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        return `M${x1},${y1} L${mx},${my} L${x2},${y2}`;
      });
      node.attr('cx', d => d.x).attr('cy', d => d.y);
      label.attr('x', d => d.x).attr('y', d => d.y);
    });
  } else {
    const stratify = d3.stratify().id(d => d.id).parentId(d => d.parentId);
    const data = nodes.map(n => {
      const parentLink = links.find(l => l.target === n.id);
      return { id: n.id.toString(), parentId: n.id === 1 ? null : (parentLink ? parentLink.source.toString() : null) };
    });
    const root = stratify(data);
    const treeLayout = d3.tree().size([width, height]);
    treeLayout(root);

    content.selectAll('path.link')
      .data(root.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr('d', d3.linkVertical().x(d => d.x).y(d => d.y));

    content.selectAll('circle.node')
      .data(root.descendants())
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', d => (d.data.id === '1' ? 12 : 8))
      .attr('fill', d => (d.data.id === '1' ? 'orange' : '#007bff'))
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    content.selectAll('text.label')
      .data(root.descendants())
      .enter().append('text')
      .attr('class', 'label')
      .text(d => d.data.id)
      .attr('font-size', '10px')
      .attr('text-anchor', 'middle')
      .attr('x', d => d.x)
      .attr('y', d => d.y - (d.data.id === '1' ? 16 : 12));
  }
}
