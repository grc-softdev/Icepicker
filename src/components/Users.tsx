import React from "react";
import CardUser from "./CardUser";

type UsersProps = {
  hostName: string;
  users: User[];
}
export type User = {
  name: string;
  id:string;
}
const Users = ({ hostName, users}:UsersProps) => {
  return (
    <div className="min-w-[300px] ml-4">
      <div className="overflow-y-auto">

        <CardUser name={hostName} isHost/>
        {users.map((user) => (
          <CardUser key={user.id} name={user.name} />
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
