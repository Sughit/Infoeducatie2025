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
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Matricea de adiacență:</strong> matrice pătratică unde poziția (i, j) conține 1 dacă există muchie între vârfurile i și j, altfel 0. Eficientă pentru grafuri dense.</li>
          <li><strong>Lista de adiacență:</strong> pentru fiecare vârf, o listă a vârfurilor la care este conectat. Folosită mai ales pentru grafuri rare.</li>
          <li><strong>Lista de muchii:</strong> fiecare muchie este o pereche de vârfuri (u, v). Ideală pentru algoritmi care procesează direct muchiile.</li>
          <li><strong>Matricea de incidență:</strong> fiecare coloană corespunde unei muchii; 1 indică vârful incident pe acea muchie.</li>
          <li><strong>Vectori de adiacență:</strong> implementare mai optimă a listelor de adiacență pentru procesări rapide.</li>
          <li><strong>Lista de succesiune:</strong> similară listei de adiacență, folosită în anumite contexte orientate.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Proprietăți Generale</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Suma gradelor tuturor vârfurilor este egală cu de două ori numărul muchiilor: <strong>∑gr(v) = 2m</strong>.</li>
          <li>Un graf este <strong>conex</strong> dacă există un drum între oricare două vârfuri.</li>
          <li>Un graf <strong>fără cicluri</strong> și <strong>conex</strong> este un <strong>arbore</strong>.</li>
          <li>Numărul minim de muchii într-un graf conex cu n noduri este <strong>n-1</strong>.</li>
          <li>Există întotdeauna un drum de la un vârf de grad impar la alt vârf de grad impar.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Tipuri de Grafuri Neorientate</h2>
        <ul className="list-disc list-inside space-y-4">
          <li><strong>Graf complet (K<sub>n</sub>):</strong> fiecare vârf este conectat direct la toate celelalte vârfuri. Număr de muchii: <strong>n(n-1)/2</strong>.</li>
          <li><strong>Graf complementar:</strong> graf care conține exact acele muchii care lipsesc din graf.</li>
          <li><strong>Graf parțial:</strong> un subgraf care conține doar o parte dintre muchiile și vârfurile grafului original.</li>
          <li><strong>Graf regulat:</strong> toate vârfurile au același grad. Un graf în care fiecare vârf are grad 3 se numește 3-regulat.</li>
          <li><strong>Subgraf:</strong> un graf obținut prin eliminarea unora dintre vârfurile și/sau muchiile unui graf inițial.</li>
          <li><strong>Graf hamiltonian:</strong> un graf care conține un ciclu ce vizitează fiecare vârf exact o dată.</li>
          <li><strong>Graf eulerian:</strong> un graf în care există un ciclu care trece o singură dată prin fiecare muchie. Un graf este eulerian dacă este conex și toate vârfurile au grad par.</li>
          <li><strong>Graf bipartit:</strong> vârfurile pot fi împărțite în două mulțimi disjuncte, fără muchii în interiorul aceleiași mulțimi.</li>
          <li><strong>Graf bipartit complet (K<sub>m,n</sub>):</strong> fiecare vârf dintr-o mulțime este conectat la toate vârfurile din cealaltă mulțime.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Parcurgerea Grafurilor</h2>
        <ul className="list-disc list-inside space-y-4">
          <li><strong>BFS (Breadth-First Search):</strong> parcurgere în lățime. Se vizitează vârfurile nivel cu nivel. Se folosește o coadă.</li>
          <li><strong>DFS (Depth-First Search):</strong> parcurgere în adâncime. Se explorează cât mai adânc înainte de a reveni la bifurcații.</li>
          <li><strong>Detecția ciclurilor:</strong> DFS poate detecta existența ciclurilor într-un graf neorientat.</li>
          <li><strong>Identificarea componentelor conexe:</strong> Se poate realiza prin parcurgeri BFS sau DFS succesive.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Formule Importante</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>∑gr(v) = 2 × m</strong>, unde m este numărul muchiilor.</li>
          <li><strong>Număr muchii graf complet:</strong> m = n(n-1)/2</li>
          <li><strong>Număr maxim de muchii într-un graf simplu:</strong> n(n-1)/2</li>
          <li><strong>Număr minim de muchii într-un graf conex:</strong> n - 1</li>
          <li><strong>Număr muchii graf bipartit complet:</strong> m = m × n (unde m și n sunt cardinalitățile celor două mulțimi).</li>
          <li><strong>Într-un graf eulerian:</strong> toate vârfurile au grad par, adică fiecare v satisface gr(v) par.</li>
          <li><strong>Număr de componente conexe c:</strong> m ≥ n - c.</li>
        </ul>
      </section>

    </div>
  );
}
