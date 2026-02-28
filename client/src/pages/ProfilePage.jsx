import React, { useEffect, useState, useContext } from "react";
import authService from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Card from "../components/Card";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(user || null);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await authService.getProfile();
      setProfile(res.data.user || res.data);
    } catch (err) {
      console.error(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  };

  fetchProfile();
}, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await authService.uploadProfileImage(formData);
      setProfile(res.data.user);
    } catch (err) {
      console.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (!profile)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="flex justify-center items-center p-4 pt-20">
      <Card className="w-full max-w-md p-6 shadow-2xl rounded-2xl bg-white">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={
                profile.profileImage
                  ? profile.profileImage
                  : "/default-avatar.png"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-md"
            />

            <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer shadow-lg">
              📷
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {loading && (
            <p className="text-sm text-indigo-600 mt-2">Uploading...</p>
          )}
        </div>

        {/* User Info */}
        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Name</span>
            <span>{profile.name}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Email</span>
            <span>{profile.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Role</span>
            <span className="capitalize">{profile.role || "User"}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
