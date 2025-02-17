

"use client"
import MainForm from "@/components/form/main-form";
import { openAlertReducer } from "@/hooks/reducers/drop-down";
import { useAppDispatch } from "@/hooks/selector";
import { LogInField } from "@/utils/constants/forms/logIn";
import { useRouter } from "next/navigation";

export default function FormLogin() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const getCookieExpiration = (): string => {
        const date = new Date();
        date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        return date.toUTCString();
    };

    const saveCokie = () => {
        const expires = `expires=${getCookieExpiration()}`;

        document.cookie = `auth-token=your_token_value; ${expires}; path=/; SameSite=Lax`;
        document.cookie = `user-role=user; ${expires}; path=/; SameSite=Lax`;
    }
    return (
        <section className="max-w-prose m-auto">
            <MainForm
                message_button={'Enviar'}
                actionType={"post-login"}
                dataForm={LogInField()}
                onSuccess={(result) => {

                    try {
                        const token = result.data.token;
                        if (token) {
                            dispatch(
                                openAlertReducer({
                                    title: "Inicio de sesion exitoso!",
                                    message: "Bienvenido",
                                    type: "success",
                                    icon: "archivo",
                                    duration: 5000
                                })
                            );
                            saveCokie();
                            router.push("/scrum");
                        }
                    } catch {
                        dispatch(
                            openAlertReducer({
                                title: "Correo o contraseña incorrectos!",
                                message: "Credenciales invalidas",
                                type: "error",
                                icon: "alert",
                                duration: 4000
                            })
                        );
                    }
                }}
            />
        </section>
    )
}