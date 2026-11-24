// Un número con su descripción (tarjetas de estadísticas). children: algo extra debajo (por ejemplo, una barra).
export default function StatCard({ value, label, tone, children }) {
  return (
    <div className="stat">
      <b className={tone}>{value}</b>
      <small>{label}</small>
      {children}
    </div>
  );
}
