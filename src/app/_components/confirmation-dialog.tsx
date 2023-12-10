"use client"
import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

export default function ConfirmationDialog({onConfirm, onCancel, title, description, children,danger}:{
    onConfirm: () => void,
    onCancel?: () => void,
    title?: string,
    description: string,
    danger?: boolean,
    children: (props: {onClick: () => void}) => JSX.Element
}) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
        {children({onClick: onOpen})}
      {/* <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
             {title && <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>}
              <ModalBody>
                <p> 
                 {description}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={()=>{
                    onClose();
                    onCancel?.();
                }}>
                 No
                </Button>
                <Button color={danger? "danger":"primary"} onPress={onConfirm}>
                  Yes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}
    </>
  );
}
