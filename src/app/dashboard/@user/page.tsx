import Box from "@/components/ui/template/box";
const UserPage = () => {
    return (
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
    );
};

export default UserPage;
