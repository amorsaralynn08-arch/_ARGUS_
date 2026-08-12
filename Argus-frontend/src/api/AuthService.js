import api from "./axios";

export const register = (userData) => {
  return api.post("register/", userData);
};

export const login = async (username, password) => {
  const { data } = await api.post("token/", { username, password });
  localStorage.setItem("access_token", data.access);
  localStorage.setItem("refresh_token", data.refresh);
  return data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const forgotPassword = (email) => {
  return api.post("password-reset/", { email });
};

export const resetPassword = (uidb64, token, new_password) => {
  return api.post("password-reset/confirm/", { uidb64, token, new_password });
};