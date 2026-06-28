import { useAuth } from '../contexts/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export function TopNav() {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg text-white">Interview Prep AI</span>
      </div>
      
      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/80 border border-gray-700">
            <UserIcon className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-200">
              {user.full_name || user.username}
            </span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
              {user.plan}
            </span>
          </div>
          
          <button
            onClick={logout}
            className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
