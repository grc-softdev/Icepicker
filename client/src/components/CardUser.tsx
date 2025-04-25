import { RootState } from "@/state/redux";
import { capFirstLetter } from "@/utils/format";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

export type CardUserProps = {
  name: string;
  userId: string;
  isCurrent: boolean;
  avatar: string;
};

const CardUser = ({
  name,
  isCurrent,
  userId,
  avatar,
}: CardUserProps) => {
  const { data } = useSelector((state: RootState) => state.session);
  const hostId = data?.hostId
  return (
    <div
      className={`border w-full h-20 rounded-xl p-3 bg-background flex items-center gap-3 cursor-pointer transition-colors duration-300 
      ${
        isCurrent
          ? "bg-blue-300 border-neutral-200 shadow-lg"
          : "hover:bg-blue-200 border-neutral-200"
      }`}
    >
      {avatar && (
        <Image
          src={(avatar)}
          width={50}
          height={50}
          alt="avatar"
          className="rounded-full"
          priority
        />
      )}

      <div className="flex flex-col">
       {name &&  <span className="font-semibold">{capFirstLetter(name)}</span>}
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
