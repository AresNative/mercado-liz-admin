"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
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
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Edit,
  Save,
} from "lucide-react";
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
    x: { type: "category" },
    y: { type: "linear", beginAtZero: true },
  },
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Resumen de Ventas Mensuales" },
  },
};

function SortableCard({ children, id, isEditing, size }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      disabled: !isEditing,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isEditing ? "move" : "default",
  };

  // Clases dinámicas según el tamaño de la tarjeta
  const sizeClass = {
    small: "col-span-1 row-span-1",
    medium: "col-span-2 row-span-1",
    large: "col-span-2 row-span-2",
    expand: "col-span-4 row-span-1",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-md ${sizeClass[size]} overflow-hidden`}
      {...attributes}
      {...(isEditing ? listeners : {})}
    >
      {children}
    </div>
  );
}

export default function DashboardSupermercado() {
  const [items, setItems] = useState([
    { id: "ventas", content: "Ventas Totales", size: "small" },
    { id: "clientes", content: "Nuevos Clientes", size: "small" },
    { id: "productos", content: "Productos Vendidos", size: "small" },
    { id: "conversion", content: "Tasa de Conversión", size: "small" },
    { id: "inventario", content: "Estado del Inventario", size: "large" },
    { id: "pedidos", content: "Pedidos Recientes", size: "large" },
    { id: "grafica", content: "Gráfica de Ventas", size: "expand" },
  ]);
  const [isEditing, setIsEditing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const renderCardContent = (id) => {
    switch (id) {
      case "ventas":
        return (
          <CardBody>
            <div className="flex justify-between items-center">
              <p className="text-md">Ventas Totales</p>
              <ShoppingCart className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">$45,231.89</p>
            <p className="text-sm text-green-500">+20.1% del mes pasado</p>
          </CardBody>
        );
      case "clientes":
        return (
          <CardBody>
            <div className="flex justify-between items-center">
              <p className="text-md">Nuevos Clientes</p>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">+2350</p>
            <p className="text-sm text-green-500">+180.1% del mes pasado</p>
          </CardBody>
        );
      case "productos":
        return (
          <CardBody>
            <div className="flex justify-between items-center">
              <p className="text-md">Productos Vendidos</p>
              <Package className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">+12,234</p>
            <p className="text-sm text-green-500">+19% del mes pasado</p>
          </CardBody>
        );
      case "conversion":
        return (
          <CardBody>
            <div className="flex justify-between items-center">
              <p className="text-md">Tasa de Conversión</p>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold">+573</p>
            <p className="text-sm text-green-500">+201 desde la última hora</p>
          </CardBody>
        );
      case "inventario":
        return (
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
        );
      case "pedidos":
        return (
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
                  <TableCell>$98.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardBody>
        );
      case "grafica":
        return (
          <CardBody className="max-h-80">
            <Bar data={chartData} options={chartOptions} />
          </CardBody>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>Dashboard - SuperMercado</title>
        <meta
          name="description"
          content="Dashboard del supermercado con ventas, clientes y más."
        />
      </Head>

      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <Button
            auto
            color={isEditing ? "success" : "primary"}
            onClick={() => setIsEditing(!isEditing)}
            startContent={isEditing ? <Save size={18} /> : <Edit size={18} />}
          >
            {isEditing ? "Guardar" : "Editar"}
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={rectSortingStrategy}>
            <div className="grid gap-6 grid-cols-4 auto-rows-auto">
              {items.map((item) => (
                <SortableCard
                  key={item.id}
                  id={item.id}
                  size={item.size}
                  isEditing={isEditing}
                >
                  <Card>
                    <CardHeader>
                      <h3 className="text-xl font-bold">{item.content}</h3>
                    </CardHeader>
                    {renderCardContent(item.id)}
                  </Card>
                </SortableCard>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </main>
    </div>
  );
}
