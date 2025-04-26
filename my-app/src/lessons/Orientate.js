import React from 'react';

export default function Orientate() {
  return (
    <div className="max-w-6xl mx-auto p-8 text-dark-blue">
      <h1 className="text-4xl font-extrabold mb-8">Grafuri Orientate</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Termeni de Bază</h2>
        <p className="mb-4">
          În grafurile orientate, legăturile dintre vârfuri au direcție și se numesc <strong>arce</strong>. Fiecare arc indică un sens de parcurgere de la un vârf sursă la unul destinație.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Vârf (nod):</strong> element fundamental al grafului.</li>
          <li><strong>Arc:</strong> legătură direcționată de la un vârf către altul, notată (u → v).</li>
          <li><strong>Grad de intrare gr⁻(v):</strong> numărul de arce care ajung în vârful v.</li>
          <li><strong>Grad de ieșire gr⁺(v):</strong> numărul de arce care pornesc din vârful v.</li>
          <li><strong>Lanț orientat:</strong> o succesiune de arce consecutive, respectând sensurile.</li>
          <li><strong>Drum orientat:</strong> un lanț orientat fără repetarea vârfurilor.</li>
          <li><strong>Ciclu orientat:</strong> un drum orientat care începe și se termină în același vârf.</li>
          <li><strong>Componente tare conexe:</strong> subgrafuri în care fiecare vârf este accesibil din orice alt vârf.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Metode de Reprezentare</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Matricea de adiacență:</strong> a[i][j] = 1 dacă există arc de la i la j, altfel 0.</li>
          <li><strong>Lista de adiacență:</strong> fiecare vârf are asociată lista de vârfuri spre care există arce directe.</li>
          <li><strong>Lista de arce:</strong> fiecare arc este reprezentat ca o pereche (u, v).</li>
          <li><strong>Matricea drumurilor (Warshall/Roy-Warshall):</strong> indică dacă există un drum (direct sau indirect) între două vârfuri.</li>
          <li><strong>Matricea costurilor (Floyd-Warshall):</strong> păstrează costul minim de parcurgere între vârfuri, folosind ponderi.</li>
          <li><strong>Lista ponderată de adiacență:</strong> extensia listei de adiacență pentru grafuri cu costuri.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Tipuri de Grafuri Orientate</h2>
        <ul className="list-disc list-inside space-y-4">
          <li><strong>Graf tare conex:</strong> există drum orientat între orice două vârfuri. Graful este indivizibil în componente mai mici după drumurile orientate.</li>
          <li><strong>Graf turneu:</strong> graf orientat complet în care, între oricare două vârfuri distincte, există exact un arc (fie de la primul la al doilea, fie invers).</li>
          <li><strong>Graf plin:</strong> fiecare pereche de vârfuri distincte este conectată prin arce în ambele direcții.</li>
          <li><strong>Transpusul unui graf:</strong> graful obținut prin inversarea sensului fiecărui arc existent.</li>
          <li><strong>Graf complet orientat:</strong> între oricare două vârfuri există exact un singur arc (nu există reciprocitate).</li>
          <li><strong>Graf antisimetric:</strong> dacă (u → v) există, atunci (v → u) nu există.</li>
          <li><strong>Graf ponderat:</strong> fiecare arc are asociat un cost sau o distanță.</li>
          <li><strong>Graf hamiltonian:</strong> există un drum orientat care vizitează fiecare vârf exact o dată.</li>
          <li><strong>Graf eulerian:</strong> există un ciclu care parcurge fiecare arc exact o dată, respectând direcțiile.</li>
          <li><strong>Vârf central:</strong> un vârf din care există drum orientat către orice alt vârf.</li>
          <li><strong>Arc inutil:</strong> un arc care poate fi eliminat fără a distruge proprietatea de accesibilitate.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Algoritmi Importanți</h2>
        <ul className="list-disc list-inside space-y-4">
          <li><strong>Algoritmul lui Dijkstra:</strong> calculează cel mai scurt drum de la o sursă către toate celelalte vârfuri într-un graf ponderat cu ponderi pozitive. Complexitate: O((n + m) log n) cu heap.</li>
          <li><strong>Algoritmul lui Roy-Warshall:</strong> determină matricea drumurilor pentru grafuri orientate. Dacă există o secvență de arce între i și j, matricea va avea 1 în poziția (i,j).</li>
          <li><strong>Algoritmul Floyd-Warshall:</strong> generalizare a Roy-Warshall pentru grafuri ponderate. Calculează toate drumurile de cost minim între toate perechile de vârfuri. Complexitate: O(n³).</li>
          <li><strong>DFS (parcurgere în adâncime):</strong> esențial pentru detectarea componentelor tare conexe, a ciclurilor și pentru ordonarea topologică.</li>
          <li><strong>BFS (parcurgere în lățime):</strong> util pentru determinarea drumurilor minime în grafuri neponderate.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Formule și Proprietăți Esențiale</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>∑gr⁺(v) = ∑gr⁻(v) = m</strong>, unde m este numărul total de arce.</li>
          <li><strong>Număr maxim de arce într-un graf orientat simplu:</strong> n(n-1).</li>
          <li><strong>Număr maxim de arce într-un graf plin:</strong> 2 × C(n,2) = n(n-1).</li>
          <li><strong>Dacă un graf orientat are toate vârfurile cu gr⁺(v) = gr⁻(v),</strong> atunci poate admite ciclu eulerian.</li>
          <li><strong>Numărul de drumuri între două vârfuri:</strong> poate fi calculat ridicând matricea de adiacență la diverse puteri.</li>
          <li><strong>Număr de grafuri orientate posibile cu n vârfuri:</strong> 2^(n(n-1)).</li>
        </ul>
      </section>

    </div>
  );
}
