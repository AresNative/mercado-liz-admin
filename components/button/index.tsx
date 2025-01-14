import { alertClasses } from "@/utils/constants/colors";
import { ButtonProps } from "@/utils/constants/interfaces";

export function Button({
    type = "submit",
    label = "Add to bag",
    color = "info",
    onClick,
}: ButtonProps) {

    const styles = alertClasses[color];
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 text-sm font-semibold float-right ${styles.text} ${styles.bg} ${styles.ring} rounded-md ${styles.hover} transition-all`}
        >
            {label}
        </button>
    );
}
