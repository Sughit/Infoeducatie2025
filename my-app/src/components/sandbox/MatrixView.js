import React from 'react';
export default function MatrixView({ matrix, onChange }) {
  return (
    <table className="w-full table-auto border-collapse text-xs">
      <thead>
        <tr><th></th>{matrix.map((_,j)=><th key={j} className="p-1 border">{j+1}</th>)}</tr>
      </thead>
      <tbody>
        {matrix.map((row,i)=>(<tr key={i}><th className="p-1 border">{i+1}</th>{row.map((val,j)=>(<td key={j} className="p-1 border text-center"><select value={val} onChange={e=>onChange(i,j,Number(e.target.value))} className="w-full text-xs p-0 bg-white"><option value={0}>0</option><option value={1}>1</option></select></td>))}</tr>))}
      </tbody>
    </table>
  );
}