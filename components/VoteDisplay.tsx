
import React from 'react';
import { RiceIcon, ScaleIcon } from './Icons';
import { VoteData } from '../types';

interface VoteDisplayProps {
  data: VoteData;
}

const VoteDisplay: React.FC<VoteDisplayProps> = ({ data }) => {
  const partyAPercent = data.totalVotes > 0 ? (data.partyA / data.totalVotes) * 100 : 0;
  const partyBPercent = data.totalVotes > 0 ? (data.partyB / data.totalVotes) * 100 : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-8 w-full max-w-4xl px-2">
      {/* Party A: ধানের শীষ */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-8 shadow-lg border border-green-100 flex flex-col items-center transition-transform hover:scale-[1.02]">
        <div className="bg-green-100 p-2 sm:p-4 rounded-full mb-3 sm:mb-6 float-animation">
          <RiceIcon className="w-10 h-10 sm:w-20 sm:h-20 text-green-600" />
        </div>
        <h3 className="text-xs sm:text-2xl font-bold text-slate-800 mb-1 sm:mb-2 text-center leading-tight">ধানের শীষ</h3>
        <p className="text-lg sm:text-4xl font-black text-green-600 mb-2 sm:mb-4">{data.partyA.toLocaleString('bn-BD')}</p>
        <div className="w-full bg-slate-100 rounded-full h-2 sm:h-4 mb-1 sm:mb-2 overflow-hidden">
          <div 
            className="bg-green-500 h-full transition-all duration-1000 ease-out"
            style={{ width: `${partyAPercent}%` }}
          />
        </div>
        <p className="text-[10px] sm:text-sm font-semibold text-slate-500">{partyAPercent.toFixed(1)}%</p>
      </div>

      {/* Party B: দাঁড়িপাল্লা */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-8 shadow-lg border border-blue-100 flex flex-col items-center transition-transform hover:scale-[1.02]">
        <div className="bg-blue-100 p-2 sm:p-4 rounded-full mb-3 sm:mb-6 float-animation">
          <ScaleIcon className="w-10 h-10 sm:w-20 sm:h-20 text-blue-600" />
        </div>
        <h3 className="text-xs sm:text-2xl font-bold text-slate-800 mb-1 sm:mb-2 text-center leading-tight">দাঁড়িপাল্লা</h3>
        <p className="text-lg sm:text-4xl font-black text-blue-600 mb-2 sm:mb-4">{data.partyB.toLocaleString('bn-BD')}</p>
        <div className="w-full bg-slate-100 rounded-full h-2 sm:h-4 mb-1 sm:mb-2 overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-1000 ease-out"
            style={{ width: `${partyBPercent}%` }}
          />
        </div>
        <p className="text-[10px] sm:text-sm font-semibold text-slate-500">{partyBPercent.toFixed(1)}%</p>
      </div>
    </div>
  );
};

export default VoteDisplay;
