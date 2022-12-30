import { useState } from "react";
import "./InputField.css";

type InputFieldType = "text" | "password" | "email" | "number";

const InputField = (props: {
  inputType: InputFieldType;
  placeholder: string;
}) => {
  let input_element: HTMLInputElement | null = document.querySelector("input");
    input_element?.addEventListener("keyup", () => {
    input_element?.setAttribute("value", input_element.value);
  });
  const [text, setText] = useState("")
  return (
    <div className="input-contain">
      <input
      className="input"
        type="text"
        id="fname"
        name="fname"
        autoComplete="off"
        aria-labelledby="placeholder-fname"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <label
        className="placeholder-text"
        htmlFor="fname"
        id="placeholder-fname"
      >
        <div className="text">{props.placeholder}</div>
      </label>
    </div>
  );
};

export default InputField;
