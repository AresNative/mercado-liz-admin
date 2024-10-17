"use client";
import { useRef, useState } from "react";

export function InputMedia(props) {
  const { cuestion } = props;

  const [selectedFileName, setSelectedFileName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      setSelectedFileName(imageFile.name); // Mostramos solo el nombre del archivo
      props.setValue(cuestion.name, imageFile);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!selectedFileName) {
      setIsFocused(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFileName(""); // Reseteamos el nombre del archivo
    fileInputRef.current.value = null; // Limpiamos el valor del input file
    props.setValue(cuestion.name, null); // Actualizamos el estado en el padre
  };

  return (
    <div className="relative mb-6">
      <input
        id={cuestion.id}
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="image/*"
        required={cuestion.required}
        onChange={handleInputChange}
      />

      <label className="block">
        <div className="flex items-center mt-2 space-x-2">
          <strong
            className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
            onClick={handleButtonClick}
          >
            Choose File
          </strong>
          <div className="relative flex-grow ml-4">
            <input
              required={cuestion.required}
              type="text"
              value={selectedFileName} // Mostramos solo el nombre del archivo
              className="w-full p-2 border border-gray-300 rounded bg-transparent focus:outline-none focus:border-blue-500"
              readOnly
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <label
              className={`absolute left-2 top-1 text-gray-500 text-sm transition-all duration-200 transform ${
                isFocused || selectedFileName
                  ? "-translate-y-6 text-xs text-blue-500"
                  : "translate-y-2"
              }`}
            >
              {cuestion.placeholder}
            </label>
          </div>
          {selectedFileName && (
            <button
              type="button"
              className="ml-4 bg-red-500 text-white py-2 px-4 rounded cursor-pointer"
              onClick={handleRemoveFile}
            >
              Remove File
            </button>
          )}
        </div>
      </label>
      {props.errors[cuestion.name] && props.errors[cuestion.name].message && (
        <div className="text-red-500 text-sm mt-1">
          <span>{props.errors[cuestion.name].message}</span>
        </div>
      )}
    </div>
  );
}
