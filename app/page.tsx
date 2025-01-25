"use client"
import MainForm from "@/components/form/main-form";
import Providers from "@/hooks/provider";
/* import Badge from "@/components/badge"; */
import Layout from "@/templates/layout";
//
import { LogInField } from "@/utils/constants/forms/logIn";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <Layout>
      <Providers>
        <MainForm
          message_button={'Enviar'}
          actionType={"post-login"}
          dataForm={LogInField()}
          action={() => router.push("/scrum")}
        />
      </Providers>
    </Layout>
  )
}
