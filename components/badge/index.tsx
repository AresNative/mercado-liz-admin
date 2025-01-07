interface BadgeProps {
    color: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'indigo' | 'pink' | 'gray' | 'black' | 'white';
    text: string;
}

const colorClasses = {
    green: {
        bg: "bg-green-50",
        text: "text-green-600",
        ring: "ring-green-500/10",
    },
    red: {
        bg: "bg-red-50",
        text: "text-red-600",
        ring: "ring-red-500/10",
    },
    yellow: {
        bg: "bg-yellow-50",
        text: "text-yellow-600",
        ring: "ring-yellow-500/10",
    },
    blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        ring: "ring-blue-500/10",
    },
    purple: {
        bg: "bg-purple-50",
        text: "text-purple-600",
        ring: "ring-purple-500/10",
    },
    indigo: {
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        ring: "ring-indigo-500/10",
    },
    pink: {
        bg: "bg-pink-50",
        text: "text-pink-600",
        ring: "ring-pink-500/10",
    },
    gray: {
        bg: "bg-gray-50",
        text: "text-gray-600",
        ring: "ring-gray-500/10",
    },
    black: {
        bg: "bg-black",
        text: "text-white",
        ring: "ring-black/10",
    },
    white: {
        bg: "bg-white",
        text: "text-gray-900",
        ring: "ring-gray-300/10",
    },
};

export default function Badge(props: BadgeProps) {
    const { color, text } = props;
    const styles = colorClasses[color];

    return (
        <span
            className={`inline-flex items-center rounded-md ${styles.bg} px-2 py-1 text-xs font-medium ${styles.text} ring-1 ring-inset ${styles.ring}`}
        >
            {text}
        </span>
    );
}
