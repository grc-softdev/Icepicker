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
  
  

  return (
    <FormContext.Provider
      value={{  }}
    >
      {children}
    </FormContext.Provider>
  );
};
