import React from "react";
import CardUser from "./CardUser";
import { User } from "@/app/session/[sessionId]/page";

type UsersProps = {
  hostName: string;
  users: User[];
  hostId: string;
  userId: string;
  selectedUser: User;
  setSelectedUser: React.Dispatch<React.SetStateAction<User>>
}

const Users = ({ hostId, users, selectedUser, setSelectedUser}:UsersProps) => {
  
  return (
    <div className="min-w-[300px] ml-4">
      <div className="overflow-y-auto">
        {users.map((user) => (
          <CardUser key={user.id} name={user.name} hostId={hostId} userId={user.id} isSelected={selectedUser?.id === user.id} onClick={() => setSelectedUser(user)} />
        ))}
      </div>
      <div className="flex items-center justify-between h-12">
        <input
          placeholder=" message"
          className="border border-solid rounded-sm"
        />
        <div className="mr-12 border border-solid px-3">send</div>
      </div>
    </div>
  );
};

export default Users;
