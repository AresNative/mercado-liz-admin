import { useState, useEffect } from "react";
import { Input, Button } from "@nextui-org/react";

export function MultipleParagraphInput({
  register,
  errors,
  setError,
  setValue,
  cuestion,
}) {
  const [paragraphs, setParagraphs] = useState([
    {
      name: "0",
      valueDefined: "",
      placeholder: "Paragraph...",
      require: cuestion.require,
    },
  ]);

  // Añadido para sincronizar el estado local con react-hook-form
  const handleInputChange = (index, value) => {
    const updatedParagraphs = paragraphs.map((paragraph, i) =>
      i === index ? { ...paragraph, valueDefined: value } : paragraph
    );
    setError(cuestion.name, {});
    setParagraphs(updatedParagraphs);
    setValue(paragraphs[index].name, value); // Actualiza el valor en react-hook-form
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

  useEffect(() => {
    if (cuestion.valueDefined) {
      const newParagraphs = cuestion.valueDefined.$values.map((text, key) => ({
        name: `${key}`,
        valueDefined: text.text,
        placeholder: "Paragraph...",
        require: cuestion.require,
      }));
      setParagraphs([...newParagraphs]);
    }
  }, [cuestion.valueDefined]);

  const handleRemoveParagraph = (index) => {
    const newParagraphs = paragraphs.filter((_, i) => i !== index);
    setParagraphs(newParagraphs);
  };

  return (
    <div className="space-y-4">
      {paragraphs.map((cuestion, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            fullWidth
            placeholder={cuestion.placeholder}
            required={cuestion.require}
            onChange={(e) => handleInputChange(index, e.target.value)}
            {...register(cuestion.name, {
              required: cuestion.require && "The field is required.",
            })}
            helperText={errors[cuestion.name]?.message}
            color={errors[cuestion.name] ? "error" : "default"}
          />
          <Button
            auto
            flat
            color="error"
            onClick={() => handleRemoveParagraph(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button auto onClick={handleAddParagraph}>
        Add Paragraph
      </Button>
    </div>
  );
}
