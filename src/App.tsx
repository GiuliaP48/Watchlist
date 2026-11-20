import { useEffect, useState } from "react";
import ShowRow from "./components/ShowRow";
import Button from "./components/Button";
import { type Show } from "./data/watchlist";

import AddShowForm from "./components/AddShowForm";
import { env } from "./utils/env";

type Filtro = 'tutti' | 'film' | 'serie';

function App() {

  const [shows, setShows] = useState<Show[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [filtro, setFiltro] = useState<Filtro>('tutti');
  const [editingId, setEditingId] = useState<string>(); // l'id del titolo che sto modificando (se non c'è, sto aggiungendo)

  const selectedShow = shows.find((show) => show.id === selectedId);
  const showFiltrati = shows.filter((show) => filtro === 'tutti' || show.kind === filtro);
  const numFilm = shows.filter((show) => show.kind === 'film').length;
  const numSerie = shows.filter((show) => show.kind === 'serie').length;
  const editingShow = shows.find((show) => show.id === editingId);

  // collego con il backend (db.json)
  useEffect(() => {
    fetch(env.backendUrl + '/watchlist')
      .then(res => res.json())
      .then(data => {
        setShows(data);
      })

  }, [])

  // "Visto": inverto seen del titolo cliccato e lo salvo sul backend
  async function toggleSeen(id: string) {
    // cerco nella lista il titolo cliccato
    const show = shows.find(s => s.id === id);
    // se non lo trovo mi fermo
    if (!show) return;

    const res = await fetch(`${env.backendUrl}/watchlist/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...show, seen: !show.seen }),
      headers: { 'Content-Type': 'application/json' },
    });
    // il backend mi risponde con il titolo aggiornato
    const updatedShow = await res.json();
    // nello state sostituisco il titolo vecchio con quello aggiornato, gli altri restano uguali
    setShows(prev => prev.map(s => s.id === updatedShow.id ? updatedShow : s));
  }

  // voto: se clicco la stella già scelta tolgo il voto, altrimenti metto quello nuovo, e lo salvo sul backend
  async function rate(id: string, voto: number) {
    // cerco nella lista il titolo cliccato
    const show = shows.find(s => s.id === id);
    // se non lo trovo mi fermo
    if (!show) return;

    const res = await fetch(`${env.backendUrl}/watchlist/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...show, rating: show.rating === voto ? undefined : voto }),
      headers: { 'Content-Type': 'application/json' },
    });
    // il backend mi risponde con il titolo aggiornato
    const updatedShow = await res.json();
    // nello state sostituisco il titolo vecchio con quello aggiornato, gli altri restano uguali
    setShows(prev => prev.map(s => s.id === updatedShow.id ? updatedShow : s));
  }

  // POST --> aggiungo un titolo nuovo sul backend
  async function onAddShow(data: Omit<Show, 'id'>) {
    const res = await fetch(env.backendUrl + '/watchlist', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
    const newShow = await res.json();
    setShows(prev => [...prev, newShow])
  }

  // PUT --> salvo sul backend il titolo modificato
  async function onUpdateShow(data: Omit<Show, 'id'>) {
    const res = await fetch(`${env.backendUrl}/watchlist/${editingId}`, {
      method: 'PUT',
      body: JSON.stringify({ ...editingShow, ...data }),
      headers: { 'Content-Type': 'application/json' },
    });
    const updatedShow = await res.json();
    setShows(prev => prev.map(show => show.id === updatedShow.id ? updatedShow : show))
    setEditingId(undefined);
  }

  // DELETE --> elimino il titolo dal backend
  async function onDeleteShow(id: string) {
    await fetch(`${env.backendUrl}/watchlist/${id}`, {
      method: 'DELETE',
    });
    setShows(prev => prev.filter(show => show.id !== id))
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
              onDelete={() => onDeleteShow(show.id)}
            />
          )}
        </div>

        {/* 3. conteggio */}
        <p className="text-center mt-6 text-gray-500">
          {shows.length} titoli: {numFilm} film e {numSerie} serie
        </p>

        {/* 4. stasera guardo */}
        {selectedShow && <p className="text-center mt-2 font-semibold">Stasera guardo: {selectedShow.title}</p>}

        {/* 5. form per aggiungere o modificare: l'id dei titoli nuovi lo crea il backend */}
        <AddShowForm
          key={editingId}
          editingShow={editingShow}
          onCancel={() => setEditingId(undefined)}
          existingTitles={shows.filter(s => s.id !== editingId).map(s => s.title)}
          onSubmit={editingShow ? onUpdateShow : onAddShow}
        />
      </div>
    </section>
  </>
}

export default App
