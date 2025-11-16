export type User = {
  email: string;
  role: string;
};

export const getUser = (): User | null => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch (err) {
    return null;
  }
};

export const getRole = (): string | null => {
  const u = getUser();
  return u ? u.role : null;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const isAuthorized = (allowedRoles: string[] | string): boolean => {
  const role = getRole();
  if (!role) return false;
  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  // admin always allowed
  if (role === "admin") return true;
  return allowed.includes(role);
};

export default {
  getUser,
  getRole,
  logout,
  isAuthorized,
};
