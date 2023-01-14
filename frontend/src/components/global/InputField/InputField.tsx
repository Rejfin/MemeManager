import "./InputField.css";

type InputFieldType = "text" | "password" | "email" | "number";

const InputField = (props: {
  id: string;
  inputType: InputFieldType;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  let input_element: HTMLInputElement | null = document.querySelector("input");
    input_element?.addEventListener("keyup", () => {
    input_element?.setAttribute("value", input_element.value);
  });
  return (
    <div className="input-contain">
      <input
      className="input"
        type={props.inputType}
        id={props.id}
        autoComplete="off"
        aria-labelledby="placeholder-fname"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
      <label
        className="placeholder-text"
        htmlFor={props.id}
        id="placeholder-fname"
      >
        <div className="text">{props.placeholder}</div>
      </label>
    </div>
  );
};

export default InputField;
