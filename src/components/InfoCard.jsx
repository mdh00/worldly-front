import React from 'react';

const InfoCard = ({ title, icon, children }) => {
  return (
    <div className="bg-indigo-950 rounded-lg p-6 transition-shadow duration-300 hover:shadow-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="mr-2">{icon}</span>
        <span className="text-emerald-400">{title}</span>
      </h2>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};


export const InfoRow = ({ label, value }) => (
  <div className="flex flex-row justify-between border-b border-black pb-2">
    <span className="font-semibold text-emerald-200">{label}:</span>
    <span className="text-white">{value}</span>
  </div>
);

export default InfoCard;