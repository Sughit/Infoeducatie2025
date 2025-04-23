import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function GraphView({ nodes, links }) {
  const graphRef = useRef();
  const containerRef = useRef();
  useEffect(() => {
    const svg = d3.select(graphRef.current);
    if (!nodes.length) { svg.selectAll('*').remove(); return; }
    const { width, height } = containerRef.current.getBoundingClientRect();
    svg.selectAll('*').remove();
    const g = svg.append('g');
    svg.call(d3.zoom().scaleExtent([0.1,10]).on('zoom', e=>g.attr('transform',e.transform)));
    svg.append('rect').attr('width',width).attr('height',height).style('fill','none').style('pointer-events','all').lower();
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d=>d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width/2,height/2));
    const link = g.selectAll('path').data(links).enter().append('path').attr('stroke','#999').attr('fill','none');
    const node = g.selectAll('circle').data(nodes).enter().append('circle').attr('r',8).attr('fill','#007bff')
      .call(d3.drag().on('start',(e,d)=>{if(!e.active)sim.alphaTarget(0.3).restart();d.fx=d.x;d.fy=d.y;}).on('drag',(e,d)=>{d.fx=e.x;d.fy=e.y;}).on('end',(e,d)=>{if(!e.active)sim.alphaTarget(0);d.fx=null;d.fy=null;}));
    const label = g.selectAll('text').data(nodes).enter().append('text').text(d=>d.id).attr('font-size','10px').attr('dy',-12).attr('text-anchor','middle');
    sim.on('tick',()=>{link.attr('d',d=>`M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`);node.attr('cx',d=>d.x).attr('cy',d=>d.y);label.attr('x',d=>d.x).attr('y',d=>d.y);});
  },[nodes,links]);
  return <div ref={containerRef} className="h-96 border rounded overflow-hidden"><svg ref={graphRef} className="w-full h-full"/></div>;
}