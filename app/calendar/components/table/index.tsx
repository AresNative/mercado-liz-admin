import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function TableDiasHoras() {
    return (
        <>
            <div className="w-full mx-auto space-y-8">
                <div className="bg-white border dark:border-zinc-700 shadow-xl rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-zinc-50">
                                <tr>


                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"

                                            >
                                                <span>Periodo</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>


                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                        colSpan={2}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">26/12/25</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                        colSpan={2}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">26/12/25</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                        colSpan={2}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">26/12/25</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                        colSpan={2}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">26/12/25</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                        colSpan={2}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">26/12/25</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>

                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                        colSpan={2}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">26/12/25</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                        colSpan={2}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">26/12/25</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                </tr>

                                <tr>


                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"

                                            >
                                                <span>Empleado</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>


                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">v1</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">v2</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">v1</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">v2</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">v1</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">v2</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">v1</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">v2</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">v1</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">v2</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">v1</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">v2</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">v1</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                                    >
                                        <div className="flex items-center space-x-1">
                                            <button
                                                className="flex items-center space-x-1 hover:text-gray-700"
                                            >
                                                <span className="felx text-center">v2</span>
                                                <ChevronDown
                                                    className={`h-4 w-4`}
                                                />
                                            </button>

                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">

                                <motion.tr
                                    className={`hover:bg-zinc-50`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >

                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ""
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ""
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ""
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ""
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ""
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ""
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ""
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ""
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ""
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ""
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ""
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ""
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ""
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ""
                                        </div>
                                    </td>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            ""
                                        </div>
                                    </td>

                                </motion.tr>

                            </tbody>
                        </table>
                    </div>
                </div>


            </div>
        </>
    )
}