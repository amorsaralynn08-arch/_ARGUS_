import { useState } from "react";
import api from "../api/axios";
import FormInput from "./FormInput";

const AddStaffForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    username: "", email: "", first_name: "", last_name: "",
    phone_number: "", role: "DRIVER", password: "", confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const { data } = await api.post("users/", formData);
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
        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleChange} className="select-input">
          <option value="DRIVER">Driver</option>
          <option value="MECHANIC">Mechanic</option>
        </select>
      </div>

      <FormInput label="Username" name="username" value={formData.username} onChange={handleChange} error={errors.username} />
      <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
      <FormInput label="First name" name="first_name" value={formData.first_name} onChange={handleChange} error={errors.first_name} />
      <FormInput label="Last name" name="last_name" value={formData.last_name} onChange={handleChange} error={errors.last_name} />
      <FormInput label="Phone number" name="phone_number" value={formData.phone_number} onChange={handleChange} error={errors.phone_number} />
      <FormInput label="Temporary password" name="password" type="password" value={formData.password} onChange={handleChange} error={errors.password} />
      <FormInput label="Confirm password" name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} error={errors.confirm_password} />

      <button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Team Member"}</button>
    </form>
  );
};

export default AddStaffForm;