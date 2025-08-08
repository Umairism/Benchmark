import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/database';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, Eye, EyeOff, Calendar, BarChart3 } from 'lucide-react';
import type { Article } from '../types';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    views: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserArticles();
      fetchUserStats();
    }
  }, [user]);

  const fetchUserArticles = async () => {
    if (!user) return;

    try {
      const allArticles = db.getAllArticles();
      const userArticles = allArticles
        .filter(article => article.author_id === user.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setArticles(userArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      const allArticles = db.getAllArticles();
      const userArticles = allArticles.filter(article => article.author_id === user.id);

      const total = userArticles.length;
      const published = userArticles.filter(a => a.published).length;
      const drafts = total - published;

      setStats({
        total,
        published,
        drafts,
        views: published * 150 // Mock view count
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const togglePublishStatus = async (articleId: string, currentStatus: boolean) => {
    try {
      db.updateArticle(articleId, { published: !currentStatus });

      setArticles(articles.map(article =>
        article.id === articleId
          ? { ...article, published: !currentStatus }
          : article
      ));
      fetchUserStats();
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  const deleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      db.deleteArticle(articleId);
      setArticles(articles.filter(article => article.id !== articleId));
      fetchUserStats();
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access the dashboard.</p>
          <Link
            to="/auth?mode=login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your articles and content.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Drafts</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.drafts}</p>
              </div>
              <Edit3 className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Views</p>
                <p className="text-2xl font-bold text-purple-600">{stats.views.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <div className="flex space-x-4">
            <Link
              to="/create"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Create New Article</span>
            </Link>
          </div>
        </div>

        {/* Articles List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Articles</h2>
            <p className="text-gray-600 text-sm mt-1">Manage and organize your content</p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your articles...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <Edit3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
                <p className="text-gray-600 mb-6">Start by creating your first article to share with the community.</p>
                <Link
                  to="/create"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center space-x-2"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Create Article</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{article.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{article.excerpt}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(article.created_at)}
                        </span>
                        <span className={`px-2 py-1 rounded-full font-medium ${
                          article.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {article.published ? 'Published' : 'Draft'}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/articles/${article.id}/edit`}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit article"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => togglePublishStatus(article.id, article.published)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          article.published
                            ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50'
                            : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                        }`}
                        title={article.published ? 'Unpublish' : 'Publish'}
                      >
                        {article.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete article"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
