import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { MainForm } from "../form/main-form";

export function ModalComponent({ isOpen, onClose }) {
  return (
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
                actionType={"add-project"}
                dataForm={[
                  {
                    id: 0,
                    type: "INPUT",
                    name: "nombre",
                    placeholder: "Nombre",
                    require: false,
                  },
                  {
                    id: 1,
                    type: "INPUT",
                    name: "descripcion",
                    placeholder: "Descripción",
                    require: false,
                  },
                  {
                    id: 2,
                    type: "DATE",
                    name: "fechaInicio",
                    placeholder: "Fecha Inicio",
                    require: false,
                  },
                  {
                    id: 3,
                    type: "DATE",
                    name: "fechaFin",
                    placeholder: "Fecha Fin",
                    require: false,
                  },
                  {
                    id: 4,
                    type: "CHECKBOX",
                    options: ["Activo"],
                    name: "activo",
                    placeholder: "Estado",
                    require: false,
                  },
                  {
                    id: 5,
                    type: "SELECT",
                    options: [{ value: "urgencia", label: "Urgencia" }],
                    name: "state",
                    placeholder: "Prioridad",
                    require: false,
                    multi: false,
                  },
                ]}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
