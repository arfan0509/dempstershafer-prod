import React, { useState, useEffect } from "react";

const LoadingModal = () => {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showCompleteMessage, setShowCompleteMessage] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev === 99) {
          clearInterval(timer);
          setTimeout(() => {
            setShowCompleteMessage(true); // Show "Diagnosis selesai"
            setTimeout(() => {
              setCompleted(true); // Hide after 2 seconds
            }, 2000);
          }, 0);
        }
        return prev + 1;
      });
    }, 30); // Update progress every 30ms
    return () => clearInterval(timer); // Clean up on unmount
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-center">
        <div className="mb-4">
          {/* Progress bar container */}
          <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#4F81C7] transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-xl font-semibold text-[#4F81C7]">{progress}%</div>
        </div>
        <p className="text-lg font-semibold text-gray-700">Memproses Diagnosis...</p>

        {/* Show the "Diagnosis selesai" message */}
        {showCompleteMessage && !completed && (
          <div className="mt-4 text-green-600 text-xl font-bold">
            <span className="text-2xl">✔</span> Diagnosis Selesai
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingModal;
