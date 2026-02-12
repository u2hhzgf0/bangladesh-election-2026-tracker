
import React from 'react';
import { ReferendumData } from '../types';

interface Props {
  data: ReferendumData;
  onVote: (choice: 'yes' | 'no') => void;
}

const ReferendumSection: React.FC<Props> = ({ data, onVote }) => {
  const total = data.yes + data.no;
  const yesPercent = total > 0 ? (data.yes / total) * 100 : 0;
  const noPercent = total > 0 ? (data.no / total) * 100 : 0;

  return (
    <section className="py-12 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
          জনমত জরিপ
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2 tracking-tighter">
          আপনি কি বর্তমান নির্বাচন ব্যবস্থা নিয়ে সন্তুষ্ট?
        </h2>
        <p className="text-xs sm:text-base text-slate-500 mb-10">
          (এটি একটি উন্মুক্ত জরিপ, কোনো পরিচয়পত্রের প্রয়োজন নেই)
        </p>

        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-12">
          {/* YES Button */}
          <button 
            onClick={() => onVote('yes')}
            className="group relative flex flex-col items-center p-4 sm:p-6 bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-green-500 transition-all active:scale-95"
          >
            <div className="w-10 h-10 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
              <i className="fas fa-thumbs-up text-lg sm:text-2xl"></i>
            </div>
            <span className="text-sm sm:text-xl font-bold text-slate-700">হ্যাঁ</span>
          </button>

          {/* NO Button */}
          <button 
            onClick={() => onVote('no')}
            className="group relative flex flex-col items-center p-4 sm:p-6 bg-white rounded-2xl shadow-md border-2 border-transparent hover:border-red-500 transition-all active:scale-95"
          >
            <div className="w-10 h-10 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-red-500 group-hover:text-white transition-colors">
              <i className="fas fa-thumbs-down text-lg sm:text-2xl"></i>
            </div>
            <span className="text-sm sm:text-xl font-bold text-slate-700">না</span>
          </button>
        </div>

        {/* Results Visualizer */}
        <div className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
          <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            <span>হ্যাঁ: {data.yes.toLocaleString('bn-BD')}</span>
            <span>না: {data.no.toLocaleString('bn-BD')}</span>
          </div>
          <div className="flex h-3 sm:h-5 w-full rounded-full overflow-hidden bg-slate-100">
            <div 
              className="bg-green-500 h-full transition-all duration-1000 ease-out"
              style={{ width: `${yesPercent}%` }}
            ></div>
            <div 
              className="bg-red-500 h-full transition-all duration-1000 ease-out"
              style={{ width: `${noPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 font-black text-xs sm:text-sm">
            <span className="text-green-600">{yesPercent.toFixed(1)}%</span>
            <span className="text-red-600">{noPercent.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferendumSection;
