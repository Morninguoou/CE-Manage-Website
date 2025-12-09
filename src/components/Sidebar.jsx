import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, BookText, CalendarClock, User, BriefcaseBusiness, Bot } from 'lucide-react';

const Sidebar = ({ activeMenu }) => {
  const navigate = useNavigate();

  const menus = [
    // { name: 'Overview', icon: LayoutGrid, key: 'overview' },
    { name: 'Subjects List', icon: BookText, key: 'subjectslist' },
    { name: 'Events List', icon: CalendarClock, key: 'eventslist' },
    { name: 'Faculty Member', icon: BriefcaseBusiness, key: 'facultymemberslist' },
    { name: 'Student', icon: User, key: 'studentslist' },
    { name: 'CE-GPT', icon: Bot, key: 'cegpt' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-[#498EFF] to-[#8ECAE6] text-white">
      <div className="p-6">
        <div className="flex items-center mb-2">
          <div className="min-w-10 h-16 mx-auto mt-4">
            <img 
              src="/src/assets/images/icon.png" 
              alt="CE Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="flex items-center mb-6 px-6">
          <h1 className="text-xl font-bold">CE Admin Center</h1>
        </div>

        <nav className="space-y-2">
          {menus.map((menu) => (
            <div
              key={menu.key}
              className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                activeMenu === menu.key ? 'bg-blue-400' : 'hover:bg-blue-400'
              }`}
              onClick={() => navigate(`/${menu.key}`)}
            >
              <menu.icon className="w-6 h-6 mr-3" />
              <span>{menu.name}</span>
            </div>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-6 left-6">
        <div className="flex items-center px-12 text-white hover:text-blue-200 cursor-pointer">
          <div className="w-6 h-6 mr-3">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5z"/>
              <path d="M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </div>
          <span>Log out</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;