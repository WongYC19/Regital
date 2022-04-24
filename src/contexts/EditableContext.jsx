import useEditable from "../hooks/useEditable";
import { createContext } from "react";

const EditableContext = createContext();

function EditableProvider({ children, startEditable = true }) {
  const { editable, iconClass, setEditable, toggleEditable } =
    useEditable(startEditable);

  return (
    <EditableContext.Provider
      value={{ editable, iconClass, setEditable, toggleEditable }}
    >
      {children}
    </EditableContext.Provider>
  );
}

export { EditableContext, EditableProvider };
