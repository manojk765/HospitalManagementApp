import React from "react";

const PlaceholderComponent: React.FC = () => {
  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">🚧 Under Development 🚧</h1>
        <p className="text-gray-600">
          We are working hard to bring this feature to you. Please check back later!
        </p>
        <button
          onClick={handleGoBack}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default PlaceholderComponent;
