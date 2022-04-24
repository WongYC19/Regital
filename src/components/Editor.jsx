// import "react-quill/dist/quill.snow.css";
// import "react-quill/dist/quill.bubble.css";
// import ReactQuill from "react-quill";
// import { useState } from "react";
import ContentEditable from "react-contenteditable";
// import { createRef } from "react";
// const modules = {
//   toolbar: [
//     // [{ font: [] }],
//     [{ header: [1, 2, 3, 4, 5, 6, false] }],
//     ["bold", "italic", "underline", "strike"],
//     // [{ color: [] }, { background: [] }],
//     [{ script: "sub" }, { script: "super" }],
//     // ["blockquote", "code-block"],
//     [{ list: "ordered" }, { list: "bullet" }],
//     // [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
//     ["link"],
//     ["clean"],
//   ],
// };

// export default function Editor(props) {
//   const { theme = "snow", key } = props;
//   const [value, setValue] = useState("");
//   console.log("Value:", value);
//   return (
//     <ReactQuill
//       modules={modules}
//       theme={theme}
//       name="editor"
//       id={key}
//       onChange={setValue}
//       placeholder="Content goes here..."
//     />
//   );
// }

function pasteAsPlainText(event) {
  event.preventDefault();
  const text = event.clipboardData.getData("text/plain");
  document.execCommand("insertHTML", false, text);
}

export default function Editable(props) {
  // const innerRef = createRef();
  const {
    initialValue = "",
    textOnly = true,
    disabled = false,
    tagName = "div",
    className = "",
    onInput,
    id,
  } = props;

  const onPaste = textOnly ? pasteAsPlainText : null;

  // function contentUpdate(event) {
  //   innerRef.current = event.target.value;
  // }

  function onKeyDown(event) {
    if (event.keyCode === 13) {
      document.execCommand("insertLineBreak");
      event.preventDefault();
      return false;
    }
  }

  return (
    <ContentEditable
      onPaste={onPaste}
      // onChange={contentUpdate}
      onChange={onInput}
      onKeyDown={onKeyDown}
      html={initialValue}
      // innerRef={innerRef}
      disabled={disabled}
      tagName={tagName}
      id={id}
      className={className}
      name="editor"
      style={{
        display: "inline-block",
        border: "none",
        width: tagName === "div" && "100%",
        // boxShadow: "-3px 5px 7px -6px rgba(0,0,0,0.88)",
        "&:focus": { border: "none" },
      }}
    />
  );
}
