import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeMenu }) => {
  const navigate = useNavigate();

  const menus = [
    { name: 'Overview', icon: 'grid', key: 'overview' },
    { name: 'Subjects List', icon: 'menu', key: 'subjects' },
    { name: 'Events List', icon: 'circle', key: 'events' }
  ];

  const renderIcon = (key) => {
    if (key === 'overview') {
      return (
        <div className="w-6 h-6 grid grid-cols-2 gap-1 mr-3">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-sm"></div>)}
        </div>
      );
    } else if (key === 'subjects') {
      return (
        <div className="w-6 h-6 mr-3">
          <div className="space-y-1">
            <div className="h-1 bg-white rounded"></div>
            <div className="h-1 bg-white rounded"></div>
            <div className="h-1 bg-white rounded"></div>
          </div>
        </div>
      );
    } else {
      return <div className="w-6 h-6 mr-3 border-2 border-white rounded"></div>;
    }
  };

  return (
    <div className="w-64 bg-gradient-to-b from-[#498EFF] to-[#8ECAE6] text-white">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
          </div>
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
              {renderIcon(menu.key)}
              <span>{menu.name}</span>
            </div>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-6 left-6">
        <div className="flex items-center text-white hover:text-blue-200 cursor-pointer">
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