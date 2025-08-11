import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { 
  User as UserIcon, 
  Mail, 
  GraduationCap, 
  Camera, 
  Calendar, 
  Heart, 
  ThumbsDown, 
  Star,
  Save,
  Upload,
  X,
  Plus
} from 'lucide-react';
import type { User } from '../types';

const Profile: React.FC = () => {
  const { user, refetchUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<Partial<User>>({
    full_name: '',
    email: '',
    faculty: '',
    bio: '',
    likes: [],
    dislikes: [],
    interests: []
  });
  const [newLike, setNewLike] = useState('');
  const [newDislike, setNewDislike] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        email: user.email || '',
        faculty: user.faculty || '',
        bio: user.bio || '',
        likes: user.likes || [],
        dislikes: user.dislikes || [],
        interests: user.interests || []
      });
      setPreviewImage(user.profile_picture || '');
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadProfileImage = async (): Promise<string | null> => {
    if (!profileImageFile || !user) return null;

    try {
      const fileExt = profileImageFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, profileImageFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const addItem = (type: 'likes' | 'dislikes' | 'interests', value: string) => {
    if (!value.trim()) return;
    
    setProfileData(prev => ({
      ...prev,
      [type]: [...(prev[type] || []), value.trim()]
    }));

    // Clear the input
    if (type === 'likes') setNewLike('');
    if (type === 'dislikes') setNewDislike('');
    if (type === 'interests') setNewInterest('');
  };

  const removeItem = (type: 'likes' | 'dislikes' | 'interests', index: number) => {
    setProfileData(prev => ({
      ...prev,
      [type]: prev[type]?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      let profilePictureUrl = user.profile_picture;

      // Upload new profile image if selected
      if (profileImageFile) {
        const uploadedUrl = await uploadProfileImage();
        if (uploadedUrl) {
          profilePictureUrl = uploadedUrl;
        }
      }

      // Update user profile in database
      const { error } = await supabase
        .from('users')
        .update({
          full_name: profileData.full_name,
          faculty: profileData.faculty,
          bio: profileData.bio,
          profile_picture: profilePictureUrl,
          likes: profileData.likes,
          dislikes: profileData.dislikes,
          interests: profileData.interests,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh user data
      await refetchUser();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatJoiningDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-4">
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg">
                  <img
                    src={previewImage || user.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email)}&size=128&background=3b82f6&color=fff`}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{user.full_name || 'User'}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {formatJoiningDate(user.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.full_name || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faculty/Department
                </label>
                <select
                  value={profileData.faculty || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, faculty: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Faculty</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Arts & Sciences">Arts & Sciences</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Law">Law</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={profileData.bio || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Likes Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              Likes
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {profileData.likes?.map((like, index) => (
                <span
                  key={index}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {like}
                  <button
                    type="button"
                    onClick={() => removeItem('likes', index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newLike}
                onChange={(e) => setNewLike(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('likes', newLike))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add something you like..."
              />
              <button
                type="button"
                onClick={() => addItem('likes', newLike)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dislikes Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <ThumbsDown className="w-5 h-5 mr-2 text-gray-500" />
              Dislikes
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {profileData.dislikes?.map((dislike, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {dislike}
                  <button
                    type="button"
                    onClick={() => removeItem('dislikes', index)}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newDislike}
                onChange={(e) => setNewDislike(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('dislikes', newDislike))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add something you dislike..."
              />
              <button
                type="button"
                onClick={() => addItem('dislikes', newDislike)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interests Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Interests
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {profileData.interests?.map((interest, index) => (
                <span
                  key={index}
                  className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeItem('interests', index)}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('interests', newInterest))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add an interest..."
              />
              <button
                type="button"
                onClick={() => addItem('interests', newInterest)}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
