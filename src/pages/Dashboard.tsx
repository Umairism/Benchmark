import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/database';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit3, Trash2, Eye, EyeOff, Calendar, MessageCircle, TrendingUp, Users, BookOpen } from 'lucide-react';
import type { Article, Confession } from '../types';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    views: 0,
    confessions: 0,
    totalConfessions: 0
  });

  const fetchUserArticles = useCallback(async () => {
    if (!user) return;

    try {
      const allArticles = await db.getAllArticles();
      const userArticles = allArticles
        .filter(article => article.author_id === user.id)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setArticles(userArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUserConfessions = useCallback(async () => {
    if (!user) return;

    try {
      const userConfessions = await db.getConfessionsByUser(user.id);
      setConfessions(userConfessions.slice(0, 3)); // Get latest 3 confessions for dashboard
    } catch (error) {
      console.error('Error fetching confessions:', error);
    }
  }, [user]);

  const fetchUserStats = useCallback(async () => {
    if (!user) return;

    try {
      const allArticles = await db.getAllArticles();
      const userArticles = allArticles.filter(article => article.author_id === user.id);
      const userConfessions = await db.getConfessionsByUser(user.id);
      const allConfessions = await db.getAllConfessions();

      const total = userArticles.length;
      const published = userArticles.filter(a => a.published).length;
      const drafts = total - published;

      setStats({
        total,
        published,
        drafts,
        views: published * 150, // Mock view count
        confessions: userConfessions.length,
        totalConfessions: allConfessions.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserArticles();
      fetchUserConfessions();
      fetchUserStats();
    }
  }, [user, fetchUserArticles, fetchUserConfessions, fetchUserStats]);

  const togglePublishStatus = async (articleId: string, currentStatus: boolean) => {
    try {
      await db.updateArticle(articleId, { published: !currentStatus });

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
      await db.deleteArticle(articleId);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Welcome back, {user.full_name || user.email.split('@')[0]}!
          </h1>
          <p className="text-slate-600 text-lg">Here's what's happening with your content and community.</p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Articles</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <BookOpen className="h-10 w-10 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm mb-1">Published</p>
                <p className="text-3xl font-bold">{stats.published}</p>
              </div>
              <Eye className="h-10 w-10 text-emerald-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm mb-1">My Confessions</p>
                <p className="text-3xl font-bold">{stats.confessions}</p>
              </div>
              <MessageCircle className="h-10 w-10 text-amber-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Total Views</p>
                <p className="text-3xl font-bold">{stats.views.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Link
              to="/create"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 shadow-lg transform hover:scale-105"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Create New Article</span>
            </Link>
            <Link
              to="/confessions"
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center space-x-2 shadow-lg transform hover:scale-105"
            >
              <MessageCircle className="h-5 w-5" />
              <span>View All Confessions</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Articles Section */}
          <div className="xl:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Your Articles</h2>
                    <p className="text-slate-600 text-sm mt-1">Manage and organize your content</p>
                  </div>
                  <Link
                    to="/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>New</span>
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading your articles...</p>
                  </div>
                ) : articles.length === 0 ? (
                  <div className="text-center py-12">
                    <Edit3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">No articles yet</h3>
                    <p className="text-slate-600 mb-6">Start by creating your first article to share with the community.</p>
                    <Link
                      to="/create"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 inline-flex items-center space-x-2 shadow-lg"
                    >
                      <PlusCircle className="h-5 w-5" />
                      <span>Create Article</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {articles.slice(0, 5).map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 hover:shadow-md">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-800 mb-1">{article.title}</h3>
                          <p className="text-slate-600 text-sm mb-2 line-clamp-2">{article.excerpt}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(article.created_at)}
                            </span>
                            <span className={`px-3 py-1 rounded-full font-medium ${
                              article.published 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {article.published ? 'Published' : 'Draft'}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
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
                                ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                                : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
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
                    {articles.length > 5 && (
                      <div className="text-center pt-4">
                        <p className="text-slate-600 text-sm">Showing 5 of {articles.length} articles</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Confessions Sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Recent Confessions</h2>
                    <p className="text-slate-600 text-sm mt-1">Your latest thoughts</p>
                  </div>
                  <Link
                    to="/confessions"
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {confessions.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-medium text-slate-800 mb-2">No confessions yet</h3>
                    <p className="text-slate-600 text-xs mb-4">Share your thoughts with the community</p>
                    <Link
                      to="/confessions"
                      className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 text-sm inline-flex items-center space-x-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Start Sharing</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {confessions.map((confession) => (
                      <div key={confession.id} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                        <p className="text-slate-700 text-sm line-clamp-3 mb-3">
                          {confession.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            {formatDate(confession.created_at)}
                          </span>
                          <Link
                            to="/confessions"
                            className="text-purple-600 hover:text-purple-700 text-xs font-medium"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-slate-200">
                      <Link
                        to="/confessions"
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 text-sm font-medium text-center block"
                      >
                        View All Confessions
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Community Stats */}
            <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Community Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">Total Confessions</p>
                        <p className="text-xs text-slate-600">Community wide</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-blue-600">{stats.totalConfessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">Your Articles</p>
                        <p className="text-xs text-slate-600">Published content</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-emerald-600">{stats.published}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
