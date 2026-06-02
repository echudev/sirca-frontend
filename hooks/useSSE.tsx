"use client";

import { useEffect, useRef, useState } from "react";

type SSEStatus = "connecting" | "open" | "closed";

export default function useSSE<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SSEStatus>("closed");
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Si la URL es nula, nos aseguramos de que todo esté cerrado y no hacemos nada.
    if (!url) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setStatus("closed");
      setData(null);
      return;
    }

    const es = new EventSource(url);
    eventSourceRef.current = es;
    setStatus("connecting");

    // 2. Evento cuando la conexión se establece con éxito
    es.onopen = () => {
      setStatus("open");
      setError(null);
    };

    // 3. Evento al recibir un mensaje
    es.onmessage = (event: MessageEvent) => {
      try {
        setData(JSON.parse(event.data));
      } catch (err) {
        setError(`Error al procesar los datos recibidos. ${err}`);
      }
    };

    // 4. Evento al ocurrir un error
    es.onerror = () => {
      // El navegador intentará reconectar automáticamente.
      // Solo actualizamos el estado para informar al usuario.
      setError("Error de conexión. Reintentando automáticamente...");
      setStatus("connecting");
      // No es necesario cerrar y reabrir aquí, EventSource lo maneja.
    };

    // 5. Función de limpieza al desmontar el componente
    return () => {
      es.close();
    };
  }, [url]); // El efecto se vuelve a ejecutar si la URL cambia

  return { data, error, status };
}
