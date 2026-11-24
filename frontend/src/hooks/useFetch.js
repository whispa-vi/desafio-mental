import { useCallback, useEffect, useState } from "react";

// Ejecuta una petición y guarda los tres estados: cargando, error y datos.
// `deps` funciona como en useEffect: si cambian, se vuelve a pedir.
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fetcher, deps);

  useEffect(() => {
    let active = true; // evita guardar una respuesta vieja si el componente cambió
    setLoading(true);
    setError(null);
    run()
      .then((result) => active && setData(result))
      .catch((err) => active && setError(err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [run, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { data, loading, error, reload, setData };
}
