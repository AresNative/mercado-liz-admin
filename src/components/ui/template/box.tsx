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
            className={`flex w-full items-center justify-center rounded ${isColSpanTwo ? "col-span-2" : ""
                }`}
            style={{ minHeight: height, maxHeight: "auto" }}
        >
            <section className="p-2 text-xs overflow-hidden">
                {renderContent}
            </section>
        </div>
    );
};

export default Box;
