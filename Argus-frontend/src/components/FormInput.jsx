import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";

const FormInput = ({ label, name, type = "text", value, onChange, error, touched, isValid, fullWidth }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`form-group${fullWidth ? " form-full" : ""}`}>
      <label htmlFor={name}>{label}</label>
      <div className="input-wrapper">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          className={error ? "input-error" : touched && isValid ? "input-valid" : ""}
        />
        {isPassword && (
          <button type="button" className="icon-btn" onClick={() => setShowPassword((s) => !s)} tabIndex={-1}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {!isPassword && touched && (
          <span className="validation-icon">
            {error ? <X size={16} className="icon-invalid" /> : isValid ? <Check size={16} className="icon-valid" /> : null}
          </span>
        )}
      </div>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
};

export default FormInput;