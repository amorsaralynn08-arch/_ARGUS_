import { useState } from "react";
import api from "../api/axios";
import FormInput from "./FormInput";
import "../styles/auth.css";

const AddVehicleForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    registration_number: "",
    manufacturer: "",
    model: "",
    year: "",
    vin: "",
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
      const { data } = await api.post("vehicles/", { ...formData, year: Number(formData.year) });
      onSuccess(data);
    } catch (err) {
      setErrors(err.response?.data || { general: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {errors.general && <p className="form-error">{errors.general}</p>}
      <FormInput label="Registration number" name="registration_number" value={formData.registration_number} onChange={handleChange} error={errors.registration_number} />
      <FormInput label="Manufacturer" name="manufacturer" value={formData.manufacturer} onChange={handleChange} error={errors.manufacturer} />
      <FormInput label="Model" name="model" value={formData.model} onChange={handleChange} error={errors.model} />
      <FormInput label="Year" name="year" type="number" value={formData.year} onChange={handleChange} error={errors.year} />
      <FormInput label="VIN" name="vin" value={formData.vin} onChange={handleChange} error={errors.vin} />
      <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Vehicle"}</button>
    </form>
  );
};

export default AddVehicleForm;