import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";
import FormInput from "../components/FormInput";
import "../styles/auth.css";

const FleetSetup = () => {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await api.post("companies/", formData);
      await refreshUser();
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
    <AuthLayout formTitle="Set up your fleet">
      {errors.general && <p className="form-error">{errors.general}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <FormInput label="Fleet / business name" name="name" value={formData.name} onChange={handleChange} error={errors.name} fullWidth />
          <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
          <FormInput label="Phone number" name="phone_number" value={formData.phone_number} onChange={handleChange} error={errors.phone_number} />

          <div className="form-group form-full">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className={errors.address ? "input-error" : ""}
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Setting up..." : "Continue"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default FleetSetup;