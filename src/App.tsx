import { useState } from "react";
import ShowRow from "./components/ShowRow";
import Button from "./components/Button";
import { watchlist } from "./data/watchlist";

import AddShowForm from "./components/AddShowForm";

type Filtro = 'tutti' | 'film' | 'serie';

function App() {

  const [shows, setShows] = useState(watchlist);
  const [selectedId, setSelectedId] = useState<number>();
  const [filtro, setFiltro] = useState<Filtro>('tutti');
  const [editingId, setEditingId] = useState<number>(); // l'id del titolo che sto modificando (se non c'è, sto aggiungendo)
  
  const selectedShow = shows.find((show) => show.id === selectedId);
  const showFiltrati = shows.filter((show) => filtro === 'tutti' || show.kind === filtro);
  const numFilm = shows.filter((show) => show.kind === 'film').length;
  const numSerie = shows.filter((show) => show.kind === 'serie').length;
  const editingShow = shows.find((show) => show.id === editingId);

  // "Visto": inverto seen del titolo cliccato
  function toggleSeen(id: number) {
    // map: per il titolo giusto un nuovo oggetto con seen al contrario (se era visto diventa non visto e viceversa), gli altri restano uguali
    setShows(prev => prev.map(s => s.id === id ? { ...s, seen: !s.seen } : s));
  }

  // voto: se clicco la stella già scelta tolgo il voto, altrimenti metto quello nuovo
  function rate(id: number, voto: number) {
    setShows(prev => prev.map(s => s.id === id ? { ...s, rating: s.rating === voto ? undefined : voto } : s));
  }

  return <>
    <section className="min-h-screen flex justify-center items-center p-6">
      <div className="w-full max-w-lg">
        <h1 className="font-bold text-4xl text-center mb-8">La mia watchlist</h1>

        {/* 1. filtri */}
        <div className="flex gap-2 mb-6">
          <Button variant={filtro === 'tutti' ? 'primary' : 'secondary'} onClick={() => setFiltro('tutti')}>Tutti</Button>
          <Button variant={filtro === 'film' ? 'primary' : 'secondary'} onClick={() => setFiltro('film')}>Film</Button>
          <Button variant={filtro === 'serie' ? 'primary' : 'secondary'} onClick={() => setFiltro('serie')}>Serie</Button>
        </div>

        {/* 2. lista */}
        <div className="flex flex-col gap-3">
          {showFiltrati.map(show =>
            <ShowRow
              show={show}
              key={show.id}
              onClick={() => setSelectedId(show.id === selectedId ? undefined : show.id)}
              active={show.id === selectedId}
              onToggleSeen={() => toggleSeen(show.id)}
              onRate={(voto) => rate(show.id, voto)}
              onEdit={() => setEditingId(show.id)}
            />
          )}
        </div>

        {/* 3. conteggio */}
        <p className="text-center mt-6 text-gray-500">
          {shows.length} titoli: {numFilm} film e {numSerie} serie
        </p>

        {/* 4. stasera guardo */}
        {selectedShow && <p className="text-center mt-2 font-semibold">Stasera guardo: {selectedShow.title}</p>}

        {/* 5. form per aggiungere: l'id lo aggiunge App */}
        <AddShowForm
          key={editingId}
          editingShow={editingShow}
          onCancel={() => setEditingId(undefined)}
          existingTitles={shows.filter(s => s.id !== editingId).map(s => s.title)}
          onSubmit={(newShow) => {
            if (editingShow) {
              // modifica: aggiorno il titolo giusto (tengo id, visto e voto) e torno ad aggiungere
              setShows(prev => prev.map(s => s.id === editingId ? { ...s, ...newShow } : s));
              setEditingId(undefined);
            } else {
              setShows(prev => [...prev, {
                id: Math.max(...prev.map(s => s.id)) + 1,
                ...newShow // titolo, anno e tipo che arrivano dal form
              }])
            }
          }}
        />
      </div>
    </section>
  </>
}

export default App
