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

import { usePostProjectsMutation, usePostSprintsMutation, usePostTasksMutation } from "@/reducers/api-reducer";
import { useAppDispatch } from "@/store/selector";
import { openAlertReducer } from "@/reducers/alert-reducer";
import { closeModal } from "@/reducers/modal-reducer";
import { DateRangeInput } from "./components/date-range";

export const MainForm = ({ message_button, dataForm, actionType }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    clearErrors,
    register,
    setError,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const [postProjects] = usePostProjectsMutation();
  const [postSprint] = usePostSprintsMutation();
  const [postTask] = usePostTasksMutation();

  function getMutationFunction(actionType) {
    switch (actionType) {
      case "add-project":
        return postProjects;
      case "add-sprints":
        return postSprint;
      case "add-task":
        return postTask;
      default:
        return () => {}; // Retorna una función vacía para manejar el caso predeterminado
    }
  }

  async function onSubmit(submitData) {
    
    setLoading(true);
    const mutationFunction = getMutationFunction(actionType);
    try {
      await mutationFunction(submitData);

      dispatch(
        openAlertReducer({
          message: "Éxito! Operación realizada",
          type: "success", //? "info" |  "success" | "warning" | "error"
        })
      );

      dispatch(closeModal({ modalName: actionType }));
    } catch (error) {
      console.error("Error en el envío del formulario:", error);
      dispatch(
        openAlertReducer({
          message: "Error! Algo salió mal",
          type: "error",
        })
      );
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
          control={control}
          register={register}
          watch={watch}
          clearErrors={clearErrors}
          setError={setError}
          errors={errors}
          setValue={setValue}
        />
      ))}
      <Button
        type="submit"
        isLoading={loading}
        aria-label="boton formulario dinamico"
      >
        {loading ? "Loading..." : message_button}
      </Button>
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
    case "DATERANGE":
      return <DateRangeInput {...props} />;
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
