/* Home.js */
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const containerRef = React.useRef(null);
  const handleScroll = (e, id) => {
    e.preventDefault();
    const el = containerRef.current.querySelector(`#${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto snap-y snap-mandatory h-[calc(100vh-4rem)] scroll-smooth"
    >
      {/* Hero */}
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

      {/* Lecții */}
      <section
        id="lectii"
        className="snap-start h-full flex flex-col items-center justify-center text-center px-6"
      >
        <h2 className="text-3xl font-semibold mb-4">Lecții</h2>
        <p className="mb-6 max-w-xl">
          Explorați lecțiile noastre interactive despre structurile de date și grafuri.
        </p>
        <Link
        //   to="/lectii"
          className="inline-block bg-blue text-white px-6 py-2 rounded-lg hover:bg-light-blue transition"
        >
          Accesează lecțiile
        </Link>
      </section>

      {/* Simulări */}
      <section
        id="simulari"
        className="snap-start h-full flex flex-col items-center justify-center text-center px-6"
      >
        <h2 className="text-3xl font-semibold mb-4">Simulări</h2>
        <p className="mb-6 max-w-xl">
          Practicați cu simulări care explică pas cu pas algoritmi pe arbori și grafuri.
        </p>
        <Link
        //   to="/simulari"
          className="inline-block bg-blue text-white px-6 py-2 rounded-lg hover:bg-light-blue transition"
        >
          Începe simulările
        </Link>
      </section>

      {/* Teste */}
      <section
        id="teste"
        className="snap-start h-full flex flex-col items-center justify-center text-center px-6"
      >
        <h2 className="text-3xl font-semibold mb-4">Teste</h2>
        <p className="mb-6 max-w-xl">
          Verifică-ți cunoștințele cu teste pe grafuri, arbori și algoritmi.
        </p>
        <Link
        //   to="/teste"
          className="inline-block bg-blue text-white px-6 py-2 rounded-lg hover:bg-light-blue transition"
        >
          Începe testele
        </Link>
      </section>

      {/* Sandbox */}
      <section
        id="sandbox"
        className="snap-start h-full flex flex-col items-center justify-center text-center px-6"
      >
        <h2 className="text-3xl font-semibold mb-4">Sandbox</h2>
        <p className="mb-6 max-w-xl">
          Testează-ți propriile coduri și experimente cu exemple în timp real.
        </p>
        <Link
          to="/sandbox"
          className="inline-block bg-blue text-white px-6 py-2 rounded-lg hover:bg-light-blue transition"
        >
          Accesează sandbox
        </Link>
      </section>

      {/* Feedback */}
      <section
        id="feedback"
        className="snap-start h-full flex flex-col items-center justify-center text-center px-6"
      >
        <h2 className="text-3xl font-semibold mb-4">Feedback</h2>
        <p className="mb-6 max-w-xl">
          Spune-ne părerea ta și ajută-ne să îmbunătățim platforma.
        </p>
        <Link
          to="/feedback"
          className="inline-block bg-blue text-white px-6 py-2 rounded-lg hover:bg-light-blue transition"
        >
          Trimite feedback
        </Link>
      </section>
    </div>
  );
}
