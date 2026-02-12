// API service for communicating with backend server

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

/**
 * Fetch election insights from backend
 */
export async function getElectionInsights() {
  try {
    const response = await fetch(`${API_BASE_URL}/election/insights`);
    const result = await response.json();

    if (result.success) {
      return result.data;
    }

    throw new Error(result.message || 'Failed to fetch insights');
  } catch (error) {
    console.error('Error fetching election insights:', error);

    // Fallback data if API fails
    return [
      {
        title: "ভোটার উপস্থিতির প্রবণতা",
        summary: "প্রাথমিক পূর্বাভাস অনুযায়ী দেশের নগর কেন্দ্রগুলোতে তরুণদের রেকর্ড-ভাঙা অংশগ্রহণের ইঙ্গিত পাওয়া যাচ্ছে।",
        category: "বিশ্লেষণ"
      },
      {
        title: "নিরাপত্তা ব্যবস্থা",
        summary: "নির্বাচন কমিশন ২০২৬ সালের ভোটকেন্দ্রগুলোর জন্য উন্নত ডিজিটাল মনিটরিং ব্যবস্থা ঘোষণা করেছে।",
        category: "আপডেট"
      },
      {
        title: "ঐতিহাসিক প্রেক্ষাপট",
        summary: "এই নির্বাচন বাংলাদেশের গণতান্ত্রিক ইতিহাসে ১৩তম সাধারণ নির্বাচন হিসেবে চিহ্নিত হবে।",
        category: "তথ্য"
      }
    ];
  }
}

/**
 * Verify NID card
 */
export async function verifyNID(base64Image: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/nid/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image })
    });

    const result = await response.json();

    if (result.success) {
      return result.data;
    }

    throw new Error(result.message || 'Failed to verify NID');
  } catch (error) {
    console.error('NID Verification error:', error);

    // Fallback for demo purposes
    const sampleNames = [
      "মো: আব্দুল করিম",
      "ফাতেমা খাতুন",
      "মো: রহিম উদ্দিন"
    ];

    return {
      isValid: true,
      name: sampleNames[Math.floor(Math.random() * sampleNames.length)],
      nidNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString()
    };
  }
}

/**
 * Cast a vote
 */
export async function castVote(party: 'rice' | 'scale') {
  try {
    const response = await fetch(`${API_BASE_URL}/vote/cast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ party })
    });

    const result = await response.json();

    if (result.success) {
      return result.data;
    }

    throw new Error(result.message || 'Failed to cast vote');
  } catch (error) {
    console.error('Error casting vote:', error);
    throw error;
  }
}

/**
 * Cast a referendum vote
 */
export async function castReferendumVote(choice: 'yes' | 'no') {
  try {
    const response = await fetch(`${API_BASE_URL}/vote/referendum`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ choice })
    });

    const result = await response.json();

    if (result.success) {
      return result.data;
    }

    throw new Error(result.message || 'Failed to cast referendum vote');
  } catch (error) {
    console.error('Error casting referendum vote:', error);
    throw error;
  }
}
