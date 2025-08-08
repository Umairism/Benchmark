import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { RefreshCw, User, Database } from 'lucide-react';
import { db } from '../../lib/database';

const AuthDebugger: React.FC = () => {
  const { user, loading, refetchUser } = useAuth();

  const getCurrentUserFromDB = () => {
    const dbUser = db.getCurrentUser();
    console.log('Direct database user check:', dbUser);
    return dbUser;
  };

  const getAllUsers = () => {
    const allUsers = db.getAllUsers();
    console.log('All users in database:', allUsers);
    return allUsers;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="text-xs text-gray-600 mb-2">Auth Debug Panel</div>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
        </div>
        
        <div>
          <strong>User State:</strong> 
          <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-auto">
            {user ? JSON.stringify(user, null, 2) : 'null'}
          </pre>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={refetchUser}
            className="flex items-center space-x-1 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Refetch</span>
          </button>
          
          <button
            onClick={getCurrentUserFromDB}
            className="flex items-center space-x-1 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
          >
            <Database className="h-3 w-3" />
            <span>Check DB</span>
          </button>
          
          <button
            onClick={getAllUsers}
            className="flex items-center space-x-1 bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600"
          >
            <User className="h-3 w-3" />
            <span>All Users</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugger;
