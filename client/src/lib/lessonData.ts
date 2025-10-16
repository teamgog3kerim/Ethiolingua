// Initial lessons data for the MVP
export const initialLessons = [
  {
    id: 1,
    title: "Alphabet Basics 1",
    category: "alphabet",
    level: "beginner",
    orderIndex: 1,
    content: {
      amharic: ["አ"],
      arabic: ["أ"],
      english: ["A"]
    },
    audioUrl: "/audio/lesson1_a.mp3",
    slowAudioUrl: "/audio/lesson1_a_slow.mp3",
    quizQuestions: [
      {
        type: "multipleChoice",
        question: "What does አ represent?",
        options: ["A", "B", "L", "Hello"],
        answer: "A"
      }
    ],
    objectives: ["Learn አ", "Pronunciation practice"],
    isPremium: false
  },
  {
    id: 2,
    title: "Alphabet Basics 2",
    category: "alphabet", 
    level: "beginner",
    orderIndex: 2,
    content: {
      amharic: ["ለ"],
      arabic: ["ل"],
      english: ["L"]
    },
    audioUrl: "/audio/lesson2_l.mp3",
    slowAudioUrl: "/audio/lesson2_l_slow.mp3",
    quizQuestions: [
      {
        type: "multipleChoice",
        question: "What does ለ represent?",
        options: ["L", "M", "S", "Hello"],
        answer: "L"
      }
    ],
    objectives: ["Learn ለ", "Pronunciation practice"],
    isPremium: false
  },
  {
    id: 3,
    title: "Alphabet Basics 3", 
    category: "alphabet",
    level: "beginner",
    orderIndex: 3,
    content: {
      amharic: ["መ"],
      arabic: ["م"],
      english: ["M"]
    },
    audioUrl: "/audio/lesson3_m.mp3",
    slowAudioUrl: "/audio/lesson3_m_slow.mp3",
    quizQuestions: [
      {
        type: "multipleChoice",
        question: "What does መ represent?",
        options: ["M", "L", "S", "Hello"],
        answer: "M"
      }
    ],
    objectives: ["Learn መ", "Pronunciation practice"],
    isPremium: false
  },
  {
    id: 4,
    title: "Alphabet Basics 4",
    category: "alphabet",
    level: "beginner", 
    orderIndex: 4,
    content: {
      amharic: ["ረ"],
      arabic: ["ر"],
      english: ["R"]
    },
    audioUrl: "/audio/lesson4_r.mp3",
    slowAudioUrl: "/audio/lesson4_r_slow.mp3",
    quizQuestions: [
      {
        type: "multipleChoice",
        question: "What does ረ represent?",
        options: ["R", "L", "M", "Hello"],
        answer: "R"
      }
    ],
    objectives: ["Learn ረ", "Pronunciation practice"],
    isPremium: false
  },
  {
    id: 5,
    title: "Alphabet Basics 5",
    category: "alphabet",
    level: "beginner",
    orderIndex: 5,
    content: {
      amharic: ["ሰ"],
      arabic: ["س"],
      english: ["S"]
    },
    audioUrl: "/audio/lesson5_s.mp3",
    slowAudioUrl: "/audio/lesson5_s_slow.mp3",
    quizQuestions: [
      {
        type: "multipleChoice",
        question: "What does ሰ represent?",
        options: ["S", "L", "M", "Hello"],
        answer: "S"
      }
    ],
    objectives: ["Learn ሰ", "Pronunciation practice"],
    isPremium: false
  },
  // Premium lessons
  {
    id: 6,
    title: "Basic Greetings",
    category: "vocabulary",
    level: "beginner",
    orderIndex: 6,
    content: {
      amharic: ["ሰላም"],
      arabic: ["مرحبا"],
      english: ["Hello"]
    },
    audioUrl: "/audio/lesson6_hello.mp3",
    slowAudioUrl: "/audio/lesson6_hello_slow.mp3",
    quizQuestions: [
      {
        type: "multipleChoice",
        question: "How do you say 'Hello' in Amharic?",
        options: ["ሰላም", "አመሰግናለሁ", "እንደምን ነህ", "በብዛት"],
        answer: "ሰላም"
      }
    ],
    objectives: ["Learn basic greetings", "Practice pronunciation"],
    isPremium: true
  },
  {
    id: 7,
    title: "Numbers 1-5",
    category: "vocabulary",
    level: "beginner",
    orderIndex: 7,
    content: {
      amharic: ["አንድ", "ሁለት", "ሶስት", "አራት", "አምስት"],
      arabic: ["واحد", "اثنان", "ثلاثة", "أربعة", "خمسة"],
      english: ["One", "Two", "Three", "Four", "Five"]
    },
    audioUrl: "/audio/lesson7_numbers.mp3",
    slowAudioUrl: "/audio/lesson7_numbers_slow.mp3",
    quizQuestions: [
      {
        type: "multipleChoice",
        question: "What is 'Three' in Amharic?",
        options: ["ሶስት", "አራት", "ሁለት", "አምስት"],
        answer: "ሶስት"
      }
    ],
    objectives: ["Learn numbers 1-5", "Practice counting"],
    isPremium: true
  },
  {
    id: 8,
    title: "Family Members",
    category: "vocabulary",
    level: "beginner",
    orderIndex: 8,
    content: {
      amharic: ["እናት", "አባት", "ወንድም", "እህት"],
      arabic: ["أم", "أب", "أخ", "أخت"],
      english: ["Mother", "Father", "Brother", "Sister"]
    },
    audioUrl: "/audio/lesson8_family.mp3",
    slowAudioUrl: "/audio/lesson8_family_slow.mp3",
    quizQuestions: [
      {
        type: "multipleChoice",
        question: "What is 'Mother' in Amharic?",
        options: ["እናት", "አባት", "እህት", "ወንድም"],
        answer: "እናት"
      }
    ],
    objectives: ["Learn family vocabulary", "Practice pronunciation"],
    isPremium: true
  }
];

// Generate additional lessons for months 2-15 (simplified structure)
export function generateAdditionalLessons() {
  const additionalLessons = [];
  let lessonId = 9;
  
  const categories = ["vocabulary", "grammar", "conversation", "culture"];
  const topics = [
    { en: "Colors" },
    { en: "Food" },
    { en: "Animals" },
    { en: "Body Parts" },
    { en: "Weather" },
    { en: "Time" },
    { en: "Days of Week" },
    { en: "Months" },
    { en: "Clothes" },
    { en: "House" },
    { en: "Transportation" },
    { en: "Occupations" },
    { en: "Emotions" },
    { en: "Actions" },
    { en: "Places" },
    { en: "Shopping" },
    { en: "Restaurant" },
    { en: "Hospital" },
    { en: "School" }
  ];
  
  for (let month = 2; month <= 15; month++) {
    for (let i = 0; i < 55; i++) {
      const category = categories[i % categories.length];
      const topicIndex = i % topics.length;
      const topicObj = topics[topicIndex];
      const lessonNumber = Math.floor(i / topics.length) + 1;
      
      additionalLessons.push({
        id: lessonId,
        title: `${topicObj.en} ${lessonNumber}`,
        category,
        level: month <= 5 ? "beginner" : month <= 10 ? "intermediate" : "advanced",
        orderIndex: lessonId,
        content: {
          amharic: [`ቃል${lessonId}`],
          arabic: [`كلمة${lessonId}`],
          english: [`${topicObj.en} Word ${lessonNumber}`]
        },
        audioUrl: `/audio/lesson${lessonId}.mp3`,
        slowAudioUrl: `/audio/lesson${lessonId}_slow.mp3`,
        quizQuestions: [
          {
            type: "multipleChoice",
            question: `What does ቃል${lessonId} mean?`,
            options: [`Word${lessonId}`, "Other1", "Other2", "Other3"],
            answer: `Word${lessonId}`
          }
        ],
        objectives: [`Learn ${topicObj.en}`, "Practice pronunciation"],
        isPremium: true
      });
      
      lessonId++;
    }
  }
  
  return [...initialLessons, ...additionalLessons];
}
