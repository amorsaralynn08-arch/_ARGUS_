export const getHomeRouteForRole = (role) => {
  switch (role) {
    case "ADMIN": return "/admin";
    case "DRIVER": return "/driver";
    case "FLEET_MANAGER":
    default: return "/dashboard";
  }
};