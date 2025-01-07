import { InputFormProps } from "@/utils/constants/interfaces";

export function TextArea(props: InputFormProps) {
  const { cuestion } = props;

  const handleInputChange = (event: React.ChangeEvent<any>) => {
    props.setError(cuestion.name, {});
    props.setValue(cuestion.name, event.target.value);
  };

  return (
    <div className="space-y-2">
      <textarea

        placeholder={cuestion.placeholder}
        value={cuestion.valueDefined}
        required={cuestion.require}
        onChange={handleInputChange}
        {...props.register(cuestion.name, {
          required: cuestion.require ? "The field is required." : undefined,
        })}
      />
    </div>
  );
}
