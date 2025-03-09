import { capFirstLetter } from "@/utils/format";
import Image from "next/image";
import React from "react";
import { CiBacon } from "react-icons/ci";
import { FiMessageCircle } from "react-icons/fi";

export type CardUserProps = {
  name: string;
  isHost?: boolean;
};

const CardUser = ({ name, isHost = false }: CardUserProps) => {
  return (
    <div className="border max-w-70 max-h-24 border-neutral-200 rounded-lg p-3 mb-2 gap-2 mr-6">
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
            {isHost && <span className="text-sm text-gray-500">Host</span>}
          </div>
        </div>
        <div className="flex items-start justify-center">
          <span className="flex items-center bg-neutral-200 hover:bg-red-200 px-1.5 rounded-full text-sm">
            x
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        {isHost && (
          <div className="flex items-center justify-center">
            <CiBacon className="text-lg" />
            <span className="ml-1">Host</span>
          </div>
        )}
        <div className="flex items-center justify-center ml-2 cursor-pointer">
          <FiMessageCircle />
          <span className="ml-1">2</span>
        </div>
      </div>
    </div>
  );
};

export default CardUser;


