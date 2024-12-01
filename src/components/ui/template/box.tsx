import { ReactNode } from "react";

interface BoxProps {
    height?: string;
    colSpan?: number;
    children?: ReactNode;
}

const Box: React.FC<BoxProps> = ({ height = "auto", colSpan = 1, children = null }) => {
    const isColSpanTwo = colSpan === 2;

    const renderContent = children || (
        <svg
            className="w-3.5 h-3.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 1v16M1 9h16"
            />
        </svg>
    );

    return (
        <div
            className={`flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800 ${isColSpanTwo ? "col-span-2" : ""
                }`}
            style={{ minHeight: height, maxHeight: "auto" }}
        >
            <section className="text-gray-400 dark:text-gray-500 p-4 text-xs overflow-hidden">
                {renderContent}
            </section>
        </div>
    );
};

export default Box;
