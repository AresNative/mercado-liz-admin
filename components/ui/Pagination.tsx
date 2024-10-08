const Pagination = () => {
    return (
        <div className="flex justify-center items-center mt-6">
            <button className="px-4 py-2 bg-gray-700 text-white rounded-md">
                &lt;
            </button>
            <span className="mx-4">1 de 2</span>
            <button className="px-4 py-2 bg-gray-700 text-white rounded-md">
                &gt;
            </button>
        </div>
    )
}

export default Pagination
