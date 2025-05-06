import React from 'react';
import { Card, CardContent } from '../components/ui/Card';

export default function Arbori() {
  return (
    <div className="max-w-6xl mx-auto p-8 text-dark-blue space-y-8">
      <header className="flex items-center space-x-4">
        <h1 className="text-4xl font-extrabold">Arbori</h1>
      </header>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Definiție</h2>
          <p>
            Un <strong>arbore</strong> este un graf conex și aciclic: între orice două vârfuri există exact un lanț elementar unic, iar arborele nu conține cicluri.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Termeni Importanți</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Rădăcină:</strong> vârful desemnat ca punct de început într-un arbore orientat.</li>
            <li><strong>Frunză:</strong> vârf cu gradul gr = 1.</li>
            <li><strong>Părinte:</strong> pentru un vârf v, părintele este nodul imediat anterior către rădăcină.</li>
            <li><strong>Fiu:</strong> vârf direct conectat ca descendent al unui nod părinte.</li>
            <li><strong>Lanț elementar:</strong> drum fără repetarea vârfurilor.</li>
            <li><strong>Nivelul unui vârf:</strong> distanța (număr de muchii) de la rădăcină.</li>
            <li><strong>Înălțimea arborelui:</strong> nivelul maxim întâlnit.</li>
            <li><strong>Descendenți:</strong> toate vârfurile accesibile dintr-un nod prin drumuri de copii.</li>
            <li><strong>Pădure de arbori:</strong> colecție de arbori disjuncți.</li>
            <li><strong>Miscarea rădăcinii:</strong> schimbarea rădăcinii și ajustarea direcțiilor pentru a păstra structura.</li>
            <li><strong>Arbori identici:</strong> arbori cu aceleași vârfuri, muchii și relații părinte–fiu.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Metode de Reprezentare</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Lista de adiacență:</strong> pentru fiecare nod, lista copiilor.</li>
            <li><strong>Vectorul de părinți:</strong> părintele fiecărui nod.</li>
            <li><strong>Matricea de adiacență:</strong> matrice forță în aplicații mici.</li>
            <li><strong>Vector de niveluri:</strong> nivelul fiecărui nod stocat separat.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Proprietăți ale Arborilor</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Un arbore cu n vârfuri are exact n − 1 muchii.</li>
            <li>Între orice două vârfuri există un lanț elementar unic.</li>
            <li>Nu există cicluri.</li>
            <li>Este conectat și minimal: eliminarea oricărei muchii îl deconectează.</li>
            <li>Există cel puțin două frunze pentru n ≥ 2.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Algoritmi Importanți</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Kruskal:</strong> arbore de acoperire minim folosind Disjoint Set Union.</li>
            <li><strong>Prim:</strong> pornește dintr-un nod și adaugă cele mai mici muchii treptat.</li>
            <li><strong>DFS:</strong> determină părinți, niveluri și descendenți prin explorare în adâncime.</li>
            <li><strong>BFS:</strong> află nivelurile tuturor nodurilor rapid, nivel cu nivel.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Formule și Relații</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>m = n − 1</strong>, unde n = număr de vârfuri și m = număr de muchii.</li>
            <li><strong>Arbori neorientați cu n noduri:</strong> n<sup>n−2</sup> (Cayley).</li>
            <li><strong>Numărul de niveluri:</strong> înălțimea maximă + 1.</li>
            <li><strong>Număr minim de frunze:</strong> minim două pentru n ≥ 2.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">Arbori Binari</h2>
          <p>
            Un arbore binar este o structură în care fiecare nod are cel mult doi copii: stâng și drept.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Tipuri de Arbori Binari</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Complet:</strong> toate nivelurile, cu excepția ultimului, sunt complet umplute; ultimul este umplut de la stânga la dreapta.</li>
            <li><strong>Perfect:</strong> toate nivelurile sunt complet umplute; fiecare nod are 0 sau 2 copii.</li>
            <li><strong>Echilibrat:</strong> diferența de înălțime dintre subarborii stâng și drept ≤ 1.</li>
            <li><strong>BST:</strong> subarborele stâng conține valori mai mici, cel drept valori mai mari.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2">Proprietăți ale Arborilor Binari</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Număr maxim de noduri la nivelul k: 2<sup>k</sup>.</li>
            <li>Număr maxim de noduri pentru înălțimea h: 2<sup>h+1</sup> − 1.</li>
            <li>În arbore binar perfect, numărul de frunze = 2<sup>h</sup>.</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2">Algoritmi pe Arbori Binari</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Inserare și căutare în BST:</strong> eficiență O(log n) dacă este echilibrat.</li>
            <li><strong>Parcurgere inordine:</strong> vizitează noduri în ordine crescătoare.</li>
            <li><strong>Preordine și postordine:</strong> folosite pentru serializare și reconstrucție.</li>
            <li><strong>Reconstrucție arbore:</strong> din două dintre parcurgeri (in, pre, post).</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
