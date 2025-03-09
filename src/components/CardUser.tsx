import { capFirstLetter } from "@/utils/format";
import Image from "next/image";
import user2 from "../app/assets/user2.webp";
import React from "react";

export type CardUserProps = {
  name: string;
  hostId: string;
  userId: string;
  isSelected: boolean;
};

const CardUser = ({ name, isSelected, userId, hostId }: CardUserProps) => {
  return (
    <div
      className={`border w-70 h-20 border-neutral-200 rounded-lg p-3 mb-2 gap-2 mr-6 cursor-pointer 
      ${isSelected ? "bg-blue-200 border-blue-500" : "hover:bg-gray-100"}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start ml-2 mr-2 mb-4">
          <Image
            src={user2}
            width={50}
            height={60}
            alt="user"
            className="rounded-full"
          />
          <div className="flex flex-col ml-4 ">
            <h6 className="font-bold">{capFirstLetter(name)}</h6>
            {hostId === userId ? (
              <div className="flex items-center justify-start">
                <span>Host</span>
              </div>
            ) : (
              <div className="flex items-center justify-start">
                <span>User</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardUser;
