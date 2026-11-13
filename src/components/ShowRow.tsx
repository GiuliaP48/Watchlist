
import type { Show } from "../data/watchlist";
import { cn } from "../utils/cn";

// ShowProps --> proprietà che passo alla funzione ShowRow
type ShowProps = {
    show: Show;
    onClick?: () => void;
    active?: boolean;
    onToggleSeen?: () => void; // la funzione che parte quando clicco la casella "Visto": me la passa App
}

const ShowRow = ({ show, onClick, active, onToggleSeen }: ShowProps) => {
    return (
        <div
            className={cn(
                "flex items-center justify-between p-4 rounded-xl border border-gray-300 gap-4",
                active && "border-2 border-blue-500 bg-blue-50"
            )}
        >
            {/* cliccando titolo e anno scelgo cosa guardare stasera */}
            <div onClick={onClick} className="flex-1 cursor-pointer">
                {/* se l'ho visto, il titolo è barrato e grigio */}
                <p className={cn("font-bold", show.seen && "line-through text-gray-400")}>{show.title}</p>
                <p className="text-gray-500">{show.year}</p>
            </div>

            <div className="flex items-center gap-3">
                {/* casella "Visto" */}
                <div className="flex items-center gap-1 text-sm">
                    <input type="checkbox" checked={show.seen === true} onChange={onToggleSeen} />
                    <span>Visto</span>
                </div>

                {/* badge */}
                <span
                    className={cn(
                        "px-3 py-1 rounded-full text-sm font-semibold",
                        show.kind === 'film' ? "bg-yellow-100 text-yellow-800" : "bg-purple-100 text-purple-800"
                    )}
                >
                    {show.kind === 'film' ? "Film" : "Serie"}
                </span>
            </div>
        </div>
    )
}

export default ShowRow