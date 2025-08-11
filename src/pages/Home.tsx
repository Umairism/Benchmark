import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../lib/database';
import ArticleCard from '../components/Articles/ArticleCard';
import { BookOpen, Users, Award, TrendingUp, ArrowRight } from 'lucide-react';
import type { Article } from '../types';

const Home: React.FC = () => {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      // Fetch all published articles
      const publishedArticles = await db.getPublishedArticles();
      
      // Filter featured articles
      const featured = publishedArticles
        .filter(article => article.featured)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 2);

      // Get recent articles
      const recent = publishedArticles
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 6);

      setFeaturedArticles(featured);
      setRecentArticles(recent);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: BookOpen, label: 'Articles Published', value: '500+' },
    { icon: Users, label: 'Community Members', value: '1,200+' },
    { icon: Award, label: 'Awards Received', value: '15' },
    { icon: TrendingUp, label: 'Monthly Readers', value: '10K+' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-4 h-4 bg-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-2 h-2 bg-yellow-400 rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-3 h-3 bg-purple-400 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-4 h-4 bg-blue-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-300 rounded-full"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Welcome to
                <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                  Benchmark Club
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                Where knowledge meets innovation. Join our community of learners, educators, and thought leaders
                sharing insights, news, and educational excellence.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/articles"
                className="group bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl transform hover:scale-105"
              >
                <span>Explore Articles</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to="/auth?mode=signup"
                className="group border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 hover:border-white/50 transition-all duration-300 shadow-xl transform hover:scale-105"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-400/20 rounded-full blur-xl"></div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Impact</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Numbers that reflect our commitment to educational excellence and community growth</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                  <stat.icon className="h-10 w-10 text-blue-600" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">{stat.value}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-6">Featured Stories</h2>
              <p className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
                Discover our most impactful content, carefully selected to inspire and inform our community.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map(article => (
                <ArticleCard key={article.id} article={article} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Articles */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent mb-4">Latest Updates</h2>
              <p className="text-slate-600 text-lg">Stay informed with our newest articles, news, and announcements.</p>
            </div>
            <Link
              to="/articles"
              className="hidden md:flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium bg-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>View All Articles</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg animate-pulse overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-slate-200 rounded mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded mb-3"></div>
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
              <div className="text-center mt-16">
                <Link
                  to="/articles"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 inline-flex items-center space-x-3 shadow-xl transform hover:scale-105"
                >
                  <span>View All Articles</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Share Your Knowledge?</h2>
          <p className="text-blue-100 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Join our community of educators and learners. Share your insights, experiences, and help shape the future of education.
          </p>
          <Link
            to="/auth?mode=signup"
            className="group bg-white text-blue-600 px-10 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all duration-300 inline-flex items-center space-x-3 shadow-2xl transform hover:scale-105"
          >
            <span>Get Started Today</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;