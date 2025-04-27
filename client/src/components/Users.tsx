import React, { useEffect, useState } from "react";
import CardUser from "./CardUser";
import { User } from "@/app/session/[sessionId]/page";
import { toast, ToastContainer } from "react-toastify";
import { GoCopy } from "react-icons/go";
import { useSelector } from "react-redux";
import { RootState } from "@/state/redux";
import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";

type UsersProps = {
  users: User[] | undefined;
  sessionLink: string | undefined;
  sessionId: string;
};

const Users = ({ users, sessionLink, sessionId }: UsersProps) => {
  const [copied, setCopied] = useState(false);
  const { data } = useSelector((state: RootState) => state.session);
  const [showTooltip, setShowTooltip] = useState(true);

  const currentUser = data?.currentUser;

  const copToClip =
    "https://main.d9pxq75h0yt4e.amplifyapp.com/" + `${sessionId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sessionLink || "");
    setCopied(true);
    toast("Invite your friends! =)");
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#3B82F6",
      color: "#f9fafb",
      fontSize: "0.875rem",
      padding: "10px 14px",
      borderRadius: "8px",
      maxWidth: 220,
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: "#3B82F6",
    },
  }));

  return (
    <section className="flex flex-col mt-6 sm:mt-6 md:mt-0">
      <ToastContainer />
      <div className="flex flex-col justify-between min-h-[600px] w-[340px] p-4 bg-white rounded-2xl shadow-lg border border-neutral-200">
        <div className="flex flex-col gap-2 overflow-y-auto pr-2 max-h-[480px]">
          {users?.map((user) => {
            console.log(user, currentUser);
            return (
              <CardUser
                name={user.name}
                key={user.id ?? user.name}
                avatar={user.avatar}
                userId={user.id}
                isCurrent={currentUser?.id === user.id}
              />
            );
          })}
        </div>

        {sessionLink && (
          <div className="mt-6">
            <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl shadow-sm bg-gray-50">
              <input
                type="text"
                className="flex-1 px-3 py-2 text-sm text-gray-600 bg-transparent focus:outline-none"
                value={`${copToClip.substring(0, 28)}...`}
                readOnly
              />
              <CustomTooltip
                title="Share with others to play"
                open={showTooltip && !copied}
                arrow
                placement="top"
                disableFocusListener
                disableHoverListener
                disableTouchListener
              >
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {!copied ? (
                    <GoCopy />
                  ) : (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 16 12"
                    >
                      <path d="M1 5.917 5.724 10.5 15 1.5" />
                    </svg>
                  )}
                </button>
              </CustomTooltip>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Users;
