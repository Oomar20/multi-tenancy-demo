import React from 'react';

interface GradeCardProps {
    level: string;
    section: string,
    onClick?: () => void;
}

const GradeCard: React.FC<GradeCardProps> = ({ level, section, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white rounded-lg shadow p-4 cursor-pointer
               hover:shadow-md transition-shadow flex flex-col"
    >
        <h3 className="text-lg font-semibold text-gray-800">{level} - {section}</h3>

    </div>
);

export default GradeCard;
