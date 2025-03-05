'use client'
import { api } from "@/app/services/api";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Container = () => {

  const [question, setQuestion] = useState([])

  useEffect(() => {
  
    const fetchQuestion = async () => {
      try {
        const response = await api.get('/questions'); 
        setQuestion(response.data); 
      } catch (error) {
        console.log('erro ao buscar questão', error)
      }
    };
    
    fetchQuestion();
  }, []);


  
  
  return (
    <div className="w-full flex flex-col items-center justify-start min-h-screen border-r-2 border-neutral-200">
      <div className="flex mt-10 items-center justify-center">
        <Image
          src={"https://i.imgur.com/OZ1YruF.png"}
          width={100}
          height={100}
          alt="user"
          className="rounded-full"
        />
      </div>
      {question?.map((item) => {
      
       return (<div key={item.id}>
        <h2  className="mt-20 text-2xl font-extrabold p-4 text-center">
        {item.name}
       </h2>
       </div>)
      })}
      
      <div className="mt-10 w-24 h-10 rounded-md bg-neutral-200 flex items-center justify-center">
        <span className="font-medium">Reloaded</span>
      </div>
      <div className="mt-20 w-24 h-10 rounded-md bg-sky-600 flex items-center justify-center">
        <span className=" text-white font-bold">Next</span>
      </div>
    </div>
  );
};

export default Container;
