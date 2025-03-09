import Image from "next/image";
import joinlogo from "../app/assets/joinlogo.png";
import { ToastContainer, toast } from "react-toastify";

import Link from "next/link";

const Navbar = ({ sessionLink }: { sessionLink: string }) => {
  
  return (
    <div className="flex items-center justify-center">
       <Link href={"/"}>
      <Image src={joinlogo} width={100} height={120} alt="logo" />
      </Link>
    </div>
  );
};

export default Navbar;
