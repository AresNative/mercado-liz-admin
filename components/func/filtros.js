"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

function Filtros({ columns, setFilteredColumns, setColumns }) {
  const { setNodeRef, isOver } = useDroppable({ id: "filtros" });

  const handleRemoveFilter = (column) => {
    setColumns((prev) => prev.filter((col) => col.id !== column.id));
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleOpen = () => {
    onOpen();
  };
  return (
    <>
      <Card
        ref={setNodeRef}
        className={`p-4 shadow-md ${isOver ? "bg-gray-100" : ""}`}
      >
        <SortableContext strategy={verticalListSortingStrategy} items={columns}>
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-bold mb-2">Filtros Aplicados</h3>
            <Button className="ml-auto" onPress={() => handleOpen()}>
              Open
            </Button>
          </div>

          <div className="max-w-64 flex flex-wrap gap-2">
            {columns.map((column) => (
              <div
                key={column.id}
                className="p-2 bg-gray-200 rounded cursor-pointer"
                onClick={() => handleRemoveFilter(column)}
              >
                {column.label}
              </div>
            ))}
          </div>
        </SortableContext>
      </Card>

      <Modal size={"xs"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Filtros;
