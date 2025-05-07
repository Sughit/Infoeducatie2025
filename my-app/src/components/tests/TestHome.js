import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function TestHome() {
  const [stats, setStats] = useState({ totalTests: 0, averageScore: 0 });
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      try {
        const testsSnapshot = await getDocs(collection(db, "tests"));
        const total = testsSnapshot.size;

        if (u) {
          const resultsRef = collection(db, "results", u.uid, "attempts");
          const resultsSnap = await getDocs(resultsRef);
          const allResults = resultsSnap.docs.map(doc => doc.data());
          const count = allResults.length;
          const scores = allResults.map(r => r.score || 0);
          const avg = count ? Math.round(scores.reduce((a,b) => a + b, 0) / count) : 0;
          const recentQ = query(resultsRef, orderBy("timestamp", "desc"), limit(7));
          const recentSnap = await getDocs(recentQ);
          const recent = recentSnap.docs.map(doc => doc.data());

          setStats({ totalTests: total, averageScore: avg });
          setAttemptsCount(count);
          setRecentTests(recent);
        } else {
          setStats({ totalTests: total, averageScore: 0 });
        }
      } catch (err) {
        console.error(err);
        setError("Eroare la încărcarea statisticilor.");
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Se încarcă...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="p-6 w-full max-w-md mx-auto md:max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 md:space-y-0 space-y-6 h-[calc(100vh-4rem)] md:grid-rows-[auto_auto_1fr_auto]">
        {/* Title spans both columns on desktop */}
        <h1 className="text-3xl font-bold text-center md:col-span-2 md:row-start-1 pt-10">Teste Grafuri & Arbori</h1>
        <p className="text-center text-gray-600 md:col-span-2 md:row-start-2">
          Exersează algoritmi de grafuri și arbori prin teste interactive.
        </p>

        {/* Recent tests list - left column on desktop, second block on mobile */}
        {user && (
          <div className="space-y-2 md:col-start-1 md:row-start-3 md:row-span-2 ">
            <h2 className="text-lg font-semibold">Ultimele teste rezolvate</h2>
            <ul className="list-disc list-inside text-gray-700">
              {recentTests.map((test, idx) => (
                <li key={idx} className={`flex flex-col space-y-1 ${idx >= 3 ? 'hidden md:flex' : ''}`}>
                  <div className="flex justify-between">
                    <span className="font-medium">{test.title}</span>
                    <span className="font-medium">{test.score}%</span>
                  </div>
                  <span className="text-sm text-gray-500">Secțiune: {test.section}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="md:space-y-10">
          {/* Statistics cards - right column on desktop, first row on mobile */}
          <div className="grid grid-cols-3 gap-4 md:col-start-2 md:row-start-3 md:pb-0 pb-10">
            <div className="p-2 bg-white rounded-lg shadow text-center">
              <h2 className="text-xl font-bold">{stats.totalTests}</h2>
              <p>Teste pe platformă</p>
            </div>
            {user && (
              <div className="p-4 bg-white rounded-lg shadow text-center">
                <h2 className="text-xl font-bold">{attemptsCount}</h2>
                <p>Teste rezolvate</p>
              </div>
            )}
            {user && (
              <div className="p-4 bg-white rounded-lg shadow text-center">
                <h2 className="text-xl font-bold">
                  {attemptsCount > 0 ? `${stats.averageScore}%` : "-"}
                </h2>
                <p>Scor mediu</p>
              </div>
            )}
          </div>

          {/* Navigation - under stats on desktop, under list on mobile */}
          <nav className="space-y-2 order-3 md:order-3 md:col-start-2 md:row-start-4">
            <Link to="neorientate" className="block w-full text-center py-2 bg-blue text-white rounded">
              Grafuri Neorientate
            </Link>
            <Link to="orientate" className="block w-full text-center py-2 bg-blue text-white rounded">
              Grafuri Orientate
            </Link>
            <Link to="arbori" className="block w-full text-center py-2 bg-blue text-white rounded">
              Arbori
            </Link>
            <Link to="create" className="block w-full text-center py-2 bg-green-600 text-white rounded mt-4">
              Creează un test nou
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
