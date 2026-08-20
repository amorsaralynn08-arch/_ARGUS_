import { useState, useEffect } from "react";
import api from "../api/axios";

const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchVehicles = async (query = "") => {
    setLoading(true);
    try {
      const { data } = await api.get(`vehicles/${query ? `?search=${query}` : ""}`);
      setVehicles(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Failed to load vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchVehicles(search), 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const addVehicle = (newVehicle) => setVehicles((v) => [newVehicle, ...v]);

  return { vehicles, loading, search, setSearch, addVehicle };
};

export default useVehicles;