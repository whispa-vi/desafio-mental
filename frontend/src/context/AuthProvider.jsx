import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext.js";
import { authService } from "../api/services.js";
import { tokenStorage, setUnauthorizedHandler, ApiError } from "../api/client.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // true mientras se recupera la sesión guardada al abrir la aplicación
  const [restoring, setRestoring] = useState(() => Boolean(tokenStorage.get()));

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  // Si el servidor responde 401 (token vencido o inválido), se cierra la sesión
  useEffect(() => {
    setUnauthorizedHandler(logout);
  }, [logout]);

  // Recuperar la sesión: hay token guardado → pedir el perfil al servidor
  useEffect(() => {
    if (!tokenStorage.get()) return;
    authService
      .profile()
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setRestoring(false));
  }, []);

  // requiredRole: el panel solo acepta ADMIN. Si el rol no coincide, la sesión no se guarda.
  const login = useCallback(async (username, password, requiredRole) => {
    const { token, user: loggedUser } = await authService.login({ username, password });
    if (requiredRole && loggedUser.role !== requiredRole) {
      throw new ApiError(403, "Esta cuenta no tiene permisos de administrador.");
    }
    tokenStorage.set(token);
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const register = useCallback((data) => authService.register(data), []);

  const value = useMemo(
    () => ({ user, restoring, isAdmin: user?.role === "ADMIN", login, register, logout }),
    [user, restoring, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
