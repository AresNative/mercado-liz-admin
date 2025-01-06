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
  content = null,
}) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modal.modals[functionString]);

  const onClose = () => {
    dispatch(closeModal({ modalName: functionString }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      size="lg"
      backdrop="blur"
      scrollBehavior="inside"
    >
      <ModalContent className="rounded-lg shadow-lg bg-white dark:bg-gray-800">
        {() => (
          <>
            {content ? (
              <>
                <ModalBody className="h-full text-gray-800 dark:text-white">{content}</ModalBody>
              </>
            ) : (
              <>
                <ModalHeader className="flex flex-col gap-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </ModalHeader>
                <ModalBody className="py-6">
                  <MainForm
                    message_button={message_button}
                    actionType={functionString}
                    dataForm={FormJson}
                  />
                </ModalBody>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalComponent;
