
export interface VoteData {
  partyA: number; // Grain of Rice
  partyB: number; // Scale
  totalVotes: number;
}

export interface ReferendumData {
  yes: number;
  no: number;
}

export interface Candidate {
  name: string;
  party: string;
  symbol: 'rice' | 'scale';
  image: string;
  designation: string;
  motto: string;
}

export interface NewsInsight {
  title: string;
  summary: string;
  category: 'আপডেট' | 'বিশ্লেষণ' | 'তথ্য' | string;
}

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
