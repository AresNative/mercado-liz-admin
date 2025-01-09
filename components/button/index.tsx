import { ButtonProps } from "@/utils/constants/interfaces";

export function Button({
    type = "submit",
    label = "Add to bag",
    size = "text-base",
    color = "indigo",
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-${color}-600 px-8 py-3 ${size} font-medium text-white hover:bg-${color}-700 focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2`}
        >
            {label}
        </button>
    );
}
