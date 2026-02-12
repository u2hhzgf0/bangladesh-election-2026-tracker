
import React from 'react';
import { RiceIcon, ScaleIcon } from './Icons';
import { Candidate } from '../types';

interface Props {
  candidates: Candidate[];
}

const CandidateProfiles: React.FC<Props> = ({ candidates }) => {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-12 max-w-5xl mx-auto px-2">
      {candidates.map((candidate, index) => (
        <div 
          key={index} 
          className={`relative group bg-white rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-1 border-b-4 sm:border-b-8 ${
            candidate.symbol === 'rice' ? 'border-green-600' : 'border-blue-600'
          }`}
        >
          <div className="p-3 sm:p-8 flex flex-col items-center text-center">
            {/* Candidate Image with Frame */}
            <div className={`relative mb-3 sm:mb-6 p-1 rounded-full border-2 sm:border-4 ${
              candidate.symbol === 'rice' ? 'border-green-100 group-hover:border-green-500' : 'border-blue-100 group-hover:border-blue-500'
            } transition-colors duration-500`}>
              <div className="w-16 h-16 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-inner bg-slate-100">
                <img 
                  src={candidate.image} 
                  alt={candidate.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              {/* Symbol Badge */}
              <div className={`absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-6 h-6 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl shadow-lg flex items-center justify-center border-2 sm:border-4 border-white ${
                candidate.symbol === 'rice' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
              }`}>
                {candidate.symbol === 'rice' ? <RiceIcon className="w-4 h-4 sm:w-8 sm:h-8" /> : <ScaleIcon className="w-4 h-4 sm:w-8 sm:h-8" />}
              </div>
            </div>

            <div className="mb-2 sm:mb-4">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-black tracking-widest uppercase mb-1 ${
                candidate.symbol === 'rice' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {candidate.symbol === 'rice' ? 'বিএনপি' : 'জামায়াত'}
              </span>
              <h3 className="text-xs sm:text-3xl font-black text-slate-800 tracking-tight leading-tight">{candidate.name}</h3>
            </div>

            <div className="hidden sm:block w-12 h-1 bg-slate-200 rounded-full mb-6"></div>

            <p className="text-[10px] sm:text-lg text-slate-600 italic leading-snug sm:leading-relaxed font-medium px-1 sm:px-4">
              "{candidate.motto}"
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidateProfiles;
