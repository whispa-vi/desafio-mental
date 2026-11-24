import { useEffect, useRef, useState } from "react";

// Cuenta regresiva en segundos.
// - running: false la pausa (mientras se ve la corrección o la ventana «Salir»);
// - onExpire: se llama una vez al llegar a 0.
// Para empezar de nuevo (otra pregunta) el componente que lo usa se vuelve a montar con otra `key`.
export function useTimer(seconds, { running, onExpire }) {
  const [left, setLeft] = useState(seconds);
  const leftRef = useRef(seconds);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (!running || leftRef.current === 0) return;
    // Se calcula con la hora de fin para que el reloj no se atrase
    const endsAt = Date.now() + leftRef.current * 1000;
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      leftRef.current = remaining;
      setLeft(remaining);
      if (remaining === 0) {
        clearInterval(id);
        onExpireRef.current();
      }
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  return left;
}
