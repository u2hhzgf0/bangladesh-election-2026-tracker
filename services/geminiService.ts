// Local election insights data - no external API required
export async function getElectionInsights() {
  // Simulate a small delay for realistic loading experience
  await new Promise(resolve => setTimeout(resolve, 500));

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

// Simulated NID verification - no external API required
export async function verifyNID(base64Image: string) {
  // Simulate verification process with a realistic delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // List of sample Bengali names for simulation
  const sampleNames = [
    "মো: আব্দুল করিম",
    "ফাতেমা খাতুন",
    "মো: রহিম উদ্দিন",
    "সালমা বেগম",
    "মো: করিম মিয়া",
    "আয়েশা সিদ্দিকা"
  ];

  // Generate a random NID number
  const randomNID = Math.floor(1000000000 + Math.random() * 9000000000).toString();

  // For simulation purposes, always return valid if an image is provided
  if (base64Image && base64Image.length > 0) {
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    return {
      isValid: true,
      name: randomName,
      nidNumber: randomNID
    };
  }

  // Return invalid if no image provided
  return {
    isValid: false,
    name: "",
    nidNumber: ""
  };
}
