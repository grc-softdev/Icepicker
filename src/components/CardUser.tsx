
import { capFirstLetter } from "@/utils/format";
import Image from "next/image";
import React from "react";
import { LuCrown } from "react-icons/lu";

export type CardUserProps = {
  name: string;
  hostId: string;
  userId: string;
  isSelected: boolean;
};

const CardUser = ({ name, isSelected, userId, hostId }: CardUserProps) => {
  
  return (
    <div className={`border w-70 h-24 border-neutral-200 rounded-lg p-3 mb-2 gap-2 mr-6 cursor-pointer 
      ${isSelected ? "bg-blue-200 border-blue-500" : "hover:bg-gray-100"}`}
      >
      <div className="flex justify-between">
        <div className="flex items-center justify-start mb-4">
          <Image
            src={"https://i.imgur.com/OZ1YruF.png"}
            width={40}
            height={40}
            alt="user"
            className="rounded-full"
          />
          <div className="flex flex-col ml-2">
            <h6 className="font-bold">{capFirstLetter(name)}</h6>
          </div>
        </div>
        <div className="flex items-start justify-center">
          <span className="flex items-center bg-neutral-200 hover:bg-red-200 px-1.5 rounded-full text-sm">
            x
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        {hostId === userId && (
          <div className="flex items-center justify-center">
            <LuCrown className="text-lg" />
          </div>
        )}

      </div>
    </div>
  );
};

export default CardUser;


