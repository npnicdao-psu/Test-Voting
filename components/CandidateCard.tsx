
import React from 'react';
import { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: (id: string) => void;
  showVotes?: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ 
  candidate, 
  isSelected, 
  onSelect,
  showVotes = false 
}) => {
  return (
    <div 
      onClick={() => onSelect(candidate.id)}
      className={`relative cursor-pointer group rounded-xl border-2 p-4 transition-all duration-300 ${
        isSelected 
          ? 'border-indigo-600 bg-indigo-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center space-x-4">
        <img 
          src={candidate.imageUrl} 
          alt={candidate.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
        />
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg">{candidate.name}</h3>
          <p className="text-sm text-gray-500 italic line-clamp-2">{candidate.bio}</p>
        </div>
        {isSelected && (
          <div className="bg-indigo-600 text-white rounded-full p-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      
      {showVotes && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Current Standings</span>
          <span className="text-indigo-600 font-bold text-lg">{candidate.votes} votes</span>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;
