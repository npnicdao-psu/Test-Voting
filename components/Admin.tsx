
import React, { useState } from 'react';
import { Candidate, Position } from '../types';

interface AdminProps {
  candidates: Candidate[];
  setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
}

const Admin: React.FC<AdminProps> = ({ candidates, setCandidates }) => {
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    position: Position.PRESIDENT,
    bio: '',
    imageUrl: '',
  });

  // State for inline name editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.imageUrl) {
      alert('Please provide a name and image URL.');
      return;
    }

    const candidate: Candidate = {
      id: Date.now().toString(),
      name: newCandidate.name,
      position: newCandidate.position,
      bio: newCandidate.bio || 'A dedicated member of our association.',
      imageUrl: newCandidate.imageUrl,
      votes: 0,
    };

    setCandidates(prev => [...prev, candidate]);
    setNewCandidate({
      name: '',
      position: Position.PRESIDENT,
      bio: '',
      imageUrl: '',
    });
  };

  const handleRemoveCandidate = (id: string) => {
    if (window.confirm("Are you sure you want to remove this candidate? This will delete all their current votes.")) {
      setCandidates(prev => prev.filter(c => c.id !== id));
    }
  };

  const startEditing = (candidate: Candidate) => {
    setEditingId(candidate.id);
    setEditName(candidate.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  const saveEdit = () => {
    if (!editName.trim()) {
      alert("Name cannot be empty.");
      return;
    }
    setCandidates(prev => prev.map(c => 
      c.id === editingId ? { ...c, name: editName.trim() } : c
    ));
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="space-y-12">
      {/* Management Header */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h2 className="text-3xl font-extrabold text-slate-900">Election Management</h2>
        <p className="text-slate-500 mt-2">Manage the slate of candidates available on the voting ballot.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Candidate Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="w-8 h-8 bg-indigo-600 rounded-lg text-white flex items-center justify-center mr-3 text-sm">
                +
              </span>
              Add New Candidate
            </h3>
            
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Position</label>
                <select 
                  value={newCandidate.position}
                  onChange={(e) => setNewCandidate(prev => ({ ...prev, position: e.target.value as Position }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
                >
                  {Object.values(Position).map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Image URL</label>
                <input 
                  type="url" 
                  value={newCandidate.imageUrl}
                  onChange={(e) => setNewCandidate(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Brief Bio</label>
                <textarea 
                  rows={3}
                  value={newCandidate.bio}
                  onChange={(e) => setNewCandidate(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Candidate vision statement..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-2"
              >
                Register Candidate
              </button>
            </form>
          </div>
        </div>

        {/* Existing Candidates List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Existing Candidates</h3>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                {candidates.length} Registered
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Position</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">
                        No candidates registered yet.
                      </td>
                    </tr>
                  ) : (
                    candidates.map(candidate => (
                      <tr key={candidate.id} className={`hover:bg-slate-50/50 transition-colors ${editingId === candidate.id ? 'bg-indigo-50/30' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={candidate.imageUrl} 
                              alt={candidate.name} 
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                            <div className="flex-1 min-w-0">
                              {editingId === candidate.id ? (
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="w-full px-2 py-1 text-sm font-bold text-slate-900 border border-indigo-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                                  autoFocus
                                />
                              ) : (
                                <div className="font-bold text-slate-900 truncate">{candidate.name}</div>
                              )}
                              <div className="text-xs text-slate-500 truncate max-w-[200px]">{candidate.bio}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                            {candidate.position}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1">
                            {editingId === candidate.id ? (
                              <>
                                <button 
                                  onClick={saveEdit}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Save Changes"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={cancelEditing}
                                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                                  title="Cancel"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => startEditing(candidate)}
                                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                  title="Edit Name"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => handleRemoveCandidate(candidate.id)}
                                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Remove Candidate"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-3">
             <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <div className="text-xs text-amber-800 leading-relaxed">
               <strong>Admin Tip:</strong> You can now edit candidate names inline by clicking the pencil icon. Adding or removing candidates updates the ballot in real-time. If you remove a candidate after voting has started, their accrued votes will be permanently deleted from the tally.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
