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
        <motion.div whileHover={{ scale: 1.02 }} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                        {props.icon}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{props.title}</dt>
                            <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">{props.value}</div>
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