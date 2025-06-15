import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsername(data.username || "");
      setBio(data.bio || "");
      setPreview(data.avatar_url ? `http://localhost:8000${data.avatar_url}` : null);
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (avatar) {
      formData.append("file", avatar);
    }

    const res = await fetch("http://localhost:8000/users/me", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      const updatedProfile = await res.json();
      localStorage.setItem("profile", JSON.stringify(updatedProfile));
      navigate("/profile", { replace: true });
    } else {
      const data = await res.json();
      alert("Error updating profile: " + (data.detail || "Unknown error"));
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-form">
        <h2 className="edit-profile-title">{t("editProfile.title")}</h2>
        <form onSubmit={handleSubmit} className="edit-profile-form-fields">
          <div>
            <label className="edit-profile-label">{t("editProfile.username")}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="edit-profile-input"
              placeholder={t("editProfile.usernamePlaceholder")}
              required
            />
          </div>

          <div>
            <label className="edit-profile-label">{t("editProfile.bio")}</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="edit-profile-textarea"
              placeholder={t("editProfile.bioPlaceholder")}
            ></textarea>
          </div>

          <div>
            <label className="edit-profile-label">{t("editProfile.avatarLabel")}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="edit-profile-file-input"
            />
          </div>

          {preview && (
            <img src={preview} alt="Preview" className="edit-profile-preview" />
          )}

          <button type="submit" className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition">
            {t("editProfile.save")}
          </button>
        </form>
      </div>
    </div>
  );
}
