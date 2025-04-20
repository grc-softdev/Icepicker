import Image from "next/image";
import nav from "../app/assets/nav.png";

const Navbar = () => {
  return (
    <div className="flex items-center justify-center md:justify-start mx-20 lg:mb-0 xl:mb-4">
        <Image src={nav} width={120} height={90} alt="logo" />
    </div>
  );
};

export default Navbar;
