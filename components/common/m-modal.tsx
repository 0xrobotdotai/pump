import { observer } from "mobx-react-lite";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalProps } from "@nextui-org/modal";
import { CloseIcon } from "../icons";

type DefaultProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  baseClassNames?: string;
  headerClassNames?: string;
  subtitleClassName?: string;
};

type CombinedModalProps = DefaultProps & ModalProps;

const MModal = observer(({ children, subtitle, title, baseClassNames, headerClassNames, subtitleClassName, ...modalProps }: CombinedModalProps) => {
  return (
    <Modal {...modalProps}>
      <ModalContent className="relative">
        <ModalHeader className="flex flex-col gap-4 text-white/90">
          {title && <div className="text-xl md:text-2xl md:leading-9 font-semibold whitespace-pre-line">{title}</div>}
          {subtitle && <div className={`text-sm leading-6 font-medium text-white/80 whitespace-pre-line ${subtitleClassName}`}>{subtitle}</div>}
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
});

export default MModal;
