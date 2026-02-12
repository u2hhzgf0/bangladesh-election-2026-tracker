import React, { useState } from 'react';
import VoteDisplay from './components/VoteDisplay';
import CountdownTimer from './components/CountdownTimer';
import CandidateProfiles from './components/CandidateProfiles';
import VotingModal from './components/VotingModal';
import ReferendumSection from './components/ReferendumSection';
import { Candidate } from './types';

// Redux imports
import { useAppSelector } from './store/hooks';
import {
  useGetInsightsQuery,
  useGetCandidatesQuery,
} from './store/api/electionApi';
import {
  useCastVoteMutation,
  useCastReferendumVoteMutation,
} from './store/api/voteApi';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

  // Get real-time data from Redux store (Socket.io updates)
  const { votes, referendum, countdown, isConnected } = useAppSelector(
    (state) => state.realtime
  );

  // RTK Query hooks for API data
  const { data: insights = [], isLoading: insightsLoading } = useGetInsightsQuery();
  const { data: candidates = [] } = useGetCandidatesQuery();

  // Mutations
  const [castVote] = useCastVoteMutation();
  const [castReferendumVote] = useCastReferendumVoteMutation();

  // Default candidates (fallback)
  const defaultCandidates: Candidate[] = [
    {
      name: 'তারেক রহমান',
      party: 'বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি)',
      symbol: 'rice',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd7Fq7aO4bYriYDyO_9-sw25gNvoVQRn6Vpg&s',
      designation: 'ভারপ্রাপ্ত চেয়ারম্যান',
      motto: 'গণতন্ত্র পুনরূদ্ধার এবং জনগণের ভোটাধিকার নিশ্চিত করাই আমাদের মূল লক্ষ্য।'
    },
    {
      name: 'ডা. শফিকুর রহমান',
      party: 'বাংলাদেশ জামায়াতে ইসলামী',
      symbol: 'scale',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKyYQEqKvlHx5IxRSWosPN55vuSYDZfaLCag&s',
      designation: 'আমীর',
      motto: 'ইনসাফ ভিত্তিক সমাজ গঠন এবং নৈতিক রাজনীতির মাধ্যমে দেশের উন্নয়ন সম্ভব।'
    }
  ];

  const handleManualVote = async (party: 'rice' | 'scale') => {
    try {
      await castVote({ party }).unwrap();
      console.log('✅ Vote cast successfully');
    } catch (error) {
      console.error('❌ Failed to cast vote:', error);
    }
  };

  const handleReferendumVote = async (choice: 'yes' | 'no') => {
    try {
      await castReferendumVote({ choice }).unwrap();
      console.log('✅ Referendum vote cast successfully');
    } catch (error) {
      console.error('❌ Failed to cast referendum vote:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      {/* নেভিগেশন */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-[10px] sm:text-xs">বিডি</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-slate-800 tracking-tighter">ভোট২০২৬</span>
              {isConnected && (
                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-[8px] font-bold rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  LIVE
                </span>
              )}
            </div>

            <div className="hidden md:flex space-x-6">
              <a href="#results" className="text-slate-600 hover:text-green-600 font-semibold text-xs sm:text-sm transition-colors uppercase tracking-wider">লাইভ ফলাফল</a>
              <a href="#candidates" className="text-slate-600 hover:text-green-600 font-semibold text-xs sm:text-sm transition-colors uppercase tracking-wider">প্রার্থী তুলনা</a>
              <a href="#info" className="text-slate-600 hover:text-green-600 font-semibold text-xs sm:text-sm transition-colors uppercase tracking-wider">ভোটার তথ্য</a>
              <a href="#poll" className="text-slate-600 hover:text-green-600 font-semibold text-xs sm:text-sm transition-colors uppercase tracking-wider">মতামত জরিপ</a>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsVoteModalOpen(true)}
                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-sm hover:bg-green-700 transition-all shadow-md"
              >
                ভোট দিন
              </button>
              <button
                className="md:hidden p-1.5 text-slate-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* মোবাইল মেনু */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-3">
              <a href="#results" onClick={() => setIsMenuOpen(false)} className="block text-slate-600 font-bold hover:text-green-600 text-xs uppercase tracking-widest">লাইভ ফলাফল</a>
              <a href="#candidates" onClick={() => setIsMenuOpen(false)} className="block text-slate-600 font-bold hover:text-green-600 text-xs uppercase tracking-widest">প্রার্থী তুলনা</a>
              <a href="#info" onClick={() => setIsMenuOpen(false)} className="block text-slate-600 font-bold hover:text-green-600 text-xs uppercase tracking-widest">ভোটার তথ্য</a>
              <a href="#poll" onClick={() => setIsMenuOpen(false)} className="block text-slate-600 font-bold hover:text-green-600 text-xs uppercase tracking-widest">মতামত জরিপ</a>
            </div>
          </div>
        )}
      </nav>

      {/* হিরো সেকশন */}
      <header className="relative pt-24 pb-12 sm:pt-40 sm:pb-32 bg-gradient-to-br from-green-900 via-green-800 to-slate-900 overflow-hidden px-4">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-red-600 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-400 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block bg-green-500/20 text-green-300 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-green-500/30">
            নির্বাচন কাউন্টডাউন
          </div>
          <h1 className="text-3xl sm:text-7xl font-black text-white mb-4 tracking-tight leading-tight">
            বাংলাদেশ নির্বাচন <span className="text-green-400">২০২৬</span>
          </h1>
          <p className="text-sm sm:text-xl text-green-100/80 mb-8 max-w-xl mx-auto font-medium leading-relaxed">
            আসন্ন সাধারণ নির্বাচনের রিয়েল-টাইম ভোট প্রক্ষেপণ এবং গণতান্ত্রিক অংশগ্রহণের বিস্তারিত তথ্য।
          </p>

          <CountdownTimer countdown={countdown} />

          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => setIsVoteModalOpen(true)}
              className="px-6 py-4 bg-green-500 hover:bg-green-400 text-white font-black rounded-xl transition-all shadow-lg shadow-green-900/40 text-sm sm:text-lg flex items-center justify-center gap-2 group"
            >
              <i className="fas fa-fingerprint text-xl"></i>
              এখনই ভোট দিন
            </button>
            <a href="#results" className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20 backdrop-blur-sm text-sm sm:text-lg">
              লাইভ ট্র্যাকার
            </a>
          </div>
        </div>
      </header>

      {/* ফলাফল সেকশন */}
      <main id="results" className="py-12 sm:py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-800 mb-2 tracking-tighter leading-tight">লাইভ ভোট গণনা</h2>
            <p className="text-xs sm:text-lg text-slate-500 font-medium">
              রিয়েল-টাইম আপডেট {isConnected && <span className="text-green-600">● সংযুক্ত</span>}
            </p>
          </div>

          <div className="flex justify-center mb-10 sm:mb-24">
            <VoteDisplay data={votes} />
          </div>

          <div className="mt-8 text-center bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 max-w-xs sm:max-w-lg mx-auto mb-16 sm:mb-24">
            <p className="text-slate-400 text-[10px] sm:text-sm font-medium uppercase tracking-wider mb-1">মোট যাচাইকৃত ব্যালট</p>
            <p className="text-xl sm:text-3xl font-black text-slate-800">{votes.totalVotes.toLocaleString('bn-BD')}</p>
          </div>

          {/* প্রার্থী প্রোফাইল সেকশন */}
          <section id="candidates" className="scroll-mt-20 sm:scroll-mt-24">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-green-600 font-bold text-[10px] uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded-full mb-2 inline-block">Head-to-Head</span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-800 mb-2 tracking-tighter leading-tight">প্রধান প্রতিদ্বন্দ্বী তুলনা</h2>
              <p className="text-[10px] sm:text-lg text-slate-500 font-medium max-w-2xl mx-auto px-4">২০২৬ সালের নির্বাচনে ধানের শীষ ও দাঁড়িপাল্লা প্রতীকের প্রধান প্রার্থীদের সংক্ষিপ্ত পরিচিতি।</p>
            </div>
            <CandidateProfiles candidates={candidates.length > 0 ? candidates : defaultCandidates} />
          </section>
        </div>
      </main>

      {/* এআই ইনসাইটস সেকশন */}
      <section id="insights" className="py-12 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1 tracking-tighter leading-tight">নির্বাচনী বিশ্লেষণ</h2>
              <p className="text-xs sm:text-lg text-slate-500">রাজনৈতিক ধারার স্বাধীন বিশ্লেষণ</p>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-200">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-600 uppercase">লাইভ</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {insightsLoading ? (
              <p className="text-slate-400 col-span-3 text-center py-10 font-bold text-xs">বিশ্লেষণ লোড হচ্ছে...</p>
            ) : insights.length > 0 ? (
              insights.map((insight, idx) => (
                <div key={idx} className="p-5 sm:p-8 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100 hover:border-green-200 transition-all group">
                  <div className="mb-2 inline-block px-2 py-0.5 bg-white rounded-md text-[8px] font-bold text-green-600 uppercase tracking-wider shadow-sm">
                    {insight.category}
                  </div>
                  <h3 className="text-sm sm:text-xl font-bold text-slate-800 mb-2 sm:mb-4 group-hover:text-green-600 transition-colors">{insight.title}</h3>
                  <p className="text-xs sm:text-lg text-slate-600 leading-relaxed italic">"{insight.summary}"</p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 col-span-3 text-center py-10 font-bold text-xs">কোন বিশ্লেষণ নেই</p>
            )}
          </div>
        </div>
      </section>

      {/* তথ্য সেকশন */}
      <section id="info" className="py-12 sm:py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20 items-center">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black mb-6 sm:mb-8 leading-tight tracking-tighter">নাগরিক দায়িত্ব ও <span className="text-green-400">ভোটার অধিকার</span></h2>
              <div className="space-y-6 sm:space-y-8">
                <div className="flex gap-4 sm:gap-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-calendar-alt text-green-400 text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-xl font-bold mb-1">গুরুত্বপূর্ণ তারিখ</h4>
                    <p className="text-xs sm:text-lg text-slate-400">১ ডিসেম্বর ২০২৫ নিবন্ধন বন্ধ এবং ৫ জানুয়ারি ২০২৬ ভোটগ্রহণ।</p>
                  </div>
                </div>
                <div className="flex gap-4 sm:gap-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-id-card text-blue-400 text-lg"></i>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-xl font-bold mb-1">কিভাবে ভোট দেবেন</h4>
                    <p className="text-xs sm:text-lg text-slate-400">স্মার্ট এনআইডি সাথে রাখুন এবং ইসি ওয়েবসাইটে ভোটকেন্দ্র যাচাই করুন।</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] border border-white/10 backdrop-blur-sm relative">
               <h3 className="text-lg sm:text-2xl font-bold mb-4 flex items-center gap-2">
                 <i className="fas fa-shield-alt text-green-400"></i>
                 নির্বাচনী স্বচ্ছতা
               </h3>
               <p className="text-xs sm:text-lg text-slate-300 mb-6 leading-relaxed">
                 ২০২৬ সালের নির্বাচনে প্রতিটি ভোট স্বচ্ছভাবে গণনা নিশ্চিত করতে উন্নত ইলেকট্রনিক ফলাফল প্রেরণ ব্যবস্থা ব্যবহৃত হবে।
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* মতামত জরিপ সেকশন */}
      <div id="poll">
        <ReferendumSection data={referendum} onVote={handleReferendumVote} />
      </div>

      {/* ফুটার */}
      <footer className="bg-slate-50 border-t border-slate-200 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center sm:text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-[10px]">বিডি</span>
                </div>
                <span className="text-lg font-black text-slate-800 tracking-tighter">ভোট২০২৬</span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto sm:mx-0">
                বাংলাদেশে নির্বাচনী স্বচ্ছতা বৃদ্ধি এবং নাগরিক অংশগ্রহণ উৎসাহিত করতে একটি স্বতন্ত্র প্ল্যাটফর্ম।
              </p>
            </div>
            <div className="flex justify-center sm:justify-end gap-6 text-slate-400">
               <a href="https://www.facebook.com/mdshadathossain.code" className="hover:text-green-600"><i className="fab fa-facebook-f text-lg"></i></a>
               <a href="#" className="hover:text-green-600"><i className="fab fa-twitter text-lg"></i></a>
               <a href="https://www.instagram.com/mdshadathossain12" className="hover:text-green-600"><i className="fab fa-instagram text-lg"></i></a>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200">
            <p className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold leading-relaxed text-center">
              সতর্কবার্তা: এটি একটি শিক্ষামূলক সিমুলেশন। কোনো প্রকৃত নির্বাচনী ফলাফল প্রতিফলিত করে না।
              তথ্যসূত্র: কাল্পনিক বাংলাদেশ নির্বাচন আর্কাইভ (২০২৬)।
            </p>
          </div>
        </div>
      </footer>

      {/* ভোটিং মডাল */}
      <VotingModal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        onVoteCast={handleManualVote}
      />
    </div>
  );
};

export default App;
