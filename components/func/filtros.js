"use client";

import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { MainForm } from "../form/main-form";
import MenuStructureEditor from "@/app/@dev/Test/page";

function DraggableItem({ column }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="p-2 bg-gray-200 rounded cursor-pointer"
    >
      {column.label}
    </div>
  );
}

function Filtros({ columns, filteredColumns, setFilteredColumns, setColumns }) {
  const { setNodeRef, isOver } = useDroppable({ id: "filtros" });

  // Handle the drop event
  const handleDrop = (event) => {
    if (
      event.active &&
      !filteredColumns.some((col) => col.id === event.active.id)
    ) {
      const column = columns.find((col) => col.id === event.active.id);
      if (column) {
        setFilteredColumns((prev) => [...prev, column]);
      }
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Card
        ref={setNodeRef}
        className={`p-4 shadow-md ${isOver ? "bg-gray-100" : ""}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="flex items-center mb-2">
          <h3 className="text-lg font-bold mb-2">Filtros Aplicados</h3>
          <Button className="ml-auto" onPress={onOpen}>
            Nuevo filtro
          </Button>
        </div>
        <MenuStructureEditor />
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Nuevo Filtro
              </ModalHeader>
              <ModalBody>
                <MainForm
                  message_button={"test"}
                  dataForm={[
                    {
                      id: 0,
                      type: "INPUT",
                      name: "Title",
                      placeholder: "Title",
                      require: true,
                    },
                    {
                      id: 1,
                      type: "INPUT",
                      name: "Subtitle",
                      placeholder: "Subtitle",
                      require: true,
                    },
                    {
                      id: 2,
                      type: "MEDIA",
                      name: "Image",
                      placeholder: "Featured Image",
                      require: true,
                    },
                    {
                      id: 3,
                      type: "DINAMIC",
                      name: "Text",
                      placeholder: "Content",
                      require: true,
                    },

                    {
                      id: 4,
                      type: "TEXTAREA",
                      name: "Preview",
                      placeholder: "Preview Summary",
                      require: true,
                    },
                  ]}
                  functionForm={(data) => {
                    console.log(data);
                  }}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Filtros;
