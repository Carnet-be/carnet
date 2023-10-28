"use client";
import React, { type ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

export default function CModal({
  trigger,
  onConfirm,
  title,
  children,
  label = {
    ok: "ok",
    cancel: "cancel",
  },
}: {
  onConfirm?: () => void;
  trigger: string;
  title?: string;
  children?: ReactNode;
  label?: {
    ok?: string;
    cancel?: string;
  };
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button   onClick={onOpen}   variant="shadow"
                   color="primary"
                   className="px-5">
        {trigger}
      </Button>
      <Modal
       // backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}

      >
        <ModalContent>
          {(onClose) => (
            <>
              {title && (
                <ModalHeader className="flex flex-col gap-1">
                  {title}
                </ModalHeader>
              )}
              <ModalBody>{children}</ModalBody>
              <ModalFooter>
                {label?.cancel && (
                  <Button color="danger" variant="light" onPress={onClose}>
                    {label?.cancel}
                  </Button>
                )}
                {label?.ok && (
                  <Button
                    color="primary"
                    onPress={() => {
                      onClose();
                      onConfirm?.();
                    }}
                  >
                    {label?.ok}
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
