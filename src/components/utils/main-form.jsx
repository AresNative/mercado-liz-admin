"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Tel } from "./components/tel";
import { InputComponent as Input } from "./components/input";
import { Email } from "./components/email";
import { RadioComponent as Radio } from "./components/radio";
import { Number } from "./components/number";
import { DateInput } from "./components/date";
import { MonthInput } from "./components/month";
import { InputMedia } from "./components/media";
import { CheckBox } from "./components/checkbox";
import { TextArea } from "./components/textarea";
import { Password } from "./components/password";
import { SearchableSelect } from "./components/select";
import { OptionMultiple } from "./components/optionmultiple";
import { DateRangeInput } from "./components/date-range";
import { Button, Divider } from "@nextui-org/react";
import { MultipleParagraphInput } from "./components/dinamic-inputs";

import { usePostProjectsMutation, usePostSprintsMutation, usePostTasksMutation } from "@/reducers/api-reducer";
import { usePostUserLoginMutation } from "@/reducers/auth-reducer";

import { useAppDispatch } from "@/store/selector";
import { openAlertReducer } from "@/reducers/alert-reducer";
import { closeModal } from "@/reducers/modal-reducer";
import { LinkInput } from "./components/link";
import { useRouter } from "next/navigation";

export const MainForm = ({ message_button, dataForm, actionType }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
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

  const [login] = usePostUserLoginMutation();

  function getMutationFunction(actionType) {
    switch (actionType) {
      case "add-project":
        return postProjects;
      case "add-sprints":
        return postSprint;
      case "add-task":
        return postTask;
      case "login":
        return login;
      default:
        return () => {};
    }
  }

  function navigationUser(actionType) {
    switch (actionType) {
      case "login":
        return router.push('./dashboard');
      default:
        return 'no navigate';
    }
  }

  async function onSubmit(submitData) {
  setLoading(true);

  // Obtener la función de mutación basada en el tipo de acción
  const mutationFunction = getMutationFunction(actionType);

  // Manejo de alerta común
  const showAlert = (message, type) => {
    dispatch(openAlertReducer({ message, type }));
  };

  try {
    // Ejecutar la mutación y obtener datos, error y meta
    const { data, error, meta } = await mutationFunction(submitData);

    // Si hay un error, mostrar mensaje de error y terminar la función
    if (error) {
      showAlert(error.data?.message || "Error desconocido", "error");
      return; // Terminamos la ejecución si hay un error
    }

    showAlert("Operación realizada", "success");
    dispatch(closeModal({ modalName: actionType }));
    navigationUser(actionType)
  } catch (err) {
    // Si ocurre un error durante la mutación, mostrar mensaje genérico
    showAlert("Error! Algo salió mal", "error");
    console.error("Error en la mutación:", err); // Log adicional para debugging
  } finally {
    setLoading(false); // Finalmente, detener el estado de carga
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
        color="secondary"
        variant="faded"
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
    case "LINK":
      return <LinkInput {...props} />
    case "DIVIDER":
      return <Divider className="my-1" />
    default:
      return <h1>{type}</h1>;
  }
}
