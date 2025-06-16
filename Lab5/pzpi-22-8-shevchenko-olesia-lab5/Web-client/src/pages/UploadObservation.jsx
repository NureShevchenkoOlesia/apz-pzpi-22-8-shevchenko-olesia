import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadAndEditObservation() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [observation, setObservation] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [objectsInField, setObjectsInField] = useState([]);
  const [showObjects, setShowObjects] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      let data;
      if (res.ok) {
        try {
          data = await res.json();
        } catch (err) {
          const fallbackText = await res.text();
          console.error("Failed to parse JSON:", err);
          console.error("Response text:", fallbackText);
          alert("Upload failed: Invalid response format.");
          return;
        }
      } else {
        const errorText = await res.text();
        console.error("Server returned error:", res.status, errorText);
        alert(`Upload failed: ${res.status}`);
        return;
      }

      if (res.ok) {
        console.log("Astrometry solved:", data);
        setObservation(data);
        const objectsArray = data.objects_in_field?.objects_in_field || [];
        setObjectsInField(
          Array.isArray(objectsArray)
            ? objectsArray.map((name) => ({
              name: name.replace(/\)+$/, ""),
              coordinates: "",
            }))
            : []
        );
      } else {
        console.error("Upload failed:", data.detail || "Unknown error");
        alert("Upload failed: " + (data.detail || "Unknown error"));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong. Check the console.");
    } finally {
      setLoading(false);
    }
  };

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
      image_url: observation.image_url,
      calibration: observation.calibration,
      objects_in_field: objectsInField,
      location: observation.location,
    };

    try {
      if (
        !payload.location ||
        typeof payload.location.latitude !== "number" ||
        isNaN(payload.location.latitude) ||
        typeof payload.location.longitude !== "number" ||
        isNaN(payload.location.longitude)
      ) {
        alert("Please provide valid latitude and longitude.");
        return;
      }      
      const res = await fetch("http://localhost:8000/observations/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Observation published successfully!");
        navigate("/profile");
      } else {
        console.error("Save failed:", data.detail || "Unknown error");
        if (Array.isArray(data.detail)) {
          const errorMessages = data.detail.map(err => {
            const loc = err.loc ? err.loc.join(" > ") : "";
            return `${loc}: ${err.msg}`;
          }).join("\n");
          alert("Save failed:\n" + errorMessages);
        } else {
          alert("Save failed: " + (data.detail || "Unknown error"));
        }
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Something went wrong. Check the console.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-serif items-center justify-center px-6 py-10">
      <h1 className="text-3xl font-serif font-semibold mb-4">
        Prepare Your Observation
      </h1>
      <h3 className="text-sm font-serif mb-8">
        Saw something pretty, baby? Let others see it too!
      </h3>

      {!observation ? (
        <form onSubmit={handleUpload} className="w-full max-w-md flex flex-col space-y-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full mx-auto text-white file:bg-yellow-400 file:text-black file:px-2 file:py-2 file:rounded file:border-0 hover:file:bg-yellow-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black py-2 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            {loading ? "Analyzing..." : "Upload and Analyze"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
          <img
            src={observation.image_url}
            alt="Uploaded sky"
            className="rounded-xl shadow-lg mx-auto w-64"
          />

          <div>
            <label className="block mb-1 text-sm">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 backdrop-blur-md focus:outline-none"
              placeholder="Give your observation a cool title"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 backdrop-blur-md focus:outline-none"
              placeholder="Tell us more about what you observed..."
            ></textarea>
          </div>

          {/* Calibration Section */}
          <div>
            <label className="block mb-2 text-base">Calibration Data</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              {Object.keys(observation.calibration || {}).map((key) => (
                <div key={key}>
                  <label className="block text-xs mb-1 capitalize">{key}</label>
                  <input
                    type="number"
                    step="any"
                    value={observation.calibration[key]}
                    onChange={(e) => {
                      setObservation((prev) => ({
                        ...prev,
                        calibration: {
                          ...prev.calibration,
                          [key]: parseFloat(e.target.value),
                        },
                      }));
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 backdrop-blur-md focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Objects Section */}
          <div>
            <label className="block mb-2 text-base">Objects in Field</label>
            <button
              type="button"
              onClick={() => setShowObjects(!showObjects)}
              className="mb-4 bg-yellow-400 text-black px-4 py-1 rounded-lg hover:bg-yellow-300 transition"
            >
              {showObjects ? "Hide Objects" : `Show Objects (${objectsInField.length})`}
            </button>

            {showObjects && (
              objectsInField.map((object, index) => (
                <div key={index} className="space-y-4 mb-4">
                  <div>
                    <label className="block text-xs mb-1">Object {index + 1}</label>
                    <input
                      type="text"
                      value={object.name || ""}
                      onChange={(e) => handleAstronomyDataChange(index, "name", e.target.value)}
                      placeholder="Object Name"
                      className="w-full px-2 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 backdrop-blur-md focus:outline-none"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Location Section */}
          <div>
            <label className="block mb-2 text-base">Location (optional)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Latitude */}
              <input
                type="text"
                placeholder="Latitude (e.g. 49.8397)"
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white"
                onChange={(e) =>
                  setObservation((prev) => ({
                    ...prev,
                    location: {
                      ...(prev.location || {}),
                      latitude: parseFloat(e.target.value),
                    },
                  }))
                }
              />

              {/* Longitude */}
              <input
                type="text"
                placeholder="Longitude (e.g. 24.0297)"
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white"
                onChange={(e) =>
                  setObservation((prev) => ({
                    ...prev,
                    location: {
                      ...(prev.location || {}),
                      longitude: parseFloat(e.target.value),
                    },
                  }))
                }
              />

              {/* Place Name */}
              <input
                type="text"
                placeholder="Place name (optional)"
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white col-span-2"
                onChange={(e) =>
                  setObservation((prev) => ({
                    ...prev,
                    location: {
                      ...(prev.location || {}),
                      place_name: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Publish Observation
          </button>
        </form>
      )}
    </div>
  );
}
