import React from 'react';

export default function Neorientate() {
  return (
    <div className="max-w-6xl mx-auto p-8 text-dark-blue">
      <h1 className="text-4xl font-extrabold mb-8">Grafuri Neorientate</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Termeni de Bază</h2>
        <p className="mb-4">
          În grafurile neorientate, relațiile dintre noduri (vârfuri) sunt mutuale: dacă există o muchie între A și B, atunci și B este conectat la A.
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Vârf (nod):</strong> un element fundamental din graf, reprezentând un obiect sau un punct.</li>
          <li><strong>Muchie:</strong> legătura bidirecțională dintre două vârfuri.</li>
          <li><strong>Gradul unui vârf:</strong> numărul de muchii incidente la acel vârf, notat gr(v).</li>
          <li><strong>Lanț:</strong> o succesiune de vârfuri adiacente prin muchii.</li>
          <li><strong>Drum:</strong> un lanț fără repetarea muchiilor sau vârfurilor (cu excepția cazurilor specifice de cicluri).</li>
          <li><strong>Ciclu:</strong> un drum care începe și se termină în același vârf.</li>
          <li><strong>Componentă conexă:</strong> o submulțime de vârfuri astfel încât orice două vârfuri sunt conectate printr-un drum.</li>
          <li><strong>Graf conex:</strong> un graf care are o singură componentă conexă.</li>
          <li><strong>Graf neconex:</strong> un graf format din mai multe componente conexe separate.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Metode de Reprezentare</h2>
        <ul className="list-disc list-inside space-y-6">
          <li>
            <strong>Matricea de adiacență:</strong> matrice pătratică unde poziția (i, j) conține 1 dacă există muchie între vârfurile i și j, altfel 0. Eficientă pentru grafuri dense.
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-x-auto"><code>{`
#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    int matrice[1000][1000] = {0};
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        matrice[u][v] = 1;
        matrice[v][u] = 1; // pentru graf neorientat
    }
    return 0;
}
            `}</code></pre>
          </li>

          <li>
            <strong>Lista de adiacență:</strong> pentru fiecare vârf, o listă a vârfurilor la care este conectat. Folosită mai ales pentru grafuri rare.
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-x-auto"><code>{`
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<int> listaAdiacenta[1000];
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        listaAdiacenta[u].push_back(v);
        listaAdiacenta[v].push_back(u); // graf neorientat
    }
    return 0;
}
            `}</code></pre>
          </li>

          <li>
            <strong>Lista de muchii:</strong> fiecare muchie este o pereche de vârfuri (u, v). Ideală pentru algoritmi care procesează direct muchiile.
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-x-auto"><code>{`
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    vector<pair<int,int>> muchii;
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        muchii.push_back({u, v});
    }
    return 0;
}
            `}</code></pre>
          </li>

          <li>
            <strong>Matricea de incidență:</strong> matrice cu n rânduri (vârfuri) și m coloane (muchii). 1 indică incidenta unui vârf la o muchie.
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-x-auto"><code>{`
#include <iostream>
using namespace std;

int main() {
    int n, m;
    cin >> n >> m;
    int matriceIncidente[1000][1000] = {0};
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        matriceIncidente[u][i] = 1;
        matriceIncidente[v][i] = 1;
    }
    return 0;
}
            `}</code></pre>
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Parcurgerea Grafurilor (BFS & DFS)</h2>
        <p className="mb-4">
          Parcurgerile BFS și DFS sunt tehnici esențiale pentru explorarea grafurilor. Pot fi folosite pentru a verifica conexitatea, a detecta cicluri și a identifica componente conexe.
        </p>

        <h3 className="text-2xl font-semibold mb-2">BFS (Breadth-First Search)</h3>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto"><code>{`
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

vector<int> listaAdiacenta[1000];
bool vizitat[1000];

void BFS(int start) {
    queue<int> q;
    q.push(start);
    vizitat[start] = true;

    while (!q.empty()) {
        int nod = q.front();
        q.pop();
        cout << nod << " ";

        for (auto vecin : listaAdiacenta[nod]) {
            if (!vizitat[vecin]) {
                vizitat[vecin] = true;
                q.push(vecin);
            }
        }
    }
}
int main() {
    int n, m; cin >> n >> m;
    for (int i=0; i<m; i++) {
        int u,v; cin >> u >> v;
        listaAdiacenta[u].push_back(v);
        listaAdiacenta[v].push_back(u);
    }
    BFS(0); // exemplu pornire din nodul 0
    return 0;
}
        `}</code></pre>

        <h3 className="text-2xl font-semibold mb-2">DFS (Depth-First Search)</h3>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto"><code>{`
#include <iostream>
#include <vector>
using namespace std;

vector<int> listaAdiacenta[1000];
bool vizitat[1000];

void DFS(int nod) {
    vizitat[nod] = true;
    cout << nod << " ";
    for (auto vecin : listaAdiacenta[nod]) {
        if (!vizitat[vecin]) {
            DFS(vecin);
        }
    }
}

int main() {
    int n, m; cin >> n >> m;
    for (int i=0; i<m; i++) {
        int u,v; cin >> u >> v;
        listaAdiacenta[u].push_back(v);
        listaAdiacenta[v].push_back(u);
    }
    DFS(0); // exemplu pornire din nodul 0
    return 0;
}
        `}</code></pre>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Detectarea Ciclurilor în Grafuri Neorientate</h2>
        <p>
          Pentru a detecta ciclurile folosind DFS, verificăm dacă un nod vecin este deja vizitat și nu este părinte în arborele de parcurgere.
        </p>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto"><code>{`
#include <iostream>
#include <vector>
using namespace std;

vector<int> listaAdiacenta[1000];
bool vizitat[1000];

bool DFS(int nod, int parinte) {
    vizitat[nod] = true;
    for (auto vecin : listaAdiacenta[nod]) {
        if (!vizitat[vecin]) {
            if (DFS(vecin, nod)) return true;
        } else if (vecin != parinte) {
            return true; // ciclu detectat
        }
    }
    return false;
}

int main() {
    int n, m; cin >> n >> m;
    for (int i=0; i<m; i++) {
        int u,v; cin >> u >> v;
        listaAdiacenta[u].push_back(v);
        listaAdiacenta[v].push_back(u);
    }

    bool areCiclu = false;
    for (int i=0; i<n; i++) {
        if (!vizitat[i]) {
            if (DFS(i, -1)) {
                areCiclu = true;
                break;
            }
        }
    }

    if (areCiclu) cout << "Graful contine cicluri\n";
    else cout << "Graful este fara cicluri\n";

    return 0;
}
        `}</code></pre>
      </section>

      <section className="mb-12">
  <h2 className="text-3xl font-bold mb-4">Tipuri de Grafuri Neorientate</h2>
  <ul className="list-disc list-inside space-y-8">
    <li>
      <strong>Graf complet (K<sub>n</sub>):</strong> fiecare vârf este conectat direct la toate celelalte vârfuri. Număr de muchii: <strong>n(n-1)/2</strong>.
      <br />
      <img src="/neorientate/graf_complet.png" alt="Graf complet" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
    </li>
    <li>
      <strong>Graf parțial:</strong> un subgraf care conține doar o parte dintre muchiile și vârfurile grafului original.
      <br />
      <img src="/neorientate/graf_partial.png" alt="Graf parțial" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
    </li>
    <li>
      <strong>Graf regulat:</strong> toate vârfurile au același grad. Un graf în care fiecare vârf are grad 3 se numește 3-regulat.
      <br />
      <img src="/neorientate/graf_regulat.png" alt="Graf regulat" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
    </li>
    <li>
      <strong>Subgraf:</strong> un graf obținut prin eliminarea unora dintre vârfurile și/sau muchiile unui graf inițial.
      <br />
      <img src="/neorientate/graf_subgraf.png" alt="Subgraf" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
    </li>
    <li>
      <strong>Graf hamiltonian:</strong> un graf care conține un ciclu ce vizitează fiecare vârf exact o dată.
      <br />
      <img src="/neorientate/graf_hamiltonian.png" alt="Graf hamiltonian" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
    </li>
    <li>
      <strong>Graf eulerian:</strong> un graf care conține un ciclu care trece o dată prin fiecare muchie.
      <br />
      <img src="/neorientate/graf_eulerian.png" alt="Graf eulerian" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
    </li>
    <li>
      <strong>Graf conex:</strong> există cel puțin un drum între oricare două vârfuri.
      <br />
      <img src="/neorientate/graf_conex.png" alt="Graf conex" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
    </li>
    <li>
      <strong>Graf neconex:</strong> nu toate vârfurile sunt conectate între ele; există cel puțin două componente conexe.
      <br />
      <img src="/neorientate/graf_neconex.png" alt="Graf neconex" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
    </li>
  </ul>
</section>

      <section>
        <h2 className="text-3xl font-bold mb-4">Formule Importante</h2>
        <ul className="list-disc list-inside space-y-3">
          <li><strong>Numărul maxim de muchii într-un graf neorientat simplu cu n vârfuri:</strong> <code>m ≤ n(n-1)/2</code></li>
          <li><strong>Suma gradelor tuturor vârfurilor:</strong> <code>Σ gr(v) = 2m</code>, unde m este numărul total de muchii.</li>
          <li><strong>Numărul de muchii într-un graf complet K<sub>n</sub>:</strong> <code>m = n(n-1)/2</code></li>
          <li><strong>Numărul de muchii într-un graf regulat de grad r cu n vârfuri:</strong> <code>m = (n * r) / 2</code></li>
          <li><strong>În grafuri conexe:</strong> numărul minim de muchii este <code>n-1</code> (copac).</li>
          <li><strong>Relația pentru graf planar (conform formulei lui Euler):</strong> <code>n - m + f = 2</code>, unde f este numărul de fețe (regiuni) în reprezentarea planar.</li>
          <li><strong>Numărul maxim de muchii într-un graf planar simplu:</strong> <code>m ≤ 3n - 6</code> pentru <code>n ≥ 3</code></li>
        </ul>
      </section>
    </div>
  );
}
