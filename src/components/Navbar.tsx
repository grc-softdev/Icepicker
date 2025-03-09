import Image from "next/image";
import nav from "../app/assets/nav.png";

import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex items-center justify-start mt-4 mx-24 mb-4">
      <Link href={"/"}>
        <Image src={nav} width={80} height={100} alt="logo" />
      </Link>
    </div>
  );
};

export default Navbar;
