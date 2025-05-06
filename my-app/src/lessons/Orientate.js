// src/lessons/Orientate.js
import React from 'react';
import { Card, CardContent } from '../components/ui/Card';

export default function Orientate() {
  return (
    <div className="max-w-6xl mx-auto p-8 text-dark-blue space-y-8">
      <header className="flex items-center space-x-4">
        <h1 className="text-4xl font-extrabold">Grafuri Orientate</h1>
      </header>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Termeni de Bază</h2>
          <p>
            În grafurile orientate, muchiile au direcţie (u → v). Gradul intern şi extern sunt notate gr⁻(v)/gr⁺(v). 
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Vârf:</strong> nod. </li>
            <li><strong>Arc:</strong> (u → v).</li>
            <li><strong>Grad intrare:</strong> număr de arce spre v.</li>
            <li><strong>Grad ieșire:</strong> număr de arce din v.</li>
            <li><strong>Lanț/Drum orientat:</strong> succesiune de arce fără repetare de vârf.</li>
            <li><strong>Ciclu orientat:</strong> drum închis. </li>
            <li><strong>Componente tare conexe:</strong> acces reciproc prin drumuri.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Metode de Reprezentare</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Matrice de adiacență:</strong> a[i][j] = 1 dacă există arc i→j. </li>
            <li><strong>Listă de adiacență:</strong> vecinii fiecărui nod. </li>
            <li><strong>Listă de arce:</strong> vector de perechi (u, v). </li>
            <li><strong>Matrice drumuri (Warshall):</strong> indică accesibilitatea. </li>
            <li><strong>Matrice costuri (Floyd–Warshall):</strong> cost minim între toate perechile. </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Tipuri de Grafuri Orientate</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Graf tare conex:</strong> drum orientat între orice două noduri. </li>
            <li><strong>Graf turneu:</strong> complet orientat unică direcţie. </li>
            <li><strong>Graf plin:</strong> arce în ambele sensuri pe fiecare pereche.</li>
            <li><strong>Transpus:</strong> inversează toate arcele.</li>
            <li><strong>Graf complet orientat:</strong> exact un arc între fiecare pereche. </li>
            <li><strong>Graf antisimetric:</strong> dacă u→v există, atunci v→u nu există.</li>
            <li><strong>Graf ponderat:</strong> cost asociat fiecărui arc.</li>
            <li><strong>Graf hamiltonian:</strong> drum orientat care vizitează fiecare nod. </li>
            <li><strong>Graf eulerian:</strong> ciclu care trece o singură dată prin fiecare arc. </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Algoritmi Importanți</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Dijkstra:</strong> drumuri minime cu ponderi pozitive. </li>
            <li><strong>Roy–Warshall:</strong> matrice drumuri. </li>
            <li><strong>Floyd–Warshall:</strong> cost minim între toate perechile. </li>
            <li><strong>Kosaraju/Tarjan:</strong> componente tare conexe prin DFS. </li>
            <li><strong>Topological Sort:</strong> ordine în DAG cu BFS/DFS. </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
