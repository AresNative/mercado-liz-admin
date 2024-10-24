import { useState } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@nextui-org/react";

export function OptionMultiple(props) {
  const { cuestion } = props;
  const [isAtLeastOneChecked, setIsAtLeastOneChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsAtLeastOneChecked(!isAtLeastOneChecked);
  };

  return (
    <div className="space-y-2">
      <Checkbox
        isSelected={isAtLeastOneChecked}
        onChange={handleCheckboxChange}
        required={cuestion.require}
        color={props.errors[cuestion.name] ? "error" : "default"}
        helperText={props.errors[cuestion.name]?.message}
      >
        {cuestion.placeholder}
      </Checkbox>
      {isAtLeastOneChecked &&
        cuestion.options.map((field) => (
          <motion.div
            key={field.id}
            className="space-y-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* Aquí iría la lógica para mostrar los inputs relacionados */}
          </motion.div>
        ))}
    </div>
  );
}
