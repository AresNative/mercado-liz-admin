import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, MoreVertical } from "lucide-react"
import { useMemo, useState } from "react"

type DataItem = {
    id: number
    name: string
    email: string
    status: 'active' | 'inactive'
    role: string
    lastActive: string
    date: Date
}

const initialData: DataItem[] = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        status: 'active',
        role: 'Admin',
        lastActive: '3 minutes ago',
        date: new Date(2024, 0, 15)
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        status: 'inactive',
        role: 'User',
        lastActive: '2 hours ago',
        date: new Date(2024, 0, 16)
    },
    {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        status: 'active',
        role: 'Editor',
        lastActive: '1 day ago',
        date: new Date(2024, 0, 17)
    },
    {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        status: 'active',
        role: 'User',
        lastActive: '5 minutes ago',
        date: new Date(2024, 0, 18)
    },
    {
        id: 5,
        name: 'Mike Brown',
        email: 'mike@example.com',
        status: 'inactive',
        role: 'Editor',
        lastActive: '1 week ago',
        date: new Date(2024, 0, 19)
    },
]

export default function Table() {
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [sortColumn, setSortColumn] = useState<keyof DataItem | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [searchQuery, setSearchQuery] = useState('')

    const [showColumnMenu, setShowColumnMenu] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5


    const [data] = useState<DataItem[]>(initialData)

    const [visibleColumns, setVisibleColumns] = useState({
        name: true,
        email: true,
        status: true,
        role: true,
        lastActive: true,
        date: true,
    })

    const [dateRange, setDateRange] = useState<{
        from: Date | undefined
        to: Date | undefined
    }>({
        from: undefined,
        to: undefined,
    })

    const toggleColumn = (column: keyof typeof visibleColumns) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }))
    }

    const toggleRowSelection = (id: number) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        )
    }

    const toggleSort = (column: keyof DataItem) => {
        if (sortColumn === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }
    const filteredAndSortedData = [...data]
        .filter(item => {
            const matchesSearch = Object.values(item).some(
                value =>
                    value.toString()
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            )

            const matchesDateRange =
                (!dateRange.from || item.date >= dateRange.from) &&
                (!dateRange.to || item.date <= dateRange.to)

            return matchesSearch && matchesDateRange
        })
        .sort((a, b) => {
            if (!sortColumn) return 0
            if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
            if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
            return 0
        })

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredAndSortedData, currentPage])
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    checked={selectedRows.length === data.length}
                                    onChange={() =>
                                        setSelectedRows(selectedRows.length === data.length ? [] : data.map((item) => item.id))
                                    }
                                />
                            </th>
                            {Object.entries(visibleColumns).map(
                                ([column, isVisible]) =>
                                    isVisible && (
                                        <th
                                            key={column}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            <div className="flex items-center space-x-1">
                                                <button
                                                    className="flex items-center space-x-1 hover:text-gray-700"
                                                    onClick={() => toggleSort(column as keyof DataItem)}
                                                >
                                                    <span>{column.replace(/([A-Z])/g, " $1").trim()}</span>
                                                    <ChevronDown
                                                        className={`h-4 w-4 ${sortColumn === column ? (sortDirection === "asc" ? "transform rotate-180" : "") : ""}`}
                                                    />
                                                </button>
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setShowColumnMenu(showColumnMenu === column ? null : column)}
                                                        className="p-1 hover:bg-gray-100 rounded-full"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                    <AnimatePresence>
                                                        {showColumnMenu === column && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5"
                                                            >
                                                                <div className="py-1">
                                                                    <button
                                                                        onClick={() => toggleColumn(column as keyof typeof visibleColumns)}
                                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                    >
                                                                        {isVisible ? "Hide column" : "Show column"}
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </th>
                                    ),
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((item) => (
                            <motion.tr
                                key={item.id}
                                className={`${selectedRows.includes(item.id) ? "bg-blue-50" : ""} hover:bg-gray-50`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                        checked={selectedRows.includes(item.id)}
                                        onChange={() => toggleRowSelection(item.id)}
                                    />
                                </td>
                                {visibleColumns.name && (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                    </td>
                                )}
                                {visibleColumns.email && (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{item.email}</div>
                                    </td>
                                )}
                                {visibleColumns.status && (
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                )}
                                {visibleColumns.role && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.role}</td>
                                )}
                                {visibleColumns.lastActive && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.lastActive}</td>
                                )}
                                {visibleColumns.date && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.date.toLocaleDateString()}
                                    </td>
                                )}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
} 