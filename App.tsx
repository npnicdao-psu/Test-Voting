
import React, { useState, useEffect, useCallback } from 'react';
import { Position, Candidate, VoteRecord } from './types';
import { INITIAL_CANDIDATES } from './constants';
import CandidateCard from './components/CandidateCard';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vote' | 'dashboard' | 'admin'>('vote');
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [selections, setSelections] = useState<Record<Position, string>>({
    [Position.PRESIDENT]: '',
    [Position.VICE_PRESIDENT]: '',
    [Position.SECRETARY]: '',
    [Position.AUDITOR]: '',
    [Position.SGT_AT_ARMS]: '',
  });
  const [voted, setVoted] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    const savedCandidates = localStorage.getItem('voter_candidates');
    if (savedCandidates) {
      setCandidates(JSON.parse(savedCandidates));
    }
    const hasVoted = localStorage.getItem('has_voted');
    if (hasVoted) {
      setVoted(true);
    }
  }, []);

  // Save candidates whenever they change
  useEffect(() => {
    localStorage.setItem('voter_candidates', JSON.stringify(candidates));
  }, [candidates]);

  const handleSelect = (pos: Position, id: string) => {
    setSelections(prev => ({ ...prev, [pos]: id }));
  };

  const handleInitiateSubmit = () => {
    // Check if all positions have been selected (either a candidate or 'abstain')
    const allSelected = Object.values(Position).every(pos => !!selections[pos]);
    if (!allSelected) {
      alert("Please make a selection (or choose 'Abstain') for every position before submitting.");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = () => {
    // Process votes
    setCandidates(prev => prev.map(c => {
      const isSelected = selections[c.position] === c.id;
      return isSelected ? { ...c, votes: c.votes + 1 } : c;
    }));

    setVoted(true);
    setShowConfirmModal(false);
    localStorage.setItem('has_voted', 'true');
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const simulateVotes = useCallback(() => {
    if (!isSimulating) return;
    
    const interval = setInterval(() => {
      setCandidates(prev => {
        const next = [...prev];
        const randomPos = Object.values(Position)[Math.floor(Math.random() * 5)];
        const candidatesForPos = next.filter(c => c.position === randomPos);
        if (candidatesForPos.length === 0) return prev;

        if (Math.random() > 0.1) {
          const randomCandidate = candidatesForPos[Math.floor(Math.random() * candidatesForPos.length)];
          return next.map(c => c.id === randomCandidate.id ? { ...c, votes: c.votes + 1 } : c);
        }
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  useEffect(() => {
    const cleanup = simulateVotes();
    return () => cleanup && cleanup();
  }, [simulateVotes]);

  const resetElection = () => {
    if (window.confirm("Are you sure you want to reset all votes? This will also revert the candidate list to defaults.")) {
      setCandidates(INITIAL_CANDIDATES);
      setVoted(false);
      localStorage.removeItem('voter_candidates');
      localStorage.removeItem('has_voted');
      setSelections({
        [Position.PRESIDENT]: '',
        [Position.VICE_PRESIDENT]: '',
        [Position.SECRETARY]: '',
        [Position.AUDITOR]: '',
        [Position.SGT_AT_ARMS]: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg">
              V
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
              Association Voting <span className="text-indigo-600">Pro</span>
            </h1>
          </div>
          
          <nav className="flex space-x-1 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('vote')}
              className={`whitespace-nowrap px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'vote' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Cast Vote
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Monitor Live
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className={`whitespace-nowrap px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Admin
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'vote' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h2 className="text-3xl font-extrabold text-slate-900">Official Ballot</h2>
              <p className="text-slate-500 mt-2">Please select one candidate for each of the following positions, or choose to abstain. Your vote is anonymous and final.</p>
              
              {voted && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center text-green-700">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Thank you! Your vote has already been submitted. Check the dashboard for live results.
                </div>
              )}
            </div>

            <div className="space-y-10">
              {Object.values(Position).map((pos) => (
                <section key={pos} className="scroll-mt-24">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center">
                      <span className="w-2 h-8 bg-indigo-500 rounded-full mr-3"></span>
                      {pos}
                    </h3>
                    {selections[pos] && (
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                        selections[pos] === 'abstain' ? 'text-slate-600 bg-slate-100' : 'text-indigo-600 bg-indigo-50'
                      }`}>
                        {selections[pos] === 'abstain' ? 'Abstained' : 'Selected'}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {candidates
                      .filter(c => c.position === pos)
                      .map(candidate => (
                        <CandidateCard 
                          key={candidate.id}
                          candidate={candidate}
                          isSelected={selections[pos] === candidate.id}
                          onSelect={(id) => !voted && handleSelect(pos, id)}
                        />
                      ))
                    }
                    {/* Abstain Option Card */}
                    <div 
                      onClick={() => !voted && handleSelect(pos, 'abstain')}
                      className={`relative cursor-pointer group rounded-xl border-2 p-4 transition-all duration-300 flex items-center space-x-4 ${
                        selections[pos] === 'abstain' 
                          ? 'border-slate-400 bg-slate-100 shadow-md' 
                          : 'border-gray-200 bg-white hover:border-slate-300 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
                        selections[pos] === 'abstain' ? 'bg-slate-200 border-slate-300' : 'bg-slate-50 border-slate-100'
                      }`}>
                        <svg className={`w-8 h-8 ${selections[pos] === 'abstain' ? 'text-slate-600' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-700 text-lg">Abstain</h3>
                        <p className="text-xs text-slate-500">I do not wish to vote for any candidate in this position.</p>
                      </div>
                      {selections[pos] === 'abstain' && (
                        <div className="bg-slate-600 text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <div className="sticky bottom-8 z-40 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-500 font-medium">
                {Object.values(selections).filter(id => id).length} of 5 positions selected
              </div>
              <button 
                onClick={handleInitiateSubmit}
                disabled={voted}
                className={`w-full md:w-auto px-12 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  voted 
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-95'
                }`}
              >
                {voted ? 'VOTE SUBMITTED' : 'SUBMIT FINAL BALLOT'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900">Election Dashboard</h2>
                <p className="text-slate-500 mt-1">Live analytics and distribution of current association votes.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-2 ${
                    isSimulating 
                      ? 'bg-orange-50 border-orange-200 text-orange-600' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {isSimulating ? 'Stop Simulation' : 'Simulate Traffic'}
                </button>
                <button 
                  onClick={resetElection}
                  className="px-4 py-2 bg-red-50 border-2 border-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
                >
                  Reset All Data
                </button>
              </div>
            </div>

            <Dashboard candidates={candidates} />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="animate-in fade-in duration-500">
            <Admin 
              candidates={candidates} 
              setCandidates={setCandidates} 
            />
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          ></div>
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">Confirm Your Ballot</h3>
            <p className="text-center text-slate-600 mb-8 leading-relaxed">
              Once you submit your ballot, <span className="font-bold text-red-600">your vote cannot be changed or retracted</span>. Please review your selections carefully before proceeding.
            </p>

            <div className="space-y-3">
              <button 
                onClick={handleFinalSubmit}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
              >
                Confirm & Submit Vote
              </button>
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95"
              >
                Go Back & Review
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 Association Voting Pro System. All voting data is secured and processed in real-time.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <span className="text-xs text-slate-300">Terms of Service</span>
            <span className="text-xs text-slate-300">Privacy Policy</span>
            <span className="text-xs text-slate-300">Security Audit</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
