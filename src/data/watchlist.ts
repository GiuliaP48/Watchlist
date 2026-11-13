export type Show = {
    id: number;
    title: string;
    year: number;
    kind: 'film' | 'serie';
    seen?: boolean; // true se l'ho già visto; all'inizio non c'è, quindi "non visto"
    rating?: number; // voto da 1 a 5; se non c'è, nessun voto
}


export const watchlist: Show[] = [
    {
        id: 1,
        title: 'Inception',
        year: 2010,
        kind: 'film',
    },
    {
        id: 2,
        title: 'Interstellar',
        year: 2014,
        kind: 'film',
    },
    {
        id: 3,
        title: 'Coco',
        year: 2017,
        kind: 'film',
    },
    {
        id: 4,
        title: 'Il Signore degli Anelli: La compagnia dell’anello',
        year: 2001,
        kind: 'film',
    },
    {
        id: 5,
        title: 'Stranger Things',
        year: 2016,
        kind: 'serie',
    },
    {
        id: 6,
        title: 'Breaking Bad',
        year: 2008,
        kind: 'serie',
    }
]