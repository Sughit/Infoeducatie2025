import React from 'react';
import { Link } from 'react-router-dom';
import {
  LessonsIllustration,
  SimulationsIllustration,
  TestsIllustration,
  SandboxIllustration,
  FeedbackIllustration
} from './Illustrations';
import { Book, PlayCircle, ClipboardCheck, Code, MessageCircle } from 'lucide-react';

export default function Home() {
  const containerRef = React.useRef(null);
  const handleScroll = (e, id) => {
    e.preventDefault();
    const el = containerRef.current.querySelector(`#${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const sections = [
    {
      id: 'lectii',
      title: 'Lecții',
      icon: <Book className="w-8 h-8 text-highlight mr-2" />,
      items: [
        'Introducere în grafuri și arbori',
        'Parcurgerile DFS & BFS',
        'Algoritmi elementari',
      ],
      button: 'Accesează lecțiile',
      Illustration: LessonsIllustration
    },
    {
      id: 'simulari',
      title: 'Simulări',
      icon: <PlayCircle className="w-8 h-8 text-highlight mr-2" />,
      items: [
        'Vizualizare pas cu pas a algoritmilor',
        'Slider interactiv pentru viteza simulării',
        'Noduri și muchii editabile'
      ],
      button: 'Începe simulările',
      Illustration: SimulationsIllustration
    },
    {
      id: 'teste',
      title: 'Teste',
      icon: <ClipboardCheck className="w-8 h-8 text-highlight mr-2" />,
      items: [
        'Întrebări de dificultate variată',
        'Feedback imediat după răspuns',
        'Progres măsurat în timp real'
      ],
      button: 'Începe testele',
      Illustration: TestsIllustration
    },
    {
      id: 'sandbox',
      title: 'Sandbox',
      icon: <Code className="w-8 h-8 text-highlight mr-2" />,
      items: [
        'Crează grafuri și arbori personalizați',
        'Modifică noduri și muchii',
        'Vizualizează grafurile speciale'
      ],
      button: 'Accesează sandbox',
      Illustration: SandboxIllustration
    },
    {
      id: 'feedback',
      title: 'Feedback',
      icon: <MessageCircle className="w-8 h-8 text-highlight mr-2" />,
      items: [
        'Trimite sugestii de îmbunătățire',
        'Raportează bug-uri rapid',
        'Cere noi funcționalități'
      ],
      button: 'Trimite feedback',
      Illustration: FeedbackIllustration
    }
  ];

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto snap-y snap-mandatory h-[calc(100vh-4rem)] scroll-smooth"
    >
      <section className="snap-start h-full relative bg-gradient-to-r from-blue to-light-blue flex items-center justify-center text-center overflow-hidden">
        <div className="relative z-10 max-w-2xl px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            Explorează Grafuri & Arbori
          </h1>
          <p className="text-lg md:text-2xl text-white/80 mb-8">
            Învață conceptele cheie ale structurilor de date prin exemple interactive
            și vizualizări dinamice.
          </p>
          <a
            href="#lectii"
            onClick={(e) => handleScroll(e, 'lectii')}
            className="inline-block bg-white text-blue font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-white/90 transition"
          >
            Vezi mai multe
          </a>
        </div>
      </section>

      {sections.map(({ id, title, icon, items, button, Illustration }) => (
        <section
          key={id}
          id={id}
          className="snap-start h-full relative flex items-center justify-center text-center px-6 md:px-24 lg:px-48"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <Illustration />
          </div>
          <div className="relative z-10 w-full max-w-3xl space-y-8 px-6 md:px-8 py-12">
            <h2 className="text-4xl md:text-6xl font-semibold flex items-center justify-center text-dark-blue">
              {icon}{title}
            </h2>
            <ul className="list-disc list-inside space-y-3 marker:text-highlight text-left md:text-center">
              {items.map((text) => (
                <li key={text} className="text-lg md:text-xl text-dark-blue">
                  {text}
                </li>
              ))}
            </ul>
            <Link
              to={id === 'sandbox' ? '/sandbox' :
                  id === 'simulari' ? '/simulari' :
                  id === 'teste' ? '/tests' : 
                  id === 'feedback' ? '/feedback' : 
                  `#${id}`}
              className="inline-block bg-highlight text-white font-medium py-3 px-8 rounded-full shadow hover:scale-105 transition-transform"
            >
              {button}
            </Link>
          </div>
        </section>
      ))}
    </div>
  );
}
