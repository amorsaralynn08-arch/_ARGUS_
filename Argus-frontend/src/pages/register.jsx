import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import "../styles/auth.css";

const validators = {
  username: (v) => (!v ? "Username is required." : v.length < 3 ? "Too short." : ""),
  email: (v) => (!v ? "Email is required." : !/\S+@\S+\.\S+/.test(v) ? "Enter a valid email address." : ""),
  password: (v) => (!v ? "Password is required." : v.length < 8 ? "At least 8 characters." : ""),
  confirm_password: (v, all) => (!v ? "Please confirm your password." : v !== all.password ? "Passwords do not match." : ""),
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setTouched((t) => ({ ...t, [name]: true }));

    if (validators[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name](value, updated) }));
    }
    if (name === "password" && touched.confirm_password) {
      setErrors((prev) => ({ ...prev, confirm_password: validators.confirm_password(updated.confirm_password, updated) }));
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(validators).forEach((field) => {
      newErrors[field] = validators[field](formData[field], formData);
    });
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allErrors = validateAll();
    if (Object.values(allErrors).some((err) => err)) {
      setErrors(allErrors);
      setTouched({ username: true, email: true, password: true, confirm_password: true });
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate("/fleet-setup");
    } catch (err) {
      if (err.response?.data) {
        setErrors((prev) => ({ ...prev, ...err.response.data }));
      } else {
        setErrors((prev) => ({ ...prev, general: "Something went wrong. Please try again." }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout formTitle="Register">
      {errors.general && <p className="form-error">{errors.general}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <FormInput label="Username" name="username" value={formData.username} onChange={handleChange} error={touched.username && errors.username} touched={touched.username} isValid={!errors.username} />
          <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={touched.email && errors.email} touched={touched.email} isValid={!errors.email} />
          <FormInput label="First name" name="first_name" value={formData.first_name} onChange={handleChange} />
          <FormInput label="Last name" name="last_name" value={formData.last_name} onChange={handleChange} />
          <FormInput label="Phone number" name="phone_number" value={formData.phone_number} onChange={handleChange} fullWidth />
          <FormInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={touched.password && errors.password} touched={touched.password} isValid={!errors.password} />
          <FormInput label="Confirm password" name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} error={touched.confirm_password && errors.confirm_password} touched={touched.confirm_password} isValid={!errors.confirm_password} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
};

export default Register;