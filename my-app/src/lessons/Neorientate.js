// src/lessons/Neorientate.js
import React from 'react';
import { Card, CardContent } from '../components/ui/Card';

export default function Neorientate() {
  return (
    <div className="max-w-6xl mx-auto p-8 text-dark-blue space-y-8">
      <header className="flex items-center space-x-4">
        <h1 className="text-4xl font-extrabold">Grafuri Neorientate</h1>
      </header>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Termeni de Bază</h2>
          <p>
            În grafurile neorientate, relațiile dintre noduri sunt bidirecționale: muchia {`{u, v}`} conectează în ambele sensuri. 
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Vârf (nod):</strong> element fundamental.</li>
            <li><strong>Muchie:</strong> legătură bidirecțională între două vârfuri.</li>
            <li><strong>Gradul gr(v):</strong> numărul de muchii incidente unui vârf.</li>
            <li><strong>Lanț:</strong> succesiune de vârfuri adiacente.</li>
            <li><strong>Drum:</strong> lanț fără repetarea muchiilor sau vârfurilor.</li>
            <li><strong>Ciclu:</strong> drum care începe și se termină în același vârf.</li>
            <li><strong>Graf conex:</strong> există un drum între oricare două vârfuri.</li>
            <li><strong>Componentă conexă:</strong> subgraf conex maximal.</li>
            <li><strong>Graf neconex:</strong> format din mai multe componente conexe. </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Metode de Reprezentare</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Matrice de adiacență:</strong> matrice pătratică cu 1/0; bună pentru grafuri dense. </li>
            <li><strong>Listă de adiacență:</strong> pentru fiecare vârf, lista vecinilor. </li>
            <li><strong>Listă de muchii:</strong> vector de perechi (u, v). </li>
            <li><strong>Matrice de incidență:</strong> coloană per muchie, 1 indică incidența. </li>
            <li><strong>Vectori de adiacență:</strong> implementare optimizată a listelor. </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Proprietăți Generale</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>∑gr(v) = 2·m, unde m = număr muchii. </li>
            <li>Număr maxim de muchii: n(n−1)/2.</li>
            <li>Număr minim de muchii într-un graf conex: n − 1.</li>
            <li>Există cel puţin două vârfuri de grad 1 dacă n ≥ 2.</li>
            <li>Un graf fără cicluri și conex e un arbore. </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Tipuri de Grafuri Neorientate</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Graf complet (K<sub>n</sub>):</strong> m = n(n−1)/2.</li>
            <li><strong>Graf complementar</strong> – muchiile care lipsesc.</li>
            <li><strong>Subgraf</strong> – selectare de noduri și muchii.</li>
            <li><strong>Graf regulat</strong> – toate nodurile au același grad.</li>
            <li><strong>Graf bipartit (K<sub>m,n</sub>)</strong> – două mulțimi cu muchii doar între ele. </li>
            <li><strong>Graf hamiltonian</strong> – ciclu care vizitează fiecare vârf o singură dată.</li>
            <li><strong>Graf eulerian</strong> – toate vârfurile au grad par și e conex. </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Parcurgerea Grafurilor</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>BFS:</strong> vizită nivel cu nivel cu coadă. </li>
            <li><strong>DFS:</strong> vizită adâncime-first cu stivă recursivă. </li>
            <li><strong>Identificarea componentelor conexe:</strong> BFS/DFS succesive.</li>
            <li><strong>Detecția ciclurilor:</strong> DFS cu flag de părinte. </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
