import MainForm from "@/components/form/main-form";
import Badge from "@/components/badge";

import Providers from "@/hooks/provider";
import Layout from "@/templates/layout";
//
import FormJson from "@/utils/constants/new-project-scrum.json";
export default function Home() {

  return (
    <Layout>
      <Providers>
        <MainForm
          message_button={'Enviar'}
          actionType={"add-project"}
          dataForm={FormJson}
        />
      </Providers>
      <Badge color="purple" text="Example" />
    </Layout>
  )
}
