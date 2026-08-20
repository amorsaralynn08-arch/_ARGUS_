import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/FormInput";
import ScatteredEyes from "../components/ScatteredEyes";
import { Eye, Lock } from "lucide-react";
import "../styles/home.css";

const validators = {
  username: (v) => (!v ? "Username is required." : v.length < 3 ? "Too short." : ""),
  email: (v) => (!v ? "Email is required." : !/\S+@\S+\.\S+/.test(v) ? "Enter a valid email address." : ""),
  password: (v) => (!v ? "Password is required." : v.length < 8 ? "At least 8 characters." : ""),
  confirm_password: (v, all) => (!v ? "Please confirm your password." : v !== all.password ? "Passwords do not match." : ""),
};

const Home = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "", email: "", first_name: "", last_name: "",
    phone_number: "", password: "", confirm_password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allErrors = {};
    Object.keys(validators).forEach((f) => { allErrors[f] = validators[f](formData[f], formData); });
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
      setErrors(err.response?.data || { general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <ScatteredEyes />

      <nav className="home-nav">
        <div className="home-logo"><Eye size={16} aria-hidden="true" /> ARGUS</div>
        <div className="home-nav-right">Already watching? <Link to="/login">Sign in →</Link></div>
      </nav>

      <div className="home-split">
        <div className="home-hero">
          <div className="home-eyebrow"><span className="tick" />ARGUS — FLEET HEALTH MONITORING</div>
          <h1 className="home-headline">Know before <em>it breaks.</em></h1>
          <p className="home-subhead">Real-time vehicle health monitoring for fleet managers. Sensors detect it, ARGUS alerts you — before it ever costs you downtime.</p>

          <div className="home-features">
            <div>
              <Eye size={20} aria-hidden="true" />
              <div className="feature-title">Live Readings</div>
              <div className="feature-desc">Continuous sensor data, in real time.</div>
            </div>
            <div>
              <Eye size={20} aria-hidden="true" />
              <div className="feature-title">Early Warning</div>
              <div className="feature-desc">Anomalies flagged before failure.</div>
            </div>
            <div>
              <Lock size={20} aria-hidden="true" />
              <div className="feature-title">No Middlemen</div>
              <div className="feature-desc">Direct from sensor to you.</div>
            </div>
          </div>
        </div>

        <div className="home-panel">
          <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />

          <div className="panel-eyebrow">Request Access</div>
          <div className="panel-title">Create your account</div>

          {errors.general && <p className="form-error">{errors.general}</p>}

          <form onSubmit={handleSubmit} noValidate>
            <FormInput label="Username" name="username" value={formData.username} onChange={handleChange} error={touched.username && errors.username} touched={touched.username} isValid={!errors.username} />
            <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} error={touched.email && errors.email} touched={touched.email} isValid={!errors.email} />
            <FormInput label="First name" name="first_name" value={formData.first_name} onChange={handleChange} />
            <FormInput label="Last name" name="last_name" value={formData.last_name} onChange={handleChange} />
            <FormInput label="Phone number" name="phone_number" value={formData.phone_number} onChange={handleChange} />
            <FormInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} error={touched.password && errors.password} touched={touched.password} isValid={!errors.password} />
            <FormInput label="Confirm password" name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} error={touched.confirm_password && errors.confirm_password} touched={touched.confirm_password} isValid={!errors.confirm_password} />

            <button type="submit" disabled={loading}>{loading ? "Creating account..." : "Create Account"}</button>
          </form>

          <div className="panel-privacy"><Lock size={11} aria-hidden="true" /> Your data stays private. No middlemen, ever.</div>
        </div>
      </div>
    </div>
  );
};

export default Home;