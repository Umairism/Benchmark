import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag } from 'lucide-react';
import type { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'news':
        return 'bg-green-100 text-green-800';
      case 'announcement':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const cardClass = featured
    ? "group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden col-span-2"
    : "group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden";

  return (
    <article className={cardClass}>
      {article.image_url && (
        <div className="relative overflow-hidden h-48">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(article.created_at)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <Link 
              to={`/user/${article.author_id}`}
              className="hover:text-blue-600 transition-colors"
            >
              {article.author_name}
            </Link>
          </div>
        </div>

        <Link to={`/article/${article.id}`} className="group">
          <h3 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 ${featured ? 'text-2xl mb-3' : 'text-lg mb-2'}`}>
            {article.title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {article.tags.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="h-4 w-4 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          to={`/article/${article.id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
        >
          Read more →
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;