
import { Position, Candidate } from './types';

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'p1',
    name: 'Alice Sterling',
    position: Position.PRESIDENT,
    bio: 'Experienced community leader with a vision for transparency and growth.',
    imageUrl: 'https://picsum.photos/seed/alice/400/400',
    votes: 42
  },
  {
    id: 'p2',
    name: 'Robert Vance',
    position: Position.PRESIDENT,
    bio: 'Focusing on fiscal responsibility and modernizing our association facilities.',
    imageUrl: 'https://picsum.photos/seed/robert/400/400',
    votes: 38
  },
  {
    id: 'vp1',
    name: 'Catherine Chen',
    position: Position.VICE_PRESIDENT,
    bio: 'Dedicated to member engagement and social event coordination.',
    imageUrl: 'https://picsum.photos/seed/catherine/400/400',
    votes: 25
  },
  {
    id: 'vp2',
    name: 'David Miller',
    position: Position.VICE_PRESIDENT,
    bio: 'Bringing 10 years of administrative experience to the executive team.',
    imageUrl: 'https://picsum.photos/seed/david/400/400',
    votes: 29
  },
  {
    id: 'sec1',
    name: 'Elena Rodriguez',
    position: Position.SECRETARY,
    bio: 'Organized and detail-oriented professional ensuring perfect record keeping.',
    imageUrl: 'https://picsum.photos/seed/elena/400/400',
    votes: 15
  },
  {
    id: 'sec2',
    name: 'Franklin Wu',
    position: Position.SECRETARY,
    bio: 'Digital native committed to improving our association communication channels.',
    imageUrl: 'https://picsum.photos/seed/franklin/400/400',
    votes: 18
  },
  {
    id: 'aud1',
    name: 'Grace Hopper',
    position: Position.AUDITOR,
    bio: 'Certified public accountant with a passion for community auditing.',
    imageUrl: 'https://picsum.photos/seed/grace/400/400',
    votes: 55
  },
  {
    id: 'aud2',
    name: 'Henry Thoreau',
    position: Position.AUDITOR,
    bio: 'Advocating for sustainable spending and clear financial reports.',
    imageUrl: 'https://picsum.photos/seed/henry/400/400',
    votes: 31
  },
  {
    id: 'saa1',
    name: 'Isabella Black',
    position: Position.SGT_AT_ARMS,
    bio: 'Maintaining order and ensuring safety during all association meetings.',
    imageUrl: 'https://picsum.photos/seed/isabella/400/400',
    votes: 22
  },
  {
    id: 'saa2',
    name: 'James Bond',
    position: Position.SGT_AT_ARMS,
    bio: 'Professional and courteous enforcement of association bylaws.',
    imageUrl: 'https://picsum.photos/seed/james/400/400',
    votes: 24
  }
];
