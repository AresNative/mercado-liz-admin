import { InputFormProps } from "@/utils/constants/interfaces";
import { useState, useEffect } from "react";

export function MultipleParagraphInput(props: InputFormProps) {
  const { cuestion } = props;

  const [paragraphs, setParagraphs] = useState([
    {
      name: "0",
      valueDefined: "",
      placeholder: "Paragraph...",
      require: cuestion.require,
    },
  ]);

  // Sincronización del estado local con react-hook-form
  const handleInputChange = (index: number, value: string) => {
    const updatedParagraphs = paragraphs.map((paragraph, i) =>
      i === index ? { ...paragraph, valueDefined: value } : paragraph
    );
    setParagraphs(updatedParagraphs);
    // Actualiza el valor en react-hook-form
    props.setValue(paragraphs[index].name, value);
    // Limpiar cualquier error para este campo
    props.setError(cuestion.name, {});
  };

  const handleAddParagraph = () => {
    const newIndex = paragraphs.length;
    setParagraphs([
      ...paragraphs,
      {
        name: `${newIndex}`,
        valueDefined: "",
        placeholder: "Paragraph...",
        require: cuestion.require,
      },
    ]);
  };

  // Uso de useEffect para cargar los valores iniciales si existen
  useEffect(() => {
    if (cuestion.valueDefined) {
      const newParagraphs = cuestion.valueDefined.$values.map((text: any, key: any) => ({
        name: `${key}`,
        valueDefined: text.text,
        placeholder: "Paragraph...",
        require: cuestion.require,
      }));
      setParagraphs(newParagraphs);
    }
  }, [cuestion.valueDefined]);

  const handleRemoveParagraph = (index: number) => {
    const newParagraphs = paragraphs.filter((_, i) => i !== index);
    setParagraphs(newParagraphs);
  };

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <div key={paragraph.name} className="flex items-center space-x-2">
          <input
            placeholder={paragraph.placeholder}
            required={paragraph.require}
            value={paragraph.valueDefined}
            onChange={(e) => handleInputChange(index, e.target.value)}
            {...props.register(paragraph.name, {
              required: paragraph.require ? "The field is required." : undefined,
            })}
            className={`border p-2 rounded-md ${props.errors[paragraph.name] ? "border-red-500" : "border-gray-300"}`}
          />
          <button
            type="button"
            className="text-red-500"
            onClick={() => handleRemoveParagraph(index)}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddParagraph}
        className="mt-2 text-blue-500"
      >
        Add Paragraph
      </button>
    </div>
  );
}
