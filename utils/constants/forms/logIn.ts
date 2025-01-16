import { Field } from "../interfaces";

export function LogInField(): Field[] {
  return [
    {
      type: "Flex",
      name: "flex",
      label: "Flex",
      require: false,
      elements: [
        {
          id: 0,
          type: "MAIL",
          name: "email",
          label: "Correo",
          placeholder: "example@mercadosliz.com",
          require: false,
        },
        {
          id: 1,
          type: "PASSWORD",
          name: "password",
          label: "Contraseña",
          placeholder: "UseExample@123",
          require: true,
        },
      ],
    },
  ];
}
