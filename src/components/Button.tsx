import type { ComponentProps } from "react";
import { cn } from "../utils/cn";

type ButtonProps = ComponentProps<'button'> & {
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger'; // primary = attivo (blu), secondary = non attivo (grigio), tertiary = con bordo, danger = rosso
    type?: 'button' | 'submit'; // submit = invia il form, button = non lo invia
    onlyIcon?: boolean;
}

const Button = ({ variant = 'secondary', type = 'button', onlyIcon, ...props }: ButtonProps) => {
    return (
        <button
            {...props}
            type={type}
            className={
                cn(
                    "h-12 enabled:cursor-pointer rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 items-center justify-center",
                    onlyIcon ? 'aspect-square' : 'px-8',
                    {
                        "bg-blue-500": variant === 'primary',
                        "bg-red-400": variant === 'danger',
                        "bg-gray-200": variant === 'secondary',
                        "border bg-gray-200": variant === 'tertiary',
                    },
                    props.className,
                )}
        >
        </button >
    )
}

export default Button