"use client";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@/actions/selector";
import { closeModal } from "@/actions/reducers/modal-reducer";
import { MainForm } from "@/components/utils/main-form";

import FormJson from "@/constants/new-project-scrum.json";

function ModalComponent({
  title,
  message_button,
  functionString,
}) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.modals[functionString]);

  const onClose = () => {
    dispatch(closeModal({ modalName: functionString }));
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="z-20 dark:bg-gray-800">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <MainForm
                message_button={message_button}
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

export default ModalComponent