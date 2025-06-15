import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function EditObservationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [observation, setObservation] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [objectsInField, setObjectsInField] = useState([]);
  const [showObjects, setShowObjects] = useState(false);

  useEffect(() => {
    const fetchObservation = async () => {
      try {
        const res = await fetch(`http://localhost:8000/observations/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setObservation(data);
          setTitle(data.title || "");
          setDescription(data.description || "");
          setObjectsInField(data.objects_in_field || []);
        } else {
          alert("Failed to load observation: " + (data.detail || "Unknown error"));
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching observation.");
      } finally {
        setLoading(false);
      }
    };

    fetchObservation();
  }, [id]);

  const handleAstronomyDataChange = (index, field, value) => {
    const updatedObjects = [...objectsInField];
    updatedObjects[index] = { ...updatedObjects[index], [field]: value };
    setObjectsInField(updatedObjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!observation) return;

    const payload = {
      title,
      description,
      calibration: observation.calibration,
      objects_in_field: objectsInField,
    };

    try {
      const res = await fetch(`http://localhost:8000/observations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Observation updated successfully!");
        navigate("/profile");
      } else {
        alert("Update failed: " + (data.detail || "Unknown error"));
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong. Check the console.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="edit-observation-container">
      <h1 className="edit-title">{t("editObservation.title")}</h1>
      <h3 className="edit-subtitle">{t("editObservation.subtitle")}</h3>

      <form onSubmit={handleSubmit} className="edit-form">
        <img src={observation.image_url} alt="Observation" className="observation-preview" />

        <div>
          <label className="form-label">{t("editObservation.labelTitle")}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
            placeholder={t("editObservation.placeholderTitle")}
          />
        </div>

        <div>
          <label className="form-label">{t("editObservation.labelDescription")}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="form-input"
            placeholder={t("editObservation.placeholderDescription")}
          ></textarea>
        </div>

        <div>
          <label className="section-subtitle">{t("editObservation.calibration")}</label>
          <div className="calibration-grid">
            {Object.keys(observation.calibration || {}).map((key) => (
              <div key={key}>
                <label className="form-sub-label capitalize">{key}</label>
                <input
                  type="number"
                  step="any"
                  value={observation.calibration[key]}
                  onChange={(e) =>
                    setObservation((prev) => ({
                      ...prev,
                      calibration: {
                        ...prev.calibration,
                        [key]: parseFloat(e.target.value),
                      },
                    }))
                  }
                  className="form-input"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="section-subtitle">{t("editObservation.objectsInField")}</label>
          <button
            type="button"
            onClick={() => setShowObjects(!showObjects)}
            className="mb-4 bg-yellow-400 text-black px-4 py-1 rounded-lg hover:bg-yellow-300 transition"
          >
            {showObjects
              ? t("editObservation.hideObjects")
              : t("editObservation.showObjects", { count: objectsInField.length })}
          </button>

          {showObjects &&
            objectsInField.map((object, index) => (
              <div key={index} className="object-item">
                <div>
                  <label className="form-sub-label">
                    {t("editObservation.object")} {index + 1}
                  </label>
                  <input
                    type="text"
                    value={object.name || ""}
                    onChange={(e) =>
                      handleAstronomyDataChange(index, "name", e.target.value)
                    }
                    placeholder={t("editObservation.objectPlaceholder")}
                    className="form-input"
                  />
                </div>
              </div>
            ))}
        </div>

        <button type="submit" className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
          {t("editObservation.save")}
        </button>
      </form>
    </div>
  );
}
