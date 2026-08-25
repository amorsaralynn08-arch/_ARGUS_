import { useState, useEffect } from "react";
import api from "../api/axios";
import FormInput from "./FormInput";

const AddMaintenanceForm = ({ onSuccess }) => {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicle: "", service_type: "", description: "",
    performed_by: "", cost: "", date_performed: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("vehicles/").then(({ data }) => {
      setVehicles(Array.isArray(data) ? data : data.results || []);
    });
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const { data } = await api.post("maintenance/", formData);
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

      <div className="form-group">
        <label>Vehicle</label>
        <select name="vehicle" value={formData.vehicle} onChange={handleChange} className="select-input">
          <option value="">Select a vehicle</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>{v.manufacturer} {v.model} — {v.registration_number}</option>
          ))}
        </select>
        {errors.vehicle && <span className="field-error">{errors.vehicle}</span>}
      </div>

      <FormInput label="Service type" name="service_type" value={formData.service_type} onChange={handleChange} error={errors.service_type} />
      <FormInput label="Description" name="description" value={formData.description} onChange={handleChange} error={errors.description} />
      <FormInput label="Performed by" name="performed_by" value={formData.performed_by} onChange={handleChange} error={errors.performed_by} />
      <FormInput label="Cost (optional)" name="cost" type="number" value={formData.cost} onChange={handleChange} error={errors.cost} />
      <FormInput label="Date performed" name="date_performed" type="date" value={formData.date_performed} onChange={handleChange} error={errors.date_performed} />

      <button type="submit" disabled={loading}>{loading ? "Saving..." : "Log Maintenance"}</button>
    </form>
  );
};

export default AddMaintenanceForm;