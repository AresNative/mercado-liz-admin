const Box = ({ height = "", colSpan = 1 }) => {
    return (
        <div
            className={`flex items-center justify-center rounded bg-gray-50 dark:bg-gray-800 ${colSpan === 2 ? "col-span-2" : ""
                }`}
            style={{ height }}
        >
            <p className="text-2xl text-gray-400 dark:text-gray-500">
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
            </p>
        </div>
    );
};

const UserPage = () => {
    return (
        <div className="p-4">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {[...Array(3)].map((_, i) => (
                        <Box key={i} height="6rem" />
                    ))}
                </div>
                <Box height="12rem" colSpan={2} />
                <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
                    {[...Array(4)].map((_, i) => (
                        <Box key={i} height="7rem" />
                    ))}
                </div>
                <Box height="12rem" colSpan={2} />
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {[...Array(4)].map((_, i) => (
                        <Box key={i} height="7rem" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserPage;
