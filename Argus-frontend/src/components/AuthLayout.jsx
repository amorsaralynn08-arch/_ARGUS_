const AuthLayout = ({ subtitle, children }) => (
  <div className="auth-page">
    <div className="auth-card">
      <h1 className="auth-title">ARGUS</h1>
      {subtitle && <p className="auth-subtitle">{subtitle}</p>}
      {children}
    </div>
  </div>
);

export default AuthLayout;