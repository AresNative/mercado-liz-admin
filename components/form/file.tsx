import { Files, FileStack } from "lucide-react";
import { useCallback, useState } from "react";

export function FileComponent() {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);

    const handleFileDrop = useCallback((event: React.DragEvent<HTMLDivElement>, type: 'profile' | 'documents') => {
        event.preventDefault();
        event.stopPropagation();

        const files = Array.from(event.dataTransfer.files);

        if (type === 'profile' && files[0] && files[0].type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(files[0]);
        } else if (type === 'documents') {
            setDocuments(prev => [...prev, ...files]);
        }
    }, []);

    const preventDefault = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'documents') => {
        const files = Array.from(event.target.files || []);

        if (type === 'profile' && files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(files[0]);
        } else if (type === 'documents') {
            setDocuments(prev => [...prev, ...files]);
        }
    }, []);
    return (
        <div className="flex flex-col">
            <label className="leading-loose flex gap-2 items-center"> <Files className="w-4 h-4" /> Documentos adicionales</label>
            <div
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                onDragOver={preventDefault}
                onDrop={(e) => handleFileDrop(e, 'documents')}
            >
                <div className="space-y-1 text-center">
                    {documents.length === 0 ? (
                        <FileStack className="mx-auto h-12 w-12 text-gray-400" />
                    ) : (
                        <div className="text-sm text-gray-600">
                            {documents.map((file, index) => (
                                <p key={index} className="truncate">{file.name}</p>
                            ))}
                        </div>
                    )}
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload-docs" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>{documents.length === 0 ? 'Subir archivos' : 'Cambiar archivos'}</span>
                            <input id="file-upload-docs" name="file-upload-docs" type="file" className="sr-only" onChange={(e) => handleFileInput(e, 'documents')} multiple />
                        </label>
                        <p className="pl-1">o arrastrar y soltar</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF hasta 10MB</p>
                </div>
            </div>
        </div>
    )
}