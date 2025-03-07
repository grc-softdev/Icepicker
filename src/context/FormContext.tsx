"use client";
import useLocalStorage from "@/hooks/useLocalStorage";
import { createContext, ReactNode, useContext, useState } from "react";

type FormContextProps = {
  questions: Questions[];
  setQuestions: React.Dispatch<React.SetStateAction<Questions[]>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
};

type FormProviderProps = {
  children: ReactNode;
};

type Questions = {
  name: string;
  id: string;
};

const FormContext = createContext({} as FormContextProps | null);

export const useForm = () => {
  return useContext(FormContext);
};

export const FormProvider = ({ children }: FormProviderProps) => {
  const [questions, setQuestions] = useLocalStorage<Questions[]>(
    "questions",
    []
  );
  const [name, setName] = useLocalStorage<string>("name", "");
  const [sessionLink, setSessionLink] = useState("");

  return (
    <FormContext.Provider
      value={{ questions, name, setQuestions, setName, setSessionLink }}
    >
      {children}
    </FormContext.Provider>
  );
};
