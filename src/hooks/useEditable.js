import { useState } from "react";

function useEditable(startingEditable = true) {
  const [editable, setEditable] = useState(startingEditable);
  const startingIconClass = editable
    ? "fa-solid fa-eye"
    : "fa-solid fa-pen-to-square";
  const [iconClass, setIconClass] = useState(startingIconClass);

  function toggleEditable() {
    setEditable(!editable);
    const iconClass = editable
      ? "fa-solid fa-eye"
      : "fa-solid fa-pen-to-square";
    setIconClass(iconClass);
    console.log("editable after click in context:", editable);
  }

  return {
    editable,
    setEditable,
    iconClass,
    setIconClass,
    toggleEditable,
  };
}

export default useEditable;
