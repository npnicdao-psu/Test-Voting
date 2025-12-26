
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Candidate, Position } from '../types';
import { analyzeElectionTrends } from '../services/geminiService';

interface DashboardProps {
  candidates: Candidate[];
}

const Dashboard: React.FC<DashboardProps> = ({ candidates }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getPositionData = (pos: Position) => {
    return candidates
      .filter(c => c.position === pos)
      .map(c => ({ name: c.name, votes: c.votes }));
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeElectionTrends(candidates);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const totalVotes = candidates.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Ballots Cast</span>
          <span className="text-4xl font-extrabold text-indigo-600 mt-2">{Math.floor(totalVotes / 5)}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Leading Candidate (All)</span>
          <span className="text-xl font-bold text-gray-900 mt-2">
            {[...candidates].sort((a, b) => b.votes - a.votes)[0].name}
          </span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Election Status</span>
          <span className="text-sm font-bold text-green-600 mt-2 bg-green-50 px-3 py-1 rounded-full flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            LIVE & ACTIVE
          </span>
        </div>
      </div>

      {/* Position Standings Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {Object.values(Position).map((pos) => (
          <div key={pos} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 text-sm">
                {pos.charAt(0)}
              </span>
              {pos} Standings
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getPositionData(pos)} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                    {getPositionData(pos).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* AI Analysis Section */}
      <div className="bg-indigo-900 rounded-2xl p-8 text-white shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
           <svg className="w-64 h-64" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
           </svg>
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">AI Election Analyst</h2>
              <p className="text-indigo-200 mt-1">Generate real-time insights based on current voting trends.</p>
            </div>
            <button 
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center ${
                isAnalyzing ? 'bg-indigo-800 cursor-not-allowed' : 'bg-white text-indigo-900 hover:bg-indigo-50 shadow-lg'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : 'Analyze Trends'}
            </button>
          </div>

          {analysis ? (
            <div className="prose prose-invert max-w-none bg-indigo-800/50 p-6 rounded-xl border border-indigo-700/50">
              <div className="whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-indigo-700/50 rounded-xl">
              <p className="text-indigo-300">Click the button above to generate AI-powered insights.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
