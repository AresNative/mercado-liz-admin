"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Progress,
  Chip,
} from "@nextui-org/react";
import { ShoppingCart, Package, Users, TrendingUp } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Head from "next/head";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = [
  { name: "Ene", total: 3500 },
  { name: "Feb", total: 4200 },
  { name: "Mar", total: 3800 },
  { name: "Abr", total: 4600 },
  { name: "May", total: 5100 },
  { name: "Jun", total: 4900 },
];

const chartData = {
  labels: data.map((item) => item.name),
  datasets: [
    {
      label: "Ventas",
      data: data.map((item) => item.total),
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
  ],
};

const chartOptions = {
  responsive: true,
  scales: {
    x: {
      type: "category",
    },
    y: {
      type: "linear",
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Resumen de Ventas Mensuales",
    },
  },
};

export default function DashboardSupermercado() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard - SuperMercado</title>
        <meta
          name="description"
          content="Dashboard del supermercado con ventas, inventario y más."
        />
      </Head>

      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardBody>
              <div className="flex justify-between items-center">
                <p className="text-md">Ventas Totales</p>
                <ShoppingCart className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold">$45,231.89</p>
              <p className="text-sm text-green-500">+20.1% del mes pasado</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex justify-between items-center">
                <p className="text-md">Nuevos Clientes</p>
                <Users className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold">+2350</p>
              <p className="text-sm text-green-500">+180.1% del mes pasado</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex justify-between items-center">
                <p className="text-md">Productos Vendidos</p>
                <Package className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold">+12,234</p>
              <p className="text-sm text-green-500">+19% del mes pasado</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="flex justify-between items-center">
                <p className="text-md">Tasa de Conversión</p>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold">+573</p>
              <p className="text-sm text-green-500">
                +201 desde la última hora
              </p>
            </CardBody>
          </Card>
        </div>

        <Card className="mb-8">
          <CardBody className=" h-80">
            <Bar options={chartOptions} data={chartData} />
          </CardBody>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <h3 className="text-xl font-bold">Estado del Inventario</h3>
            <p className="text-sm text-gray-500">
              Productos con bajo stock que necesitan reabastecimiento
            </p>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Manzanas</span>
                  <span>20%</span>
                </div>
                <Progress color="warning" value={20} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Leche</span>
                  <span>35%</span>
                </div>
                <Progress color="warning" value={35} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Pan</span>
                  <span>15%</span>
                </div>
                <Progress color="danger" value={15} className="h-2" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold">Pedidos Recientes</h3>
            <p className="text-sm text-gray-500">
              Has recibido 32 pedidos este mes
            </p>
          </CardHeader>
          <CardBody>
            <Table aria-label="Pedidos recientes">
              <TableHeader>
                <TableColumn>PEDIDO</TableColumn>
                <TableColumn>ESTADO</TableColumn>
                <TableColumn>CLIENTE</TableColumn>
                <TableColumn>MONTO</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell>#3210</TableCell>
                  <TableCell>
                    <Chip color="success" variant="flat">
                      Completado
                    </Chip>
                  </TableCell>
                  <TableCell>María García</TableCell>
                  <TableCell>$123.45</TableCell>
                </TableRow>
                <TableRow key="2">
                  <TableCell>#3209</TableCell>
                  <TableCell>
                    <Chip color="warning" variant="flat">
                      Pendiente
                    </Chip>
                  </TableCell>
                  <TableCell>Juan Pérez</TableCell>
                  <TableCell>$87.65</TableCell>
                </TableRow>
                <TableRow key="3">
                  <TableCell>#3208</TableCell>
                  <TableCell>
                    <Chip color="danger" variant="flat">
                      Cancelado
                    </Chip>
                  </TableCell>
                  <TableCell>Ana Martínez</TableCell>
                  <TableCell>$54.32</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
