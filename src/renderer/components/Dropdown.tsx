import React from "react";

type DropdownProps = {
  options: string[];
  onSelect: (value: string) => void;
};

export function Dropdown({ options, onSelect }: DropdownProps) {
  const [selectedOption, setSelectedOption] = React.useState<string>(
    options[0]
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedOption(selected);
    onSelect(selected);
  };

  return (
    <select value={selectedOption} onChange={handleChange}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
