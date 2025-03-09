import React, { useState } from "react";
import CardUser from "./CardUser";
import { User } from "@/app/session/[sessionId]/page";
import { toast, ToastContainer } from "react-toastify";
import { GoCopy } from "react-icons/go";

type UsersProps = {
  hostName: string;
  users: User[];
  hostId: string;
  userId: string;
  selectedUser: User;
  setSelectedUser: React.Dispatch<React.SetStateAction<User>>;
  sessionLink: string;
};

const Users = ({ hostId, users, selectedUser, sessionLink }: UsersProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sessionLink || "");
    setCopied(true); 

    toast("Invite your friends! =)");

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-w-[300px] ml-4 h-[600px] overflow-scroll">
      {users.map((user) => {
        return (
          <CardUser
            key={user.id}
            name={user.name}
            hostId={hostId}
            userId={user.id}
            isSelected={selectedUser?.id === user.id}
          />
        );
      })}

      <div className="flex items-center justify-between h-12 mt-10">
        <ToastContainer />

        {sessionLink && (
          <div className="flex items-center justify-center rounded-md w-full mr-6 p-2 gap-x-2 bg-background  border border-neutral-200 mb-4 py-3 text-sm font-semibold shadow-sm">
            <input
              type="text"
              className="border border-neutral-200 text-gray-500 text-sm rounded-lg w-full p-2.5"
              value={sessionLink}
              readOnly
            />
            <button
              onClick={handleCopyLink}
              className="text-white bg-blue-200 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto py-2.5 text-center items-center inline-flex justify-center"
            >
              {!copied ? (
                <div className=" sm:px px-4"><GoCopy  /></div>
                
              ) : (
                <div className="inline-flex items-center sm:px-2 px-4">
                  <svg
                    className=" h-3 text-white me-1.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 12"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5.917 5.724 10.5 15 1.5"
                    />
                  </svg>
                </div>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
