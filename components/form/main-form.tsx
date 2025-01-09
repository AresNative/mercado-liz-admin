"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { InputComponent as Input } from "./input";

import { usePostProjectsMutation, usePostSprintsMutation, usePostTasksMutation } from "@/hooks/reducers/api";
import { useAppDispatch } from "@/hooks/selector";

interface Field {
  type: string;
  name: string;
  label?: string;
  placeholder?: string;
  // Puedes agregar otros campos según tu necesidad
}


interface MainFormProps {
  message_button: string;
  dataForm: Field[];
  actionType: "add-project" | "add-sprints" | "add-task";
}

export const MainForm = ({ message_button, dataForm, actionType }: MainFormProps) => {

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

  function getMutationFunction(actionType: string) {
    switch (actionType) {
      case "add-project":
        return postProjects;
      case "add-sprints":
        return postSprint;
      case "add-task":
        return postTask;
      default:
        return () => { }; // Retorna una función vacía para manejar el caso predeterminado
    }
  }

  async function onSubmit(submitData: any) {

    setLoading(true);
    const mutationFunction = getMutationFunction(actionType);
    try {
      await mutationFunction(submitData);

      /* dispatch(
        openAlertReducer({
          message: "Éxito! Operación realizada",
          type: "success", //? "info" |  "success" | "warning" | "error"
        })
      ); */

      /* dispatch(closeModal({ modalName: actionType })); */
    } catch (error) {
      console.error("Error en el envío del formulario:", error);
      /* dispatch(
        openAlertReducer({
          message: "Error! Algo salió mal",
          type: "error",
        })
      ); */
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <button
        type="submit"
        disabled={loading}
        aria-label="boton formulario dinamico"
      >
        {loading ? "Loading..." : message_button}
      </button>
    </form>
  );
};

export function SwitchTypeInputRender(props: any) {
  const { type } = props.cuestion;
  switch (type) {
    case "INPUT":
      return <Input {...props} />;
    default:
      return <h1>{type}</h1>;
  }
}
