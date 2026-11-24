import { useFetch } from "../hooks/useFetch.js";
import { userService } from "../api/services.js";
import { formatDate } from "../utils/format.js";
import Message from "../components/Message.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";

export default function PanelUsersPage() {
  const { data: users, loading, error, reload } = useFetch(() => userService.list(), []);

  return (
    <>
      <header className="panel-header">
        <h1>Usuarios</h1>
      </header>
      <p className="nota">Cuentas registradas. Los jugadores se crean desde el registro público; el administrador, con el seed.</p>
      {loading && <Message type="cargando">Cargando usuarios...</Message>}
      {error && <ErrorMessage error={error} onRetry={reload} />}
      {users && (
        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Registro</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td><span className={u.role === "ADMIN" ? "estado admin" : "estado completada"}>{u.role === "ADMIN" ? "admin" : "jugador"}</span></td>
                  <td>{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
