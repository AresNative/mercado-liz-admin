import MainForm from "@/components/form/main-form";
import Badge from "@/components/badge";

import Providers from "@/hooks/provider";
import Layout from "@/templates/layout";
//
import FormJson from "@/utils/constants/new-project-scrum.json";
export default function Home() {

  return (
    <Layout>
      {/*<Alert
        message="Este es un mensaje de alerta"
        type="error"
        icon={<CircleAlert className="w-6 h-6 text-red-600" />}
        action={handleAlertAction}
      />*/}
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
