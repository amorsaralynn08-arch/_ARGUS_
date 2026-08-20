import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import FormInput from "../components/FormInput";

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone_number: user?.phone_number || "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [pwData, setPwData] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePwChange = (e) => setPwData({ ...pwData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);
    try {
      await api.patch("profile/", formData);
      await refreshUser();
      setEditing(false);
    } catch (err) {
      setErrors(err.response?.data || { general: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwErrors({});
    setPwSuccess(false);
    setPwSaving(true);
    try {
      await api.post("change-password/", pwData);
      setPwSuccess(true);
      setPwData({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      setPwErrors(err.response?.data || { general: "Something went wrong." });
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "1.5rem" }}>Profile</h1>

      <h2 className="section-title" style={{ marginTop: 0 }}>Personal details</h2>
      {!editing ? (
        <div className="detail-info-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          <div><span>Name</span><div>{user?.first_name} {user?.last_name}</div></div>
          <div><span>Username</span><div>{user?.username}</div></div>
          <div><span>Email</span><div>{user?.email}</div></div>
          <div><span>Phone</span><div>{user?.phone_number || "—"}</div></div>
          <div><span>Role</span><div>{user?.role}</div></div>
          <div><span>Company</span><div>{user?.company?.name || "—"}</div></div>
        </div>
      ) : (
        <form onSubmit={handleSave} noValidate style={{ maxWidth: 400 }}>
          {errors.general && <p className="form-error">{errors.general}</p>}
          <FormInput label="First name" name="first_name" value={formData.first_name} onChange={handleChange} error={errors.first_name} />
          <FormInput label="Last name" name="last_name" value={formData.last_name} onChange={handleChange} error={errors.last_name} />
          <FormInput label="Phone number" name="phone_number" value={formData.phone_number} onChange={handleChange} error={errors.phone_number} />
          <button type="submit" disabled={saving} style={{ marginRight: 10 }}>{saving ? "Saving..." : "Save changes"}</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}
      {!editing && <button className="add-btn" style={{ marginTop: 16 }} onClick={() => setEditing(true)}>Edit Profile</button>}

      <h2 className="section-title">Change password</h2>
      <form onSubmit={handlePasswordChange} noValidate style={{ maxWidth: 400 }}>
        {pwErrors.general && <p className="form-error">{pwErrors.general}</p>}
        {pwSuccess && <p style={{ color: "var(--color-success)", fontSize: 13, marginBottom: 12 }}>Password changed successfully.</p>}
        <FormInput label="Current password" name="old_password" type="password" value={pwData.old_password} onChange={handlePwChange} error={pwErrors.old_password} />
        <FormInput label="New password" name="new_password" type="password" value={pwData.new_password} onChange={handlePwChange} error={pwErrors.new_password} />
        <FormInput label="Confirm new password" name="confirm_password" type="password" value={pwData.confirm_password} onChange={handlePwChange} error={pwErrors.confirm_password} />
        <button type="submit" disabled={pwSaving}>{pwSaving ? "Updating..." : "Change password"}</button>
      </form>
    </div>
  );
};

export default Profile;