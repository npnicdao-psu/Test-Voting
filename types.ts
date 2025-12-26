
export enum Position {
  PRESIDENT = 'President',
  VICE_PRESIDENT = 'Vice President',
  SECRETARY = 'Secretary',
  AUDITOR = 'Auditor',
  SGT_AT_ARMS = 'Sgt at Arms'
}

export interface Candidate {
  id: string;
  name: string;
  position: Position;
  bio: string;
  imageUrl: string;
  votes: number;
}

export interface VoteRecord {
  voterId: string;
  selections: Record<Position, string>; // position: candidateId
  timestamp: number;
}

export interface ElectionStats {
  totalVotes: number;
  lastUpdated: number;
}
