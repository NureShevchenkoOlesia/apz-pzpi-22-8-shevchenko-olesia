import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Gallery() {
    const [observations, setObservations] = useState([]);
    const [selectedObservation, setSelectedObservation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showObjects, setShowObjects] = useState(false);

    useEffect(() => {
        const fetchObservations = async () => {
            try {
                const res = await fetch("http://localhost:8000/observations/");
                const data = await res.json();
                console.log(data);
                setObservations(data);
            } catch (error) {
                console.error("Failed to load observations:", error);
            }
        };
        fetchObservations();
    }, []);
    const openModal = (observation) => {
        setSelectedObservation(observation);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedObservation(null);
        setIsModalOpen(false);
    };

    return (
        <div className="gallery-container">
            <h1 className="text-3xl font-bold mb-2 text-center">Gallery</h1>
            <p className="text-base truncate mb-10">Find your perfect view!</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {observations.map((obs) => (
                    <div 
                    key={obs.id} 
                    className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition"
                    onClick={() => openModal(obs)}
                    >
                        <img
                            src={obs.image_url}
                            alt={obs.title}
                            className="w-full h-40 object-cover rounded-md mb-4"
                        />
                        <h2 className="text-xl font-semibold truncate mb-1">{obs.title}</h2>
                        <p className="text-sm text-white/70 line-clamp-2">{obs.description}</p>
                        <p className="text-xs text-white/50 mt-2">
                            By:{" "}
                            <Link
                                to={`/users/${obs.user_id}`}
                                className="underline hover:text-yellow-300"
                            >
                                {obs.username}
                            </Link>
                        </p>
                    </div>
                ))}
            </div>

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
                                    <h4 className="font-semibold mb-2 cursor-pointer hover:underline" onClick={() => setShowObjects(!showObjects)}>
                                        {showObjects ? "Hide Objects" : `Show Objects (${selectedObservation.objects_in_field?.length || 0})`}
                                    </h4>
                                    {showObjects && (
                                        <div className="max-h-32 overflow-y-auto pr-2">
                                            {selectedObservation.objects_in_field?.length ? (
                                                selectedObservation.objects_in_field.map((obj, idx) => (
                                                    <div key={idx}>{obj.name}</div>
                                                ))
                                            ) : (
                                                <p>No objects found.</p>
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
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
