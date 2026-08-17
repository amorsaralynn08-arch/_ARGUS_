import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user?.first_name || user?.username}</h1>
      <p>Fleet: {user?.company?.name || "—"}</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
};

export default Dashboard;