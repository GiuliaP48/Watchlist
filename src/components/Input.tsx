import { cn } from "../utils/cn";

type InputProps = {
    placeholder: string;
    value: string | number;
    onChange: (valore: string) => void; // riceve il testo scritto dall'utente
    type?: string; // che tipo di campo è: "number" per l'anno; senza, è un campo di testo
    errors?: string[]; // i messaggi di errore di questo campo: se ce n'è almeno uno, bordo rosso e messaggi sotto
};

const Input = ({ placeholder, value, onChange, type, errors }: InputProps) => {
    return (
        <div>
            <input
                // bordo rosso solo se c'è almeno un errore
                className={cn(
                    "bg-gray-200 rounded-full w-full py-2 px-4",
                    errors && errors.length > 0 && "border-2 border-red-500"
                )}
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {/* mostro tutti gli errori del campo, uno sotto l'altro */}
            {errors?.map((error, i) => <p key={i} className="text-red-600 text-sm mt-1 px-4">{error}</p>)}
        </div>
    )
}

export default Input