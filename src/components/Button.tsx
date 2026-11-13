import { cn } from "../utils/cn";

type ButtonProps = {
    children: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';  // primary = attivo (blu), secondary = non attivo (grigio)
    type?: 'button' | 'submit';         // submit = invia il form, button = non lo invia
}

const Button = ({ children, onClick, variant = 'secondary', type = 'button' }: ButtonProps) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={cn(
                "w-fit px-5 py-2 rounded-full font-medium cursor-pointer",
                variant === 'primary' ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
            )}
        >
            {children}
        </button>
    )
}

export default Button