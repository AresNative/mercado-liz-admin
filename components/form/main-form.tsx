"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { MainFormProps } from "@/utils/constants/interfaces";

import { InputComponent as Input } from "./input";
import { MailComponent as Mail } from "./mail";
import { PhoneComponent as Phone } from "./phone";
import { TextAreaComponent as TextArea } from "./text-area";

import { SelectComponent as Select } from "./select";
import { CheckboxComponent as Checkbox } from "./checkbox";
import { CheckboxGroupComponent as CheckboxGroup } from "./checkbox-group";

import { CalendarComponent as Calendar } from "./calendar";
import { DateRangeComponent as DateRange } from "./date-range";

import { FileComponent as File } from "./file";
import { ImgComponent as Image } from "./img";

import { Button } from "../button";

import { usePostProjectsMutation, usePostSprintsMutation, usePostTasksMutation } from "@/hooks/reducers/api";
import { map } from "framer-motion/client";


//import { useAppDispatch } from "@/hooks/selector";

export const MainForm = ({ message_button, dataForm, actionType }: MainFormProps) => {

  //const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    clearErrors,
    register,
    setError,
    watch,
    setValue,
    control,
    getValues,
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
        return () => { };
    }
  }

  async function onSubmit(submitData: any) {
    console.log(submitData);

    setLoading(true);
    //const mutationFunction = getMutationFunction(actionType);
    try {
      //await mutationFunction(submitData);

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 max-w-prose m-auto">
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
          getValues={getValues}
          setValue={setValue}
        />
      ))}
      <Button
        color="success"
        type="submit"
        label={loading ? "Loading..." : message_button}
      />
    </form>
  );
};

export function SwitchTypeInputRender(props: any) {
  const { type } = props.cuestion;
  switch (type) {
    case "INPUT":
      return <Input {...props} />;
    case "PHONE":
      return <Phone {...props} />;
    case "TEXT_AREA":
      return <TextArea {...props} />;
    case "MAIL":
      return <Mail {...props} />;
    case "SELECT":
      return <Select {...props} />;
    case "DATE":
      return <Calendar {...props} />;
    case "DATE_RANGE":
      return <DateRange {...props} />;
    case "CHECKBOX":
      return <Checkbox {...props} />;
    case "CHECKBOX_GROUP":
      return <CheckboxGroup {...props} />;
    case "FILE":
      return <File {...props} />;
    case "IMG":
      return <Image {...props} />;
    /* case "Flex":
      return <section className="flex flex-wrap gap-4 justify-start">
        {props.elements?.map((child: any, key: any) => (
          <SwitchTypeInputRender
            key={key}
            {...child}
          />
        ))}
      </section> */
    default:
      return <h1>{type}</h1>;
  }
}

export default MainForm;