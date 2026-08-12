import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import "../styles/auth.css";

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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateClientSide = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validateClientSide();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Create your Fleet Manager account">
      {errors.general && <p className="form-error">{errors.general}</p>}

<form onSubmit={handleSubmit} noValidate>
  <FormInput label="Username" name="username" value={formData.username} onChange={handleChange} error={errors.username} />
  <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />

  <div className="form-row">
    <FormInput label="First name" name="first_name" value={formData.first_name} onChange={handleChange} />
    <FormInput label="Last name" name="last_name" value={formData.last_name} onChange={handleChange} />
  </div>

  <FormInput label="Phone number" name="phone_number" value={formData.phone_number} onChange={handleChange} />

  <div className="form-row">
    <FormInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
    <FormInput label="Confirm password" name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} error={errors.confirm_password} />
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