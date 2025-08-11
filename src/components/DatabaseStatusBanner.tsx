import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DatabaseStatus {
  users: boolean;
  articles: boolean;
  comments: boolean;
  confessions: boolean;
  overall: boolean;
}

export const DatabaseStatusBanner: React.FC = () => {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    const checkTable = async (tableName: 'users' | 'articles' | 'comments' | 'confessions'): Promise<boolean> => {
      try {
        const { error } = await supabase.from(tableName).select('*').limit(1);
        return !error || (!error.message.includes('does not exist') && !error.message.includes('relation') && !error.code?.includes('42P01'));
      } catch (error) {
        return false;
      }
    };

    const users = await checkTable('users');
    const articles = await checkTable('articles');
    const comments = await checkTable('comments');
    const confessions = await checkTable('confessions');

    const overall = users && articles && comments && confessions;

    setStatus({ users, articles, comments, confessions, overall });
  };

  if (!status) return null;

  if (status.overall) return null; // Don't show banner if everything is working

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Database Setup Required
          </h3>
          <p className="mt-1 text-sm text-yellow-700">
            Some database tables are not set up yet. The application will work with limited functionality.
          </p>
          <div className="mt-3 flex space-x-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm font-medium text-yellow-800 hover:text-yellow-600"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
            <a
              href="https://github.com/Umairism/Benchmark/blob/main/DATABASE_SETUP.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-yellow-800 hover:text-yellow-600"
            >
              Setup Instructions →
            </a>
          </div>
          
          {showDetails && (
            <div className="mt-3 text-sm text-yellow-700">
              <p className="font-medium mb-2">Table Status:</p>
              <ul className="space-y-1">
                <li className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${status.users ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  Users: {status.users ? 'Available' : 'Missing'}
                </li>
                <li className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${status.articles ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  Articles: {status.articles ? 'Available' : 'Missing'}
                </li>
                <li className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${status.comments ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  Comments: {status.comments ? 'Available' : 'Missing'}
                </li>
                <li className="flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${status.confessions ? 'bg-green-400' : 'bg-red-400'}`}></span>
                  Confessions: {status.confessions ? 'Available' : 'Missing'}
                </li>
              </ul>
              <p className="mt-2 text-xs">
                To enable full functionality, please run the database schema from the setup guide.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
