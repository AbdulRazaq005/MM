import { useState } from "react";
import "../styles/Dropdown.css";

const Dropdown = ({ options = [], name = "an option", setFunction }) => {
  const [isOpen, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toggleDropdown = () => setOpen(!isOpen);

  const handleItemClick = (value) => {
    console.log({ selectedItem, value });
    selectedItem == value ? setSelectedItem(null) : setSelectedItem(value);
    selectedItem == value ? setFunction(null) : setFunction(value);
    setOpen(!isOpen);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header" onClick={toggleDropdown}>
        {selectedItem
          ? options.find((item) => item.value == selectedItem).label
          : `Select ${name}`}
        <i className={`fa fa-chevron-right icon ${isOpen && "open"}`}></i>
      </div>
      <div className={`dropdown-body ${isOpen && "open"}`}>
        {options.map((item) => (
          <div
            className="dropdown-item"
            onClick={(e) => handleItemClick(item.value)}
            value={item.value}
            key={item.value}
          >
            <p
              className={`dropdown-item-text ${
                item.value == selectedItem && "selected"
              }`}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
