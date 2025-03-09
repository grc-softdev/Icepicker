'use client'
import Image from "next/image";
import logo from "../app/assets/logo.png";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';

import Link from "next/link";


const Navbar = ({ sessionLink }: {sessionLink: string}) => {

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sessionLink || "");
    toast("Invite your friends! =)");
  };
  return (
    <div className="flex items-center justify-between gap-16 mx-12">
      <Image src={logo} width={120} height={120} alt="logo" />
      <div className="flex items-center justify-between gap-10">
        <Link href={'/'}>
        <div className="text-marine font-bold hover:text-greenblue cursor-pointer">Home</div>
        </Link>
        <ToastContainer />

        {sessionLink && (
          <div
            onClick={handleCopyLink}
            className="text-marine hover:text-greenblue font-bold cursor-pointer"
          >
            Invite
          </div>
        )}
        <div className="text-marine hover:text-greenblue font-bold cursor-pointer">
          Logout
        </div>
      </div>
    </div>
  );
};

export default Navbar;


