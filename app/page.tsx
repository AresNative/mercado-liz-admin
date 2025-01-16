import MainForm from "@/components/form/main-form";
import Providers from "@/hooks/provider";
/* import Badge from "@/components/badge"; */
import Layout from "@/templates/layout";
//
import { LogInField } from "@/utils/constants/forms/logIn";

export default function Home() {
  return (
    <Layout>
      <Providers>
        <MainForm
          message_button={'Enviar'}
          actionType={"post-login"}
          dataForm={LogInField()}
        />
      </Providers>
      {/*<Badge color="purple" text="Example" />*/}
    </Layout>
  )
}
