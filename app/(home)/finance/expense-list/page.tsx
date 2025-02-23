import React from "react";

const PlaceholderComponent: React.FC = () => {

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">🚧 Under Development 🚧</h1>
        <p className="text-gray-600">
          We are working hard to bring this feature to you. Please check back later!
        </p>
      </div>
    </div>
  );
};

export default PlaceholderComponent;
