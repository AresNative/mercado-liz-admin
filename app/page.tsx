import Alert from "@/components/alert";
import { MainForm } from "@/components/form/main-form";
import Providers from "@/hooks/provider";
import Badge from "@/components/badge";
import Background from "@/templates/background";
import Footer from "@/templates/footer";
import Nav from "@/templates/nav";

import FormJson from "@/utils/constants/new-project-scrum.json";
export default function Home() {
  return (
    <Background>
      <Nav />
      <Alert />
      <Providers>
        <MainForm
          message_button={'Enviar'}
          actionType={"add-project"}
          dataForm={FormJson}
        />
      </Providers>
      <Badge color="purple" text="Example" />
      <Footer />
    </Background>
  )
}

