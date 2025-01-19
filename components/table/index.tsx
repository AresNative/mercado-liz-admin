import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

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
    return (
        <div className="rounded-lg border bg-white shadow">
            <div className="relative w-full overflow-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left font-medium text-gray-500">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    checked={selectedRows.length === data.length}
                                    onChange={() =>
                                        setSelectedRows(
                                            selectedRows.length === data.length
                                                ? []
                                                : data.map(item => item.id)
                                        )
                                    }
                                />
                            </th>
                            {Object.entries(visibleColumns).map(
                                ([column, isVisible]) =>
                                    isVisible && (
                                        <th
                                            key={column}
                                            className="p-4 text-left font-medium text-gray-500"
                                        >
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="flex items-center gap-2 hover:text-gray-700"
                                                    onClick={() => toggleSort(column as keyof DataItem)}
                                                >
                                                    <span className="capitalize">{column.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                    {sortColumn === column && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setShowColumnMenu(showColumnMenu === column ? null : column)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                        </svg>
                                                    </button>
                                                    <AnimatePresence>
                                                        {showColumnMenu === column && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                                                            >
                                                                <div className="py-1">
                                                                    <button
                                                                        onClick={() => toggleColumn(column as keyof typeof visibleColumns)}
                                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                                    >
                                                                        {isVisible ? 'Hide column' : 'Show column'}
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </th>
                                    )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedData.map(item => (
                            <motion.tr
                                key={item.id}
                                className={`border-t transition-colors hover:bg-gray-50 ${selectedRows.includes(item.id) ? 'bg-blue-50' : ''
                                    }`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300"
                                        checked={selectedRows.includes(item.id)}
                                        onChange={() => toggleRowSelection(item.id)}
                                    />
                                </td>
                                {visibleColumns.name && (
                                    <td className="p-4 font-medium">{item.name}</td>
                                )}
                                {visibleColumns.email && (
                                    <td className="p-4 text-gray-500">{item.email}</td>
                                )}
                                {visibleColumns.status && (
                                    <td className="p-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                )}
                                {visibleColumns.role && (
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {item.role}
                                        </span>
                                    </td>
                                )}
                                {visibleColumns.lastActive && (
                                    <td className="p-4 text-gray-500">
                                        {item.lastActive}
                                    </td>
                                )}
                                {visibleColumns.date && (
                                    <td className="p-4 text-gray-500">
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