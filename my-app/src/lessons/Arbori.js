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
          <li><strong>Padure de arbori:</strong> o colecție de arbori disjuncți (fără muchii între ei).</li>
          <li><strong>Miscarea rădăcinii:</strong> alegerea unui alt vârf drept rădăcină, modificând direcția arcelor pentru a păstra structura de arbore.</li>
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
        <ul className="list-disc list-inside space-y-4">
          <li><strong>Algoritmul lui Kruskal:</strong> construiește un arbore parțial de cost minim alegând muchiile cele mai ieftine care nu formează cicluri. Se folosește de structura Disjoint Set Union (DSU).</li>
          <li><strong>Algoritmul lui Prim:</strong> construiește un arbore parțial de cost minim pornind dintr-un vârf ales și adăugând mereu cea mai ieftină muchie către un vârf nou.</li>
          <li><strong>Parcurgere DFS:</strong> utilă pentru determinarea părinților, nivelurilor și descendenților.</li>
          <li><strong>Parcurgere BFS:</strong> foarte eficientă pentru aflarea nivelurilor tuturor vârfurilor față de o rădăcină dată.</li>
        </ul>
      </section>

      {/* Formule */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Formule și Relații</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>m = n - 1</strong>, unde n este numărul de vârfuri și m numărul de muchii.</li>
          <li><strong>Număr total de arbori neorientați cu n vârfuri:</strong> n<sup>n-2</sup> (formula lui Cayley).</li>
          <li><strong>Numărul de niveluri:</strong> egal cu înălțimea maximă plus unu.</li>
          <li><strong>Număr minim de frunze:</strong> minim două pentru n ≥ 2.</li>
        </ul>
      </section>

      {/* Arbori Binari */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Arbori Binari</h2>
        <p className="mb-4">
          Un arbore binar este o structură de date în care fiecare nod are cel mult doi copii: unul stâng și unul drept.
        </p>

        <h3 className="text-2xl font-semibold mt-6 mb-2">Tipuri de Arbori Binari</h3>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Arbore binar complet:</strong> toate nivelurile, cu excepția ultimului, sunt complet umplute, iar ultimul este umplut de la stânga la dreapta.</li>
          <li><strong>Arbore binar perfect:</strong> toate nivelurile sunt complet umplute și fiecare nod are exact doi copii sau niciunul.</li>
          <li><strong>Arbore binar echilibrat:</strong> diferența de înălțime dintre subarborele stâng și drept este cel mult 1 pentru orice nod.</li>
          <li><strong>Arbore binar de căutare (BST):</strong> pentru orice nod, valorile din subarborele stâng sunt mai mici, iar cele din subarborele drept sunt mai mari.</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-6 mb-2">Proprietăți ale Arborilor Binari</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Numărul maxim de noduri la nivelul k este 2<sup>k</sup>.</li>
          <li>Numărul maxim de noduri într-un arbore de înălțime h este 2<sup>h+1</sup> - 1.</li>
          <li>Într-un arbore binar perfect, numărul frunzelor este 2<sup>h</sup>.</li>
        </ul>

        <h3 className="text-2xl font-semibold mt-6 mb-2">Algoritmi pe Arbori Binari</h3>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Inserare și căutare în BST:</strong> operații eficiente dacă arborele este echilibrat (complexitate O(log n)).</li>
          <li><strong>Parcurgere inordine (in-order):</strong> vizitează nodurile în ordine crescătoare într-un BST.</li>
          <li><strong>Parcurgere preordine și postordine:</strong> utile pentru serializare, reconstrucție sau evaluare de expresii.</li>
          <li><strong>Construirea arborelui din parcurgeri:</strong> se poate reconstrui arborele dacă sunt cunoscute două dintre cele trei parcurgeri (in, pre, post).</li>
        </ul>
      </section>
    </div>
  );
}
