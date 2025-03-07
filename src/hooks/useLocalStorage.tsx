"use client";
import { useEffect, useState } from "react";

function useLocalStorage<T>(key: string, defaultValue: T | (() => T)) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      const jsonValue = window.localStorage.getItem(key);
      if (jsonValue !== null) {
        setValue(JSON.parse(jsonValue));
      }
    } catch (error) {
      console.error("Erro ao ler do localStorage", error);
    }
  }, [key]);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

export default useLocalStorage;
