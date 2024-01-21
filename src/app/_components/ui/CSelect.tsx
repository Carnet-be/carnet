/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Select, SelectItem } from "@nextui-org/react";
import React from "react";

interface Props {
  label?: string;
  options: Array<{ value: string; label: string }>;
  isInvalid?: boolean;
  error?: string;
  onBlur?: (e: React.FocusEvent<Element, Element>) => void;
  onChange: (value: string | number) => void;
  value?: string | number;
  isDisabled?: boolean;
  type?: "text" | "number";
  className?: string;
  placeholder?: string;
  required?: boolean;
}
function CSelect({
  className,
  placeholder,
  value,
  type = "number",
  onBlur,
  isDisabled = false,
  onChange,
  label,
  options,
  error,
  required,
  isInvalid,
}: Props) {
  return (
    <Select
      label={label}
      placeholder={placeholder}
      className={className ?? "max-w-md"}
      selectedKeys={value ? [value?.toString()] : []}
      required={required}
      onChange={(e) => {
        if (type === "number")
          onChange(parseInt((e.target as any).value) ?? undefined);
        else {
          onChange((e.target as any).value);
        }
      }}
      onBlur={onBlur}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      errorMessage={error}
    >
      {options.map((animal) => (
        <SelectItem key={animal.value} value={animal.value}>
          {animal.label}
        </SelectItem>
      ))}
    </Select>
  );
}

export default CSelect;
