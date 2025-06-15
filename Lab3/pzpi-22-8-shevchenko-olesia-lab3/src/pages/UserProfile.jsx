import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function UserProfile() {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [observations, setObservations] = useState([]);
    const [selectedObservation, setSelectedObservation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showObjects, setShowObjects] = useState(false);
    const { t } = useTranslation();

    const openModal = (observation) => {
        setSelectedObservation(observation);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedObservation(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileRes = await fetch(`http://localhost:8000/users/${userId}`);
                const profileData = await profileRes.json();
                setProfile(profileData);

                const obsRes = await fetch(`http://localhost:8000/users/${userId}/observations`);
                const obsData = await obsRes.json();
                console.log("Observations data:", obsData);
                setObservations(obsData);
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
            }
        };
        fetchData();
    }, [userId]);

    if (!profile) return <div className="text-white p-10">User not found.</div>;

    return (
        <div className="min-h-screen bg-black font-serif text-white px-6 py-10">
            <div className="flex items-center space-x-6 ml-10">
                <img
                    src={profile.avatar_url || "/photos/home/default-avatar.jpg"}
                    alt="Avatar"
                    className="w-28 h-28 rounded-full object-cover border-4 border-white"
                />
                <div>
                    <h2 className="text-3xl text-left font-serif font-semibold">{profile.username}</h2>
                    <p className="text-white/70 text-left mt-2">{profile.bio || ""}</p>

                    {/* Stats */}
                    <div className="mt-4 text-sm text-white/50">
                        <span className="mr-6">
                            <strong className="text-white">{profile.observation_count || 0}</strong> {t("profile1.stats.observationsCount", { count: profile.observation_count || 0 })}
                        </span>
                        <span>
                            <strong className="text-white">🌌</strong> {t("profile1.stats.starBaby")}
                        </span>
                    </div>
                </div>
            </div>

            <hr className="border-white/10 my-6" />

            <h3 className="text-2xl ml-10 font-serif font-semibold mb-6">{t("profile1.observations")}</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-5 ml-10 mr-10">
                {observations.map((obs) => (
                    <div
                        key={obs.id}
                        className="bg-zinc-900 p-4 w-80 rounded-xl shadow-md flex flex-col items-center hover:shadow-lg transition cursor-pointer"
                        onClick={() => openModal(obs)}
                    >
                        <img
                            src={obs.image_url}
                            alt={obs.title}
                            className="w-full h-40 object-cover rounded-md mb-4"
                        />
                        <h4 className="text-lg font-serif font-semibold text-center mb-2">{obs.title}</h4>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && selectedObservation && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                    onClick={closeModal}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-zinc-900 p-6 rounded-lg max-h-[80vh] overflow-y-auto w-full max-w-4xl flex flex-col md:flex-row gap-8"
                    >
                        {/* Image */}
                        <img
                            src={selectedObservation.image_url}
                            alt={selectedObservation.title}
                            className="w-full md:w-1/2 h-auto rounded-lg object-cover"
                        />

                        {/* Info */}
                        <div className="flex flex-col text-left w-full">
                            <div>
                                <h2 className="text-2xl font-serif font-bold mb-4">{selectedObservation.title}</h2>
                                <p className="text-white/70 mb-6">{selectedObservation.description || ""}</p>

                                {/* Calibration */}
                                <div className="text-sm text-white/60 mb-4">
                                    <h4 className="font-semibold mb-2">Calibration:</h4>
                                    {selectedObservation.calibration
                                        ? Object.entries(selectedObservation.calibration).map(([key, value]) => (
                                            <div key={key}>
                                                {key}: {value}
                                            </div>
                                        ))
                                        : "No calibration data."}
                                </div>

                                {/* Objects */}
                                <div className="text-sm text-white/60">
                                    <h4
                                        className="font-semibold mb-2 cursor-pointer hover:underline"
                                        onClick={() => setShowObjects(!showObjects)}
                                    >
                                        {showObjects
                                            ? t("profile1.hideObjects")
                                            : t("profile1.showObjects", { count: selectedObservation.objects_in_field?.length || 0 })}
                                    </h4>
                                    {showObjects && (
                                        <div className="max-h-32 overflow-y-auto pr-2">
                                            {selectedObservation.objects_in_field?.length ? (
                                                selectedObservation.objects_in_field.map((obj, idx) => (
                                                    <div key={idx}>{obj.name}</div>
                                                ))
                                            ) : (
                                                <p>{t("profile1.noObjects")}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={closeModal}
                                    className="w-full self-baseline mt-6 px-6 py-1 border-white text-white font-serif rounded-lg hover:bg-yellow-600 transition"
                                >
                                    {t("profile1.close")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
