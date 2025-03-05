import Image from "next/image";
import logo from "../app/assets/logo.png";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between gap-16 mx-8">
      <Image src={logo} width={120} height={120} alt="logo" />
      <div className="flex items-center justify-between gap-12">
        <div className="text-marine hover:text-greenblue font-medium">home</div>
        <div className="text-marine hover:text-greenblue font-medium">about</div>
        <div className="text-marine hover:text-greenblue font-medium">logout</div>
      </div>
    </div>
  );
};

export default Navbar;
