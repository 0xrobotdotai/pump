import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Input, InputProps } from "@nextui-org/input";

interface MInputProps extends InputProps {
  maxLength?: number;
  onValidationError?: (isError: boolean, message: string | null) => void;
}

const MInput: React.FC<MInputProps> = observer(({ maxLength, onValidationError, ...props }) => {
  const [length, setLength] = useState(props.value ? (props.value as string).length : 0);
  const [value, setValue] = useState(props.value as string || '');
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (props.value) {
      setLength((props.value as string).length);
      setValue(props.value as string);
    }
  }, [props.value]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    let error = false;
    let message = null;

    if (maxLength && newValue.length > maxLength) {
      error = true;
      message = `Input exceeds maximum length of ${maxLength} characters.`;
      setIsInvalid(true);
      setErrorMessage(message);
    } else {
      setIsInvalid(false);
      setErrorMessage(null);
    }

    setLength(newValue.length);
    setValue(newValue);

    if (props.onChange) {
      props.onChange(e);
    }

    if (onValidationError) {
      onValidationError(error, message);
    }
  };

  return (
    <Input
      variant="bordered"
      size="lg"
      errorMessage={errorMessage}
      onChange={handleOnChange}
      isInvalid={isInvalid}
      {...props}
    />
  );
});

export default MInput;
