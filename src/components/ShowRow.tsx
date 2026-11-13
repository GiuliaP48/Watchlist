
import type { Show } from "../data/watchlist";
import { cn } from "../utils/cn";

// ShowProps --> proprietà che passo alla funzione ShowRow
type ShowProps = {
    show: Show;
    onClick?: () => void;
    active?: boolean;
}

const ShowRow = ({ show, onClick, active }: ShowProps) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center justify-between p-4 rounded-xl border border-gray-300 cursor-pointer",
                active && "border-2 border-blue-500 bg-blue-50"
            )}
        >
            <div>
                <p className="font-bold">{show.title}</p>
                <p className="text-gray-500">{show.year}</p>
            </div>

            {/* badge*/}
            <span
                className={cn(
                    "px-3 py-1 rounded-full text-sm font-semibold",
                    show.kind === 'film' ? "bg-yellow-100 text-yellow-800" : "bg-purple-100 text-purple-800"
                )}
            >
                {show.kind === 'film' ? "Film" : "Serie"}
            </span>
        </div>
    )
}

export default ShowRow