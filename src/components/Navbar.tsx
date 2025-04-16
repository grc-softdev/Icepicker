import Image from "next/image";
import nav from "../app/assets/nav.png";

import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex items-center justify-start mx-20 lg:mb-0 xl:mb-4">
      <Link href={"/"}>
        <Image src={nav} width={120} height={90} alt="logo" />
      </Link>
    </div>
  );
};

export default Navbar;
