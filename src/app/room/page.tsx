import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Users from "@/components/Users";

const Room = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-linear-to-r from-cyan-500 to-blue-500">
    <Navbar />
    <div className="flex items-center">
      <Container />
      <Users />
    </div>
  </div>
  )
}

export default Room
