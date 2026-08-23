import { useState , useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import Toast from "../components/Toast";
import "../styles/auth.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const msg = sessionStorage.getItem("logoutMessage");
    if (msg) {
      setToastMessage(msg);
      sessionStorage.removeItem("logoutMessage");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setErrors({
        username: !formData.username ? "Username is required." : "",
        password: !formData.password ? "Password is required." : "",
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await login(formData.username, formData.password);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setErrors({ general: "Incorrect username or password." });
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
     <>
    {toastMessage && <Toast message={toastMessage} onDone={() => setToastMessage(null)} />}

      <AuthLayout formTitle="Sign in">
      {errors.general && <p className="form-error">{errors.general}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <FormInput label="Username" name="username" value={formData.username} onChange={handleChange} error={errors.username} />
        <FormInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />

        <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
          <Link to="/forgot-password" className="auth-inline-link">Forgot password?</Link>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="auth-footer">
        Don't have an account? <Link to="/register">Register</Link>
      </p>

    </AuthLayout>
    </>
  );
};

export default Login;