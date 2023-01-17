type InputFieldType = "text" | "password" | "email" | "number";

interface InputFieldProps {
  id: string;
  inputType: InputFieldType;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

const InputField = (props: InputFieldProps) => {
  return (
    <div className="flex flex-col w-full">
      <input
        type={props.inputType}
        id={props.id}
        className={"border text-base rounded-lg block w-full p-4" + (props.error ? " border-errorColor placeholder-errorColor focus:outline-errorColor" : " border-inputBorderColor placeholder-inputBorderColor focus:outline-primary-500")}
        placeholder={props.placeholder}
        onChange={(element) => props.onChange(element.target.value)}
        value={props.value}
      />
      {props.error && (
        <p className="text-sm text-errorColor">
          {props.error}
        </p>
      )}
    </div>
  );
};

export default InputField;
