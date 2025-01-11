
import Image from "next/image";
import { Camera, User } from "lucide-react";
import { useCallback, useState } from "react";

export function ImgComponent() {
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
            <label className="leading-loose flex gap-2 items-center">
                <Camera className="w-4 h-4" />
                Foto de perfil
            </label>
            <div
                className="mt-1 flex flex-col gap-2 justify-center items-center"
                onDragOver={preventDefault}
                onDrop={(e) => handleFileDrop(e, 'profile')}
            >
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 border-dashed">
                    {profileImage ? (
                        <Image src={profileImage} alt="Profile" layout="fill" objectFit="cover" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <User className="w-12 h-12" />
                        </div>
                    )}
                </div>
                <input
                    id="file-upload-profile"
                    name="file-upload-profile"
                    type="file"
                    className="sr-only"
                    onChange={(e) => handleFileInput(e, 'profile')}
                    accept="image/*"
                />
                <label
                    htmlFor="file-upload-profile"
                    className=" bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                >
                    {profileImage ? 'Cambiar foto' : 'Subir foto'}
                </label>
            </div>
        </div>

    )
}