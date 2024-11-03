import Head from "next/head";
export function DefaultPage({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard - SuperMercado</title>
        <meta
          name="description"
          content="Dashboard del supermercado con ventas, inventario y más."
        />
      </Head>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
