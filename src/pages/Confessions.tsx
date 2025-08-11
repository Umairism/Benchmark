import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/database';
import { MessageCircle, Plus, Edit2, Trash2, Calendar, Send, User as UserIcon } from 'lucide-react';
import type { Confession } from '../types';

const Confessions: React.FC = () => {
  const { user } = useAuth();
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [newConfession, setNewConfession] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchConfessions = useCallback(async () => {
    if (!user) return;
    
    try {
      // Get all confessions for signed-in users to view
      const allConfessions = await db.getAllConfessions();
      setConfessions(allConfessions);
    } catch (error) {
      console.error('Error fetching confessions:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConfessions();
  }, [fetchConfessions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newConfession.trim()) return;

    setSubmitting(true);
    try {
      await db.createConfession({
        user_id: user.id,
        content: newConfession.trim()
      });
      
      setNewConfession('');
      await fetchConfessions();
    } catch (error) {
      console.error('Error creating confession:', error);
      alert('Failed to save confession. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (confession: Confession) => {
    setEditingId(confession.id);
    setEditingContent(confession.content);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingContent.trim()) return;

    try {
      await db.updateConfession(editingId, {
        content: editingContent.trim()
      });
      
      setEditingId(null);
      setEditingContent('');
      await fetchConfessions();
    } catch (error) {
      console.error('Error updating confession:', error);
      alert('Failed to update confession. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this confession?')) return;

    try {
      await db.deleteConfession(id);
      await fetchConfessions();
    } catch (error) {
      console.error('Error deleting confession:', error);
      alert('Failed to delete confession. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const [userDisplayNames, setUserDisplayNames] = useState<Record<string, string>>({});

  const getUserDisplayName = (userId: string) => {
    if (userId === user?.id) {
      return 'You';
    }
    return userDisplayNames[userId] || 'Anonymous';
  };

  useEffect(() => {
    const fetchDisplayNames = async () => {
      const ids = Array.from(new Set(confessions.map(c => c.user_id).filter(id => id !== user?.id)));
      const newDisplayNames: Record<string, string> = {};
      await Promise.all(ids.map(async (id) => {
        const confessionUser = await db.getUserById(id);
        newDisplayNames[id] =
          confessionUser?.full_name ||
          confessionUser?.email?.split('@')[0] ||
          'Anonymous';
      }));
      setUserDisplayNames(newDisplayNames);
    };
    if (confessions.length > 0) {
      fetchDisplayNames();
    }
  }, [confessions, user]);

  const isOwnConfession = (confession: Confession) => {
    return confession.user_id === user?.id;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need to be logged in to view confessions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Confessions</h1>
          <p className="text-gray-600">Anonymous thoughts and reflections from the community. Share your own or read others'.</p>
        </div>

        {/* New Confession Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Plus className="inline h-4 w-4 mr-1" />
                Share a Confession
              </label>
              <textarea
                value={newConfession}
                onChange={(e) => setNewConfession(e.target.value)}
                placeholder="Share your thoughts anonymously with the community..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
                required
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {newConfession.length}/500 characters
                </span>
                <button
                  type="submit"
                  disabled={submitting || !newConfession.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? 'Saving...' : 'Save Confession'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Confessions List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading confessions...</p>
            </div>
          ) : confessions.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No confessions yet</h3>
              <p className="text-gray-600 mb-6">Be the first to share a confession with the community.</p>
            </div>
          ) : (
            confessions.map((confession) => (
              <div key={confession.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(confession.created_at)}
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      <span className={isOwnConfession(confession) ? "font-medium text-blue-600" : ""}>
                        {getUserDisplayName(confession.user_id)}
                      </span>
                    </div>
                  </div>
                  {isOwnConfession(confession) && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(confession)}
                        className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors duration-200"
                        title="Edit confession"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(confession.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors duration-200"
                        title="Delete confession"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {editingId === confession.id ? (
                  <div>
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-3"
                      rows={3}
                      maxLength={500}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {editingContent.length}/500 characters
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditingContent('');
                          }}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          disabled={!editingContent.trim()}
                          className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {confession.content}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Confessions;
