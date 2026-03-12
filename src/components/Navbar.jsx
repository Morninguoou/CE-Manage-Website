import { User, ChevronDown } from "lucide-react";

const Navbar = ({ title }) => {
  return (
    <div className="bg-[#FDF0D5] shadow-sm border-b">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-2xl font-bold text-blue-600">{title}</h2>
        {/* <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
            <User size={20} />
          </div>
          <ChevronDown size={20} className="text-gray-400" />
        </div> */}
      </div>
    </div>
  );
};

export default Navbar;