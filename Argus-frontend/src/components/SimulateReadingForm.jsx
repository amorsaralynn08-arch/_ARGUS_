import { useState } from "react";
import api from "../api/axios";
import FormInput from "./FormInput";

const SimulateReadingForm = ({ vehicleId, onSuccess }) => {
  const [formData, setFormData] = useState({
    temperature: "", vibration: "", potentiometer_value: "",
    health_score: "", health_status: "ACTIVE",
  });
  const [createAlert, setCreateAlert] = useState(false);
  const [alertData, setAlertData] = useState({ alert_type: "HIGH_TEMPERATURE", severity: "WARNING", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleAlertChange = (e) => setAlertData({ ...alertData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const { data: reading } = await api.post("sensor-readings/", { ...formData, vehicle: vehicleId });

      if (createAlert) {
        await api.post("alerts/", { ...alertData, sensor_reading: reading.id });
      }

      onSuccess();
    } catch (err) {
      setErrors(err.response?.data || { general: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {errors.general && <p className="form-error">{errors.general}</p>}

      <FormInput label="Temperature (°C)" name="temperature" type="number" value={formData.temperature} onChange={handleChange} error={errors.temperature} />
      <FormInput label="Vibration" name="vibration" type="number" value={formData.vibration} onChange={handleChange} error={errors.vibration} />
      <FormInput label="Potentiometer (0-4095)" name="potentiometer_value" type="number" value={formData.potentiometer_value} onChange={handleChange} error={errors.potentiometer_value} />
      <FormInput label="Health score" name="health_score" type="number" value={formData.health_score} onChange={handleChange} error={errors.health_score} />

      <div className="form-group">
        <label>Resulting status</label>
        <select name="health_status" value={formData.health_status} onChange={handleChange} className="select-boxed">
          <option value="ACTIVE">Normal</option>
          <option value="MAINTENANCE">Warning</option>
          <option value="CRITICAL">Critical</option>
          <option value="OFFLINE">Offline</option>
        </select>
      </div>

      <div className="settings-row" style={{ padding: "0.75rem 0", border: "none" }}>
        <div className="settings-label">Also create an alert</div>
        <input type="checkbox" checked={createAlert} onChange={(e) => setCreateAlert(e.target.checked)} />
      </div>

      {createAlert && (
        <>
          <div className="form-group">
            <label>Alert type</label>
            <select name="alert_type" value={alertData.alert_type} onChange={handleAlertChange} className="select-boxed">
              <option value="HIGH_TEMPERATURE">High Temperature</option>
              <option value="HIGH_VIBRATION">High Vibration</option>
              <option value="LOW_HEALTH_SCORE">Low Health Score</option>
            </select>
          </div>
          <div className="form-group">
            <label>Severity</label>
            <select name="severity" value={alertData.severity} onChange={handleAlertChange} className="select-boxed">
              <option value="NORMAL">Normal</option>
              <option value="WARNING">Warning</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <FormInput label="Alert message" name="message" value={alertData.message} onChange={handleAlertChange} error={errors.message} />
        </>
      )}

      <button type="submit" disabled={loading}>{loading ? "Simulating..." : "Simulate Reading"}</button>
    </form>
  );
};

export default SimulateReadingForm;