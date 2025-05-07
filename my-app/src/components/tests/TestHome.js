import React from "react";
import { Link } from "react-router-dom";

export default function TestHome() {
    return (
      <div className="p-6 max-w-md mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-center">Teste Grafuri & Arbori</h1>
  
        <nav className="space-y-2">
          <Link
            to="neorientate"
            className="block w-full text-center py-2 bg-blue text-white rounded"
          >
            Grafuri Neorientate
          </Link>
          <Link
            to="orientate"
            className="block w-full text-center py-2 bg-blue text-white rounded"
          >
            Grafuri Orientate
          </Link>
          <Link
            to="arbori"
            className="block w-full text-center py-2 bg-blue text-white rounded"
          >
            Arbori
          </Link>
          <Link
            to="create"
            className="block w-full text-center py-2 bg-green-600 text-white rounded mt-4"
          >
            Creează un test nou
          </Link>
        </nav>
      </div>
    )
  }
  