const FormInput = ({ label, name, type = "text", value, onChange, error }) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={error ? "input-error" : ""}
    />
    {error && <span className="field-error">{error}</span>}
  </div>
);

export default FormInput;