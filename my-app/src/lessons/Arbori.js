import React from 'react';

export default function Arbori() {
  return (
    <div className="max-w-6xl mx-auto p-8 text-dark-blue">
      <h1 className="text-4xl font-extrabold mb-8">Arbori</h1>

      {/* Definiție */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Definiție</h2>
        <p className="mb-4">
          Un arbore este un graf conex și aciclic. Cu alte cuvinte, între orice două vârfuri există exact un singur lanț, iar arborele nu conține cicluri.
        </p>
      </section>

      {/* Termeni Importanți */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Termeni Importanți</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Rădăcină:</strong> vârful desemnat ca punct de început într-un arbore orientat.</li>
          <li><strong>Frunză:</strong> vârf cu grad gr = 1 (altfel decât rădăcina, dacă există).</li>
          <li><strong>Părinte:</strong> pentru un vârf v, părintele său este vârful imediat anterior în drumul către rădăcină.</li>
          <li><strong>Fiu:</strong> vârf direct conectat către un alt vârf considerat părinte.</li>
          <li><strong>Lanț elementar:</strong> drum în arbore între două vârfuri, fără repetări de vârfuri.</li>
          <li><strong>Nivelul unui vârf:</strong> distanța (număr de muchii) de la rădăcină până la acel vârf.</li>
          <li><strong>Înălțimea arborelui:</strong> nivelul maxim întâlnit între vârfuri.</li>
          <li><strong>Descendenți:</strong> toate vârfurile ce pot fi atinse coborând de la un vârf dat.</li>
          <li><strong>Pădure de arbori:</strong> o colecție de arbori disjuncți (fără muchii între ei).</li>
          <li><strong>Mișcarea rădăcinii:</strong> alegerea unui alt vârf drept rădăcină, modificând direcția arcelor pentru a păstra structura de arbore.</li>
          <li><strong>Arbori identici:</strong> doi arbori sunt identici dacă au aceleași vârfuri, aceleași legături și aceleași relații părinte-fiu.</li>
        </ul>
      </section>

      {/* Reprezentare */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Metode de Reprezentare</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Lista de adiacență:</strong> fiecare vârf are lista copiilor săi.</li>
          <li><strong>Vectorul de părinți:</strong> pentru fiecare vârf, se reține cine este părintele său.</li>
          <li><strong>Matricea de adiacență:</strong> folosită rar pentru arbori din cauza redundanței (multe valori 0).</li>
          <li><strong>Vector de niveluri:</strong> pentru fiecare vârf se stochează nivelul său în arbore.</li>
        </ul>
      </section>

      {/* Proprietăți */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Proprietăți ale Arborilor</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Un arbore cu n vârfuri are exact n-1 muchii.</li>
          <li>Între oricare două vârfuri există exact un lanț elementar unic.</li>
          <li>Un arbore nu are cicluri.</li>
          <li>Orice arbore este un graf conex și minim: eliminarea oricărei muchii îl face deconex.</li>
          <li>Un arbore cu n vârfuri are cel puțin două frunze.</li>
        </ul>
      </section>

      {/* Algoritmi */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Algoritmi Importanți</h2>
        <ul className="list-disc list-inside space-y-8">
          <li>
            <strong>Algoritmul lui Kruskal:</strong>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-x-auto"><code>{`
void initDSU() {
  for (int i = 0; i < n; i++) {
    parinte[i] = i;
    rang[i] = 0;
  }
}

int gasesteRadacina(int nod) {
  if (parinte[nod] == nod) return nod;
  return parinte[nod] = gasesteRadacina(parinte[nod]);
}

bool uneste(int a, int b) {
  a = gasesteRadacina(a);
  b = gasesteRadacina(b);
  if (a == b) return false;
  if (rang[a] < rang[b]) swap(a, b);
  parinte[b] = a;
  if (rang[a] == rang[b]) rang[a]++;
  return true;
}

void sortareMuchii() {
  for (int i = 0; i < m - 1; i++) {
    for (int j = 0; j < m - i - 1; j++) {
      if (muchii[j].cost > muchii[j+1].cost) {
        Muchie temp = muchii[j];
        muchii[j] = muchii[j+1];
        muchii[j+1] = temp;
      }
    }
  }
}

int kruskal() {
  sortareMuchii();
  initDSU();
  int costTotal = 0;
  for (int i = 0; i < m; i++) {
    if (uneste(muchii[i].u, muchii[i].v)) {
      costTotal += muchii[i].cost;
    }
  }
  return costTotal;
}
`}</code></pre>
          </li>

          <li>
            <strong>Algoritmul lui Prim:</strong>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-x-auto"><code>{`
int prim() {
  for (int i = 0; i < n; i++) {
    dist[i] = INF;
    vizitat[i] = false;
  }
  dist[0] = 0;
  int costTotal = 0;

  for (int i = 0; i < n; i++) {
    int nodMin = -1;
    int distMin = INF;
    for (int j = 0; j < n; j++) {
      if (!vizitat[j] && dist[j] < distMin) {
        distMin = dist[j];
        nodMin = j;
      }
    }
    vizitat[nodMin] = true;
    costTotal += distMin;

    for (int j = 0; j < n; j++) {
      if (!vizitat[j] && listaAdiacenta[nodMin][j] != 0 && listaAdiacenta[nodMin][j] < dist[j]) {
        dist[j] = listaAdiacenta[nodMin][j];
      }
    }
  }
  return costTotal;
}
`}</code></pre>
          </li>

          <li>
            <strong>Parcurgere DFS:</strong>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-x-auto"><code>{`
void dfs(int nodCurent, int parinte) {
  for (int i = 0; i < grad[nodCurent]; i++) {
    int vecin = listaAdiacenta[nodCurent][i];
    if (vecin != parinte) {
      parinti[vecin] = nodCurent;
      niveluri[vecin] = niveluri[nodCurent] + 1;
      dfs(vecin, nodCurent);
    }
  }
}
`}</code></pre>
          </li>

          <li>
            <strong>Parcurgere BFS:</strong>
            <pre className="bg-gray-100 p-4 rounded mt-2 overflow-x-auto"><code>{`
void bfs(int radacina) {
  int coada[MAXN];
  int start = 0, end = 0;

  for (int i = 0; i < n; i++) niveluri[i] = -1;

  coada[end++] = radacina;
  niveluri[radacina] = 0;

  while (start < end) {
    int nodCurent = coada[start++];
    for (int i = 0; i < grad[nodCurent]; i++) {
      int vecin = listaAdiacenta[nodCurent][i];
      if (niveluri[vecin] == -1) {
        niveluri[vecin] = niveluri[nodCurent] + 1;
        coada[end++] = vecin;
      }
    }
  }
}
`}</code></pre>
          </li>
        </ul>
      </section>

      {/* Formule */}
      <section className="mb-12">
  <h2 className="text-3xl font-bold mb-4">Formule și Relații</h2>
  <ul className="list-disc list-inside space-y-2">
    <li>Numărul muchiilor în arbore cu n vârfuri: <code>m = n - 1</code></li>
    <li>Numărul de arbori posibili cu n vârfuri (Cayley): <code>n^(n-2)</code></li>
    <li>Înălțimea arborelui este nivelul maxim: <code>h = max niveluri</code></li>
    <li>Gradul unui nod: numărul de fii ai săi</li>
    <li>Numărul maxim de noduri într-un arbore binar perfect de înălțime h: <code>2^(h+1) - 1</code></li>
    <li>Numărul maxim de noduri într-un arbore binar complet de înălțime h: <code>2^(h+1) - 1</code> (ultimul nivel poate fi parțial umplut)</li>
    <li>Numărul minim de noduri într-un arbore binar echilibrat AVL de înălțime h: <code>N(h) = N(h-1) + N(h-2) + 1</code>, unde <code>N(0) = 1</code>, <code>N(1) = 2</code></li>
    <li>Numărul total de noduri în arborele binar de căutare construit din n elemente: <code>n</code></li>
    <li>Într-un arbore binar, numărul de noduri cu grad 2 este întotdeauna cu 1 mai mic decât numărul total de frunze: <code>|noduri grad 2| = |frunze| - 1</code></li>
  </ul>
</section>

      {/* Arbori Binari */}
      <section>
        <h2 className="text-3xl font-bold mb-4">Arbori Binari</h2>
        <p className="mb-4">
          Un arbore binar este un arbore în care fiecare nod are cel mult doi copii, denumiți copil stâng și copil drept.
        </p>
        <ul className="list-disc list-inside space-y-4">
          <li>
            <strong>Arbore binar complet:</strong> toate nivelurile sunt complet umplute, cu excepția posibil ultimei, care este umplută de la stânga la dreapta.
            <br />
            <img src="/arbori/arbore_complet.png" alt="Arbore binar complet" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain"/>
          </li>
          <li>
            <strong>Arbore binar perfect:</strong> toate frunzele sunt la același nivel și fiecare nod interior are exact doi copii.
            <br />
            <img src="/arbori/arbore_perfect.png" alt="Arbore binar perfect" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain" />
          </li>
          <li>
            <strong>Arbore binar echilibrat:</strong> diferența de înălțime între subarborii stâng și drept ai oricărui nod nu este mai mare decât 1.
            <br />
            <img src="/arbori/arbore_echilibrat.png" alt="Arbore binar echilibrat" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain"/>
          </li>
          <li>
            <strong>Arbore binar de căutare (BST):</strong> un arbore binar ordonat astfel încât pentru orice nod, valorile din subarborele stâng sunt mai mici, iar cele din subarborele drept sunt mai mari.
            <br />
            <img src="/arbori/arbore_de_cautare.png" alt="Arbore binar de căutare" className="my-4 mx-auto max-w-[300px] w-full h-auto object-contain"/>
          </li>
        </ul>
      </section>
    </div>
  );
}
