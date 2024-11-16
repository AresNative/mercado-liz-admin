"use client";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { MainForm } from "../form/main-form";
import FormJson from "@/constant/new-project-scrum.json";
import { useAppDispatch, useAppSelector } from "@/store/hooks/hooks";
import { closeModalReducer } from "@/store/reducers/modal-reducer";
export function ModalComponent({ title, modalName, functionString }) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.modals[modalName]);

  const onClose = () => {
    dispatch(closeModalReducer({ modalName }));
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <MainForm
                message_button={"test"}
                actionType={functionString}
                dataForm={FormJson}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
