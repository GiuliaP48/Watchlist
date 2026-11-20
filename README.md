# La mia watchlist

Applicazione in React per tenere la lista di film e serie da guardare: si possono filtrare, scegliere cosa guardare stasera, aggiungere nuovi titoli, segnarli come visti, votarli, modificarli ed eliminarli. I dati sono salvati su un backend (json-server), quindi restano anche ricaricando la pagina.

## Tecnologie

- React + TypeScript (Vite)
- Tailwind CSS
- clsx + tailwind-merge (funzione `cn`)
- json-server (backend finto che salva i dati in `db.json`)
- concurrently (avvia frontend e backend con un solo comando)
- lucide e morphicons (icone)

## Come avviarlo

1. Controlla che nella cartella principale ci sia il file `.env` con l'indirizzo del backend:

```
VITE_BACKEND_URL=http://localhost:3000
```

2. Installa le dipendenze e avvia:

```bash
npm install
npm run dev
```

`npm run dev` avvia insieme il frontend (React) e il backend (json-server sulla porta 3000). Poi apri l'indirizzo che compare nel terminale (di solito http://localhost:5173).

## Funzionalità

### Prima parte
- Lista dei titoli con anno e badge **Film** / **Serie**
- Filtri **Tutti**, **Film**, **Serie**
- Conteggio dei titoli (quanti film e quante serie)
- Cliccando un titolo lo scelgo per **«Stasera guardo»** (cliccando di nuovo lo tolgo)

### Seconda parte: form per aggiungere un titolo (un solo stato)
- **Base**: form con titolo, anno e tipo (Film/Serie); il nuovo titolo viene aggiunto alla lista
- **Medio**: più errori per campo, mostrati sotto il campo:
  - titolo obbligatorio, almeno 2 caratteri, non già presente nella lista (senza distinguere maiuscole e minuscole)
  - anno tra il 1900 e l'anno corrente
- **Pro**: dopo il primo invio gli errori si aggiornano mentre si scrive
- **Extra pro**:
  - casella **«Visto»** che barra il titolo
  - **voto da 1 a 5 stelle**; cliccando la stella già scelta il voto si toglie
  - **«Modifica»** su ogni titolo: il form si riempie, il bottone diventa **«Salva titolo»** e **«Annulla modifica»** torna ad aggiungere; il titolo che sto modificando non conta come doppione

### Terza parte: ### Collegamento al backend (json-server)
- All'avvio i titoli vengono caricati dal backend con una `fetch` (`GET`)
- Aggiungere (`POST`), modificare (`PUT`) ed eliminare (`DELETE`) un titolo salva il cambiamento sul backend
- Anche **«Visto»** e il **voto** vengono salvati sul backend (`PUT`)
- Bottone **elimina** (cestino) su ogni titolo, con la rotellina mentre cancella
- Il bottone del form mostra la **rotellina mentre salva** e l'icona cambia: **+** per aggiungere, **salva** per modificare
- Il bottone del form è **disabilitato** mentre salva e quando ci sono errori

## Note

- Il form ha **un solo stato** con dentro i valori dei campi, gli errori, `submitted` (che diventa `true` al primo invio: da lì gli errori si aggiornano mentre scrivo) e `isSubmitting` (che è `true` mentre aspetto la risposta del backend).
- In App il form ha `key={editingId}`: quando clicco «Modifica» su un altro titolo la `key` cambia, il form riparte da capo e si riempie con il titolo giusto.
- Il `PUT` sostituisce tutto il titolo sul backend, quindi mando sempre il titolo intero con solo il campo cambiato (per esempio `seen` o `rating`), così non si perdono gli altri dati.
- Gli `id` dei titoli nuovi li crea il backend.

## Struttura

```
.env                      # indirizzo del backend
db.json                   # i dati salvati dal backend (json-server)
src/
├── components/
│   ├── AddShowForm.tsx   # form per aggiungere e modificare un titolo
│   ├── Button.tsx        # bottone riutilizzabile (primary / secondary / tertiary / danger)
│   ├── Input.tsx         # campo di testo con gli errori sotto
│   └── ShowRow.tsx       # una riga della lista (visto, stelle, badge, modifica, elimina)
├── data/
│   └── watchlist.ts      # il tipo Show e i titoli iniziali
├── utils/
│   ├── cn.ts             # unisce le classi di Tailwind
│   └── env.ts            # legge l'indirizzo del backend dal .env
└── App.tsx               # stato della lista, fetch al backend, filtri, selezione e modifica
```