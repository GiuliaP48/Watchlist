# La mia watchlist

Applicazione in React per tenere la lista di film e serie da guardare: si possono filtrare, scegliere cosa guardare stasera, aggiungere nuovi titoli, segnarli come visti, votarli e modificarli.

## Tecnologie

- React + TypeScript (Vite)
- Tailwind CSS
- clsx + tailwind-merge (funzione `cn`)

## Come avviarlo

```bash
npm install
npm run dev
```

Poi apri l'indirizzo che compare nel terminale (di solito http://localhost:5173).

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
  - **«Modifica»** su ogni titolo: il form si riempie, il bottone diventa **«Salva»** e **«Annulla»** torna ad aggiungere; il titolo che sto modificando non conta come doppione

## Note

- Il form ha **un solo stato** con dentro i valori dei campi, gli errori e `submitted` (che diventa `true` al primo invio: da lì gli errori si aggiornano mentre scrivo).
- In App il form ha `key={editingId}`: quando clicco «Modifica» su un altro titolo la `key` cambia, il form riparte da capo e si riempie con il titolo giusto.

## Struttura

```
src/
├── components/
│   ├── AddShowForm.tsx   # form per aggiungere e modificare un titolo
│   ├── Button.tsx        # bottone riutilizzabile (primary / secondary)
│   ├── Input.tsx         # campo di testo con gli errori sotto
│   └── ShowRow.tsx       # una riga della lista (visto, stelle, badge, modifica)
├── data/
│   └── watchlist.ts      # il tipo Show e i titoli iniziali
├── utils/
│   └── cn.ts             # unisce le classi di Tailwind
└── App.tsx               # stato della lista, filtri, selezione e modifica
```