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
        <h2 className="text-3xl font-bold mb-4">Algoritmi Importanți</h2>
        <ul className="list-disc list-inside space-y-8">
          <li>
            <strong>Algoritmul lui Dijkstra:</strong> calculează cel mai scurt drum de la o sursă către toate celelalte vârfuri într-un graf ponderat cu ponderi pozitive. Complexitate: O((n + m) log n) cu heap.
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto text-sm">
{`function dijkstra(graph, source) {
  const dist = Array(graph.length).fill(Infinity);
  dist[source] = 0;
  const pq = new MinHeap();
  pq.insert([0, source]);

  while (!pq.isEmpty()) {
    const [currentDist, u] = pq.extractMin();
    if (currentDist > dist[u]) continue;

    for (const [v, weight] of graph[u]) {
      const alt = dist[u] + weight;
      if (alt < dist[v]) {
        dist[v] = alt;
        pq.insert([alt, v]);
      }
    }
  }
  return dist;
}`}
            </pre>
          </li>

          <li>
            <strong>Algoritmul lui Roy-Warshall:</strong> determină matricea drumurilor pentru grafuri orientate.
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto text-sm">
{`function royWarshall(adj) {
  const n = adj.length;
  const reach = adj.map(row => [...row]);

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        reach[i][j] = reach[i][j] || (reach[i][k] && reach[k][j]);
      }
    }
  }
  return reach;
}`}
            </pre>
          </li>

          <li>
            <strong>Algoritmul Floyd-Warshall:</strong> calculează toate drumurile de cost minim între toate perechile de vârfuri.
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto text-sm">
{`function floydWarshall(cost) {
  const n = cost.length;
  const dist = cost.map(row => row.map(x => x));

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  return dist;
}`}
            </pre>
          </li>

          <li>
            <strong>DFS (parcurgere în adâncime):</strong> folosit pentru componente tare conexe, detectare cicluri, ordonare topologică.
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto text-sm">
{`function dfs(graph, v, visited) {
  visited[v] = true;
  for (const u of graph[v]) {
    if (!visited[u]) dfs(graph, u, visited);
  }
}`}
            </pre>
          </li>

          <li>
            <strong>BFS (parcurgere în lățime):</strong> util pentru drumuri minime în grafuri neponderate.
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto text-sm">
{`function bfs(graph, start) {
  const queue = [start];
  const visited = Array(graph.length).fill(false);
  visited[start] = true;

  while (queue.length > 0) {
    const v = queue.shift();
    for (const u of graph[v]) {
      if (!visited[u]) {
        visited[u] = true;
        queue.push(u);
      }
    }
  }
}`}
            </pre>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Tipuri de Grafuri Orientate</h2>
        <ul className="list-disc list-inside space-y-8">
          <li>
            <strong>Graf tare conex:</strong> există drum orientat între orice două vârfuri.
            <br />
            <img src="/orientate/graf_tare_conex.png" alt="Graf tare conex" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
          </li>

          <li>
            <strong>Graf turneu:</strong> graf orientat complet cu un arc între fiecare pereche.
            <br />
            <img src="/orientate/graf_turneu.png" alt="Graf turneu" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
          </li>

          <li>
            <strong>Graf complet orientat:</strong> un arc între fiecare pereche, fără reciprocitate.
            <br />
            <img src="/orientate/graf_complet.png" alt="Graf complet orientat" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
          </li>

          <li>
            <strong>Graf ponderat:</strong> fiecare arc are un cost.
            <br />
            <img src="/orientate/graf_ponderat.png" alt="Graf ponderat" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
          </li>

          <li>
            <strong>Graf hamiltonian:</strong> există un drum care vizitează fiecare vârf o singură dată.
            <br />
            <img src="/orientate/graf_hamiltonian.png" alt="Graf hamiltonian" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
          </li>

          <li>
            <strong>Graf eulerian:</strong> există un ciclu care parcurge fiecare arc o singură dată.
            <br />
            <img src="/orientate/graf_eulerian.png" alt="Graf eulerian" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
          </li>

          <li>
            <strong>Vârf central:</strong> vârf cu drum către orice altul.
            <img src="/orientate/graf_varf_central.png" alt="Vârf Central" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
          </li>
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
