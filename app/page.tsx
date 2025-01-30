"use client"
import MainForm from "@/components/form/main-form";
import Providers from "@/hooks/provider";
import Layout from "@/templates/layout";
import { LogInField } from "@/utils/constants/forms/logIn";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

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
    <Layout>
      <Providers>
        <section className="max-w-prose m-auto">
          <MainForm
            message_button={'Enviar'}
            actionType={"post-login"}
            dataForm={LogInField()}
            action={() => {
              saveCokie();
              router.push("/scrum");
            }}
          />
        </section>
      </Providers>
    </Layout>
  )
}
