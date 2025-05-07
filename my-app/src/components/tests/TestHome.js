import React from "react";
import { Link } from "react-router-dom";

export default function TestHome() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-blue mb-6">
          Teste Grafuri & Arbori
        </h1>
        <nav className="space-y-4">
          <Link
            to="neorientate"
            className="block w-full text-center py-3 bg-blue text-white rounded-xl shadow transition"
          >
            Grafuri Neorientate
          </Link>
          <Link
            to="orientate"
            className="block w-full text-center py-3 bg-blue text-white rounded-xl shadow transition"
          >
            Grafuri Orientate
          </Link>
          <Link
            to="arbori"
            className="block w-full text-center py-3 bg-blue text-white rounded-xl shadow transition"
          >
            Arbori
          </Link>
          <Link
            to="create"
            className="block w-full text-center py-3 bg-green-500 text-white rounded-xl shadow transition mt-6"
          >
            Creează un test nou
          </Link>
        </nav>
      </div>
    </div>
  );
}