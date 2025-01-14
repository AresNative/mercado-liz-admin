import { ChevronDown, Plus } from "lucide-react";

interface DetailsProps {
    title: string;
    description?: string;
    type?: string;
    children?: React.ReactNode;
}
export default function Details({ title, description, type, children }: DetailsProps) {

    if (type === 'form') {
        return (
            <details className="mt-4 mb-4 border rounded-lg overflow-hidden group">
                <summary className="w-full text-left p-4 flex justify-between items-center bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                    <span className="text-sm font-medium text-blue-700">{title}</span>
                    <Plus className="h-5 w-5 text-blue-500 transition-transform group-open:rotate-45" />
                </summary>
                <div className="p-4 bg-white">
                    {children}
                </div>
            </details>
        )
    }

    return (
        <details className="mb-2 mt-2 border rounded-lg overflow-hidden group">
            <summary className="w-full text-left p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <span className="text-sm font-medium text-gray-700">{title}</span>
                <ChevronDown className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180" />
            </summary>
            <div className="p-4 bg-white">
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </details>
    );
}