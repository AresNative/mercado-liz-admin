import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Resumen {
    title: string,
    value: any,
    subText?: any,
    icon: ReactNode
}

export default function CardResumen(props: Resumen) {
    return (
        <motion.div whileHover={{ scale: 1.02 }} className="w-full bg-white dark:bg-zinc-800 border dark:border-zinc-700 overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                        {props.icon}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-xs font-medium text-gray-500 dark:text-gray-200 truncate">{props.title}</dt>
                            <dd className="flex items-baseline">
                                <div className="text-xl text-pretty font-semibold text-gray-900 dark:text-white">{props.value}</div>
                                <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                    <span>{props.subText}</span>
                                </div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}