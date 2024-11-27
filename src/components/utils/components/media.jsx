import { useRef, useState } from "react";
import { Input, Button } from "@nextui-org/react";

export function InputMedia(props) {
  const { cuestion } = props;
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      props.setValue(cuestion.name, file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFileName("");
    fileInputRef.current.value = null;
    props.setValue(cuestion.name, null);
  };

  return (
    <div className="flex items-center space-x-4">
      <Button auto onClick={handleButtonClick}>
        Choose File
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
      <Input
        fullWidth
        readOnly
        value={selectedFileName}
        placeholder={cuestion.placeholder}
      />
      {selectedFileName && (
        <Button auto flat color="error" onClick={handleRemoveFile}>
          Remove
        </Button>
      )}
      {props.errors[cuestion.name] && props.errors[cuestion.name].message && (
        <span className="text-red-400 p-1">
          {props.errors[cuestion.name].message}
        </span>
      )}
    </div>
  );
}
