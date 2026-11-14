import { useState } from "react";
import Button from "./Button";
import type { Show } from "../data/watchlist";
import Input from "./Input";

// il form non conosce la lista: restituisce ad App il titolo nuovo SENZA id
type AddShowFormProps = {
    onSubmit?: (data: Omit<Show, 'id'>) => void;
    existingTitles: string[]; // i titoli già nella lista, solo per controllare i doppioni
    editingShow?: Show; // il titolo che sto modificando: se c'è, il form parte già riempito e il bottone dice "Salva"
    onCancel?: () => void; // la funzione che parte quando clicco "Annulla": me la passa App
}

// i valori del form: uno Show senza id
type Values = Omit<Show, 'id'>;

// un solo stato: valori ed errori insieme e se il form è già stato inviato
const defaultState = {
    values: {
        title: "",
        year: 0,
        kind: 'film',
    } as Values,
    errors: {
        title: [] as string[],
        year: [] as string[],
    },
    submitted: false, // diventa true al primo invio: da lì gli errori si aggiornano a ogni tasto
}

const AddShowForm = ({ onSubmit, existingTitles, editingShow, onCancel }: AddShowFormProps) => {
    const [formState, setFormState] = useState({
        ...defaultState,
        // se sto modificando parto con i valori di quel titolo, altrimenti con il form vuoto
        values: editingShow ? { title: editingShow.title, year: editingShow.year, kind: editingShow.kind } : defaultState.values,
    });

    // controlla i valori e restituisce gli errori di ogni campo
    // la uso sia all'invio sia mentre si scrive
    function validate(values: Values) {
        // costruisco gli errori in una variabile e alla fine li restituisco (return)
        let errors = { ...defaultState.errors };

        // uso trim() per togliere gli spazi all'inizio e alla fine: così un titolo fatto solo di spazi conta come vuoto
        const title = values.title.trim();
        const annoCorrente = new Date().getFullYear(); // l'anno di oggi, non scritto a mano

        // TITOLO
        if (!title) {
            errors = { ...errors, title: ['Il titolo è obbligatorio'] };
        } else {
            if (title.length < 2) {
                errors = {
                    ...errors,
                    title: Array.from(new Set([...errors.title, 'Inserisci almeno 2 caratteri']))
                }
            }
            // confronto in minuscolo, così "inception" e "Inception" sono lo stesso titolo
            if (existingTitles.some(t => t.toLowerCase() === title.toLowerCase())) {
                errors = {
                    ...errors,
                    title: Array.from(new Set([...errors.title, 'Questo titolo è già nella lista']))
                }
            }
        }

        // ANNO
        if (values.year < 1900 || values.year > annoCorrente) {
            errors = { ...errors, year: [`L'anno deve essere tra il 1900 e il ${annoCorrente}`] };
        }
        return errors;
    }

    // una sola funzione per aggiornare qualsiasi campo: riceve tutti i valori del form, già aggiornati
    function updateField(values: Values) {
        setFormState(prev => ({
            ...prev,
            values,
            // prima del primo invio non mostro errori, dopo li ricalcolo a ogni modifica
            errors: prev.submitted ? validate(values) : prev.errors,
        }))
    }

    function addShow(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault(); // la pagina non si ricarica

        const errors = validate(formState.values);

        // se almeno un campo ha errori, li mostro e mi fermo
        // submitted: true --> da adesso gli errori si aggiornano mentre si scrive
        if (Object.values(errors).some(arr => arr.length)) {
            setFormState(prev => ({ ...prev, errors, submitted: true }));
            return;
        }

        // reset del form e passo i dati ad App
        setFormState(defaultState);
        onSubmit?.({ ...formState.values, title: formState.values.title.trim() });
    }

    return (
        <form onSubmit={addShow} className="flex flex-col gap-3">
            <h2 className="font-bold text-2xl mt-10 mb-1">{editingShow ? 'Modifica un titolo' : 'Aggiungi un titolo'}</h2>
            <Input
                placeholder="Titolo"
                value={formState.values.title}
                onChange={(valore) => updateField({ ...formState.values, title: valore })}
                errors={formState.errors.title}
            />

            <Input
                placeholder="Anno"
                type="number"
                value={formState.values.year}
                onChange={(valore) => updateField({ ...formState.values, year: +valore })}
                errors={formState.errors.year}
            />

            {/* questi due NON inviano il form*/}
            <div className="flex gap-2">
                <Button
                    variant={formState.values.kind === 'film' ? 'primary' : 'secondary'}
                    onClick={() => updateField({ ...formState.values, kind: 'film' })}
                >
                    Film
                </Button>
                <Button
                    variant={formState.values.kind === 'serie' ? 'primary' : 'secondary'}
                    onClick={() => updateField({ ...formState.values, kind: 'serie' })}
                >
                    Serie
                </Button>
            </div>

            {/* questo invia o salva il form (anche premendo Invio) */}
            <Button type="submit" variant="primary">{editingShow ? 'Salva' : 'Aggiungi'}</Button>

            {/* Annulla: solo quando modifico, NON invia il form */}
            {editingShow && <Button onClick={onCancel}>Annulla</Button>}
        </form>
    )
}

export default AddShowForm