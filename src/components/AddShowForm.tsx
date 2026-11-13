import { useState } from "react";
import Button from "./Button";
import { cn } from "../utils/cn";
import type { Show } from "../data/watchlist";

// il form non conosce la lista: restituisce ad App il titolo nuovo SENZA id
type AddShowFormProps = {
    onSubmit?: (data: Omit<Show, 'id'>) => void;
}

// un solo stato: valori ed errori insieme
const defaultState = {
    values: {
        title: "",
        year: 0,
        kind: 'film' as 'film' | 'serie',
    },
    errors: {
        title: [] as string[],
        year: [] as string[],
    }
}

const AddShowForm = ({ onSubmit }: AddShowFormProps) => {
    const [formState, setFormState] = useState(defaultState);

    function addShow(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault(); // la pagina non si ricarica

        // costruisco gli errori in una variabile, e solo alla fine li salvo nello stato
        let errors = { ...defaultState.errors };

        // uso trim() per togliere gli spazi all'inizio e alla fine: così un titolo fatto solo di spazi conta come vuoto
        if (!formState.values.title.trim()) {
            errors = { ...errors, title: ['Il titolo è obbligatorio'] };
        }

        if (formState.values.year < 1900 || formState.values.year > 2026) {
            errors = { ...errors, year: ["L'anno deve essere tra 1900 e 2026"] };
        }

        // se almeno un campo ha errori, li mostro e mi fermo
        if (Object.values(errors).some(arr => arr.length)) {
            setFormState(prev => ({ ...prev, errors }));
            return;
        }

        // reset del form e passo i dati ad App
        setFormState(defaultState);
        onSubmit?.({ ...formState.values, title: formState.values.title.trim() });
    }

    return (
        <form onSubmit={addShow} className="flex flex-col gap-3">
            <h2 className="font-bold text-2xl mt-10 mb-1">Aggiungi un titolo</h2>

            <input
                className={cn(
                    "bg-gray-200 rounded-full w-full py-2 px-4",
                    formState.errors.title.length > 0 && "border-2 border-red-500"
                )}
                placeholder="Titolo"
                value={formState.values.title}
                onChange={(e) => {
                    setFormState(prev => ({
                        ...prev,
                        values: { ...prev.values, title: e.target.value },
                    }))
                }}
            />
            {formState.errors.title.map((error, i) => <p key={i} className="text-red-600 text-sm px-4">{error}</p>)}

            <input
                className={cn(
                    "bg-gray-200 rounded-full w-full py-2 px-4",
                    formState.errors.year.length > 0 && "border-2 border-red-500"
                )}
                placeholder="Anno"
                type="number"
                value={formState.values.year}
                onChange={(e) => {
                    setFormState(prev => ({
                        ...prev,
                        values: { ...prev.values, year: +e.target.value },
                    }))
                }}
            />
            {formState.errors.year.map((error, i) => <p key={i} className="text-red-600 text-sm px-4">{error}</p>)}

            {/* questi due NON inviano il form*/}
            <div className="flex gap-2">
                <Button
                    variant={formState.values.kind === 'film' ? 'primary' : 'secondary'}
                    onClick={() => setFormState(prev => ({ ...prev, values: { ...prev.values, kind: 'film' } }))}
                >
                    Film
                </Button>
                <Button
                    variant={formState.values.kind === 'serie' ? 'primary' : 'secondary'}
                    onClick={() => setFormState(prev => ({ ...prev, values: { ...prev.values, kind: 'serie' } }))}
                >
                    Serie
                </Button>
            </div>

            {/* questo invia il form (anche premendo Invio) */}
            <Button type="submit" variant="primary">Aggiungi</Button>
        </form>
    )
}

export default AddShowForm