"use client";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import FormJson from "@/constants/new-project-scrum.json";
import { useAppDispatch, useAppSelector } from "@/actions/selector";
import { closeModalReducer } from "@/actions/reducers/modal-reducer";
import { MainForm } from "@/components/utils/main-form";
function ModalComponent({
  title,
  message_button,
  modalName,
  functionString,
}) {
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