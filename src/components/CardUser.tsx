import { capFirstLetter, userAvatar } from "@/utils/format";
import Image from "next/image";
import React from "react";

export type CardUserProps = {
  name: string;
  hostId: string;
  userId: string;
  isCurrent: boolean;
  avatar: string;
};

const CardUser = ({
  name,
  isCurrent,
  userId,
  hostId,
  avatar,
}: CardUserProps) => {
  return (
    <div
      className={`border w-full h-20 rounded-xl p-3 bg-background flex items-center gap-3 cursor-pointer transition-colors duration-300 
      ${
        isCurrent
          ? "bg-blue-200 border-blue-500"
          : "hover:bg-blue-300 border-neutral-200"
      }`}
    >
      {avatar && (
        <Image
          src={userAvatar(avatar)}
          width={50}
          height={50}
          alt="avatar"
          className="rounded-full"
        />
      )}

      <div className="flex flex-col">
        <span className="font-semibold">{capFirstLetter(name)}</span>
        {hostId === userId && (
          <span className="text-xs mt-1 text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full w-fit">
            Host
          </span>
        )}
      </div>
    </div>
  );
};

export default CardUser;
