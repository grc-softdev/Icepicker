import Image from "next/image";
import logo from "../app/assets/logo.png";
import { ToastContainer, toast } from "react-toastify";

import Link from "next/link";

const Navbar = ({ sessionLink }: { sessionLink: string }) => {
  // const handleCopyLink = () => {
  //   navigator.clipboard.writeText(sessionLink || "");
  //   toast("Invite your friends! =)");
  // };
  return (
    <div className="flex items-center justify-center">
       <Link href={"/"}>
      <Image src={logo} width={100} height={120} alt="logo" />
      </Link>
    </div>
  );
};

export default Navbar;
