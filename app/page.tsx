import Providers from "@/hooks/provider";
import Layout from "@/templates/layout";
import FormLogin from "./components/form-actions";

export default function Home() {

  return (
    <Layout>
      <Providers>
        <FormLogin />
      </Providers>
    </Layout>
  )
}
