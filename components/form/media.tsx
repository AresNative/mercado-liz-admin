import { InputMediaProps } from "@/utils/constants/interfaces";
import { FolderArchive } from "lucide-react";
import { useRef, useState } from "react";


export function InputMedia(props: InputMediaProps) {
  const { cuestion } = props;
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFileName(file.name);
      props.setValue(cuestion.name, file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      props.setValue(cuestion.name, file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    props.setValue(cuestion.name, null);
  };

  return (
    <div className="space-y-2">
      <div
        className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center text-gray-500 hover:bg-gray-100"
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={cuestion.accept || "image/*"}
          className="hidden"
          onChange={handleInputChange}
        />
        {selectedFileName ? (
          <>
            <p className="text-sm">{selectedFileName}</p>
            <button
              type="button"
              className="mt-2 rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
              onClick={handleRemoveFile}
            >
              Remove File
            </button>
          </>
        ) : (
          <>
            <FolderArchive />
            <p className="text-sm">Drag & drop a file here, or click to select one</p>
          </>
        )}
      </div>

      {props.errors[cuestion.name]?.message && (
        <span className="text-red-400 p-1">
          {props.errors[cuestion.name]!.message}
        </span>
      )}
    </div>
  );
}
