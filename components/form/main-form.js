"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Tel } from "./components/tel";
import { InputComponent as Input } from "./components/input"; // Ajustado el nombre del import
import { Email } from "./components/email";
import { RadioComponent as Radio } from "./components/radio"; // Ajustado el nombre del import
import { Number } from "./components/number";
import { DateInput } from "./components/date";
import { MonthInput } from "./components/month";
import { InputMedia } from "./components/media";
import { CheckBox } from "./components/checkbox";
import { TextArea } from "./components/textarea";
import { Password } from "./components/password";
import { SearchableSelect } from "./components/select";
import { OptionMultiple } from "./components/optionmultiple";
import { Button } from "@nextui-org/react";
import { MultipleParagraphInput } from "./components/dinamic-inputs";

export const MainForm = ({ message_button, dataForm, functionForm }) => {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    clearErrors,
    register,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  async function onSubmit(submitData) {
    setLoading(true);
    try {
      const res = await functionForm({ dataForm: submitData });
      console.log(submitData, res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      {dataForm.map((field, key) => (
        <SwitchTypeInputRender
          key={key}
          cuestion={field}
          register={register}
          watch={watch}
          clearErrors={clearErrors}
          setError={setError}
          errors={errors}
          setValue={setValue}
        />
      ))}
      <section>
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : message_button}
        </Button>
      </section>
    </form>
  );
};

export function SwitchTypeInputRender(props) {
  const { type } = props.cuestion;
  switch (type) {
    case "TEL":
      return <Tel {...props} />;
    case "INPUT":
      return <Input {...props} />;
    case "MEDIA":
      return <InputMedia {...props} />;
    case "DATE":
      return <DateInput {...props} />;
    case "MONTH":
      return <MonthInput {...props} />;
    case "EMAIL":
      return <Email {...props} />;
    case "NUMBER":
      return <Number {...props} />;
    case "CHECKBOX":
      return <CheckBox {...props} />;
    case "RADIO":
      return <Radio {...props} />;
    case "OPTIONMULTIPLE":
      return <OptionMultiple {...props} />;
    case "SELECT":
      return <SearchableSelect {...props} />;
    case "PASSWORD":
      return <Password {...props} />;
    case "TEXTAREA":
      return <TextArea {...props} />;
    case "DINAMIC":
      return <MultipleParagraphInput {...props} />;
    default:
      return <h1>{type}</h1>;
  }
}
