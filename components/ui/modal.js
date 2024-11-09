import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { MainForm } from "../form/main-form";
import { usePostProjectsMutation } from "@/store/server/reducers/api-reducer";
export function ModalComponent({ isOpen, onClose }) {
  const [postProjects] = usePostProjectsMutation(); // Ajuste para el hook de consulta

  async function handleForm({ dataForm }) {
    try {
      await postProjects(dataForm).unwrap();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  }
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
                dataForm={[
                  {
                    id: 0,
                    type: "INPUT",
                    name: "nombre",
                    placeholder: "Nombre",
                    require: true,
                  },
                  {
                    id: 1,
                    type: "INPUT",
                    name: "descripcion",
                    placeholder: "Descripción",
                    require: true,
                  },
                  {
                    id: 2,
                    type: "DATE",
                    name: "fechaInicio",
                    placeholder: "Fecha Inicio",
                    require: true,
                  },
                  {
                    id: 3,
                    type: "DATE",
                    name: "fechaFin",
                    placeholder: "Fecha Fin",
                    require: true,
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
                    require: true,
                    multi: false,
                  },
                ]}
                functionForm={handleForm}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
