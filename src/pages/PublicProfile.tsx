import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  User as UserIcon, 
  Mail, 
  GraduationCap, 
  Calendar, 
  Heart, 
  ThumbsDown, 
  Star,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  ArrowLeft,
  MessageCircle
} from 'lucide-react';
import type { User } from '../types';

const PublicProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setError('User ID not provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setUser({
          ...data,
          social_media: data.social_media as User['social_media']
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('User not found');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const getSocialMediaIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'github': return <Github className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      default: return null;
    }
  };

  const getSocialMediaColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'text-blue-600 hover:text-blue-700';
      case 'twitter': return 'text-blue-400 hover:text-blue-500';
      case 'instagram': return 'text-pink-600 hover:text-pink-700';
      case 'linkedin': return 'text-blue-700 hover:text-blue-800';
      case 'github': return 'text-gray-800 hover:text-gray-900';
      case 'youtube': return 'text-red-600 hover:text-red-700';
      default: return 'text-gray-600 hover:text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 inline-flex items-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.full_name || 'Profile'}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-100 border-4 border-blue-200 flex items-center justify-center">
                  <UserIcon className="w-16 h-16 text-blue-600" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.full_name || 'Anonymous User'}
              </h1>
              
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-gray-600 mb-4">
                <div className="flex items-center justify-center md:justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {user.bio && (
                <p className="text-gray-700 leading-relaxed mb-4">{user.bio}</p>
              )}

              {/* Social Media Links */}
              {user.social_media && (
                <div className="flex justify-center md:justify-start space-x-4">
                  {Object.entries(user.social_media).map(([platform, url]) => 
                    url ? (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${getSocialMediaColor(platform)} transition-colors`}
                        title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                      >
                        {getSocialMediaIcon(platform)}
                      </a>
                    ) : null
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subjects */}
          {user.subjects && user.subjects.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-green-600" />
                O-Level Subjects
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Likes */}
          {user.likes && user.likes.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Likes
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.likes.map((like, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                  >
                    {like}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dislikes */}
          {user.dislikes && user.dislikes.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ThumbsDown className="w-5 h-5 mr-2 text-orange-500" />
                Dislikes
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.dislikes.map((dislike, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                  >
                    {dislike}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-4">
            Want to connect with {user.full_name || 'this user'}? Reach out through their social media or email!
          </p>
          <a
            href={`mailto:${user.email}`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Send Email
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
