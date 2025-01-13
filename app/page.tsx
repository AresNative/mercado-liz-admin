import MainForm from "@/components/form/main-form";
import Badge from "@/components/badge";

import Providers from "@/hooks/provider";
import Layout from "@/templates/layout";
//
import { TestInputsField } from "@/utils/constants/forms/testInputs";
export default function Home() {

  return (
    <Layout>
      <Providers>
        <MainForm
          message_button={'Enviar'}
          actionType={"add-project"}
          dataForm={TestInputsField()}
        />
      </Providers>
      <Badge color="purple" text="Example" />
    </Layout>
  )
}
