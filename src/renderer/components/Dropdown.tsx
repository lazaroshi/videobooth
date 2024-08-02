import React from "react";
import styled from "styled-components";

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
    <StyledSelect value={selectedOption} onChange={handleChange}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </StyledSelect>
  );
}

const StyledSelect = styled.select`
  background-color: black;
  border: none;
  font-weight: bold;
  color: white;
  border-radius: 5px;
  padding: 8px;
`;
