/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Autocomplete, AutocompleteItem, } from "@nextui-org/react";
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
    <Autocomplete
      label={label}
      placeholder={placeholder}
      selectedKey={value?.toString()}
      className={className ?? "max-w-md"}
      defaultSelectedKey={value?.toString()}
      // selectedKeys={value ? [value?.toString()] : []}
      // value={typeof value === "number" ? value?.toString() : value}
      onSelectionChange={(e) => {

        if (e && type === "number")
          onChange(parseInt(e.toString()));
        else {
          onChange(e);
        }

      }}
      onBlur={onBlur}
      isDisabled={isDisabled}
      isInvalid={isInvalid}
      errorMessage={error}

      scrollShadowProps={{
        isEnabled: false,
      }}
    >
      {options.map((animal) => (
        <AutocompleteItem key={animal.value} value={animal.value}>
          {animal.label}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}

export default CSelect;
