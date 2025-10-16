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
      chinese: ["字母A"],
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
      chinese: ["字母L"],
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
      chinese: ["字母M"],
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
      chinese: ["字母R"],
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
      chinese: ["字母S"],
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
      chinese: ["你好"],
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
      chinese: ["一", "二", "三", "四", "五"],
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
      chinese: ["母亲", "父亲", "兄弟", "姐妹"],
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
    { en: "Colors", zh: "颜色", vocab: ["红色", "蓝色", "绿色", "黄色", "黑色"] },
    { en: "Food", zh: "食物", vocab: ["面包", "水", "水果", "肉", "蔬菜"] },
    { en: "Animals", zh: "动物", vocab: ["狗", "猫", "鸟", "鱼", "马"] },
    { en: "Body Parts", zh: "身体部位", vocab: ["头", "手", "脚", "眼睛", "耳朵"] },
    { en: "Weather", zh: "天气", vocab: ["晴天", "雨", "雪", "风", "云"] },
    { en: "Time", zh: "时间", vocab: ["早上", "中午", "下午", "晚上", "夜晚"] },
    { en: "Days of Week", zh: "星期", vocab: ["星期一", "星期二", "星期三", "星期四", "星期五"] },
    { en: "Months", zh: "月份", vocab: ["一月", "二月", "三月", "四月", "五月"] },
    { en: "Clothes", zh: "衣服", vocab: ["衬衫", "裤子", "鞋", "帽子", "外套"] },
    { en: "House", zh: "房子", vocab: ["门", "窗户", "桌子", "椅子", "床"] },
    { en: "Transportation", zh: "交通", vocab: ["汽车", "公交车", "自行车", "火车", "飞机"] },
    { en: "Occupations", zh: "职业", vocab: ["医生", "老师", "工程师", "护士", "司机"] },
    { en: "Emotions", zh: "情感", vocab: ["快乐", "悲伤", "生气", "害怕", "惊讶"] },
    { en: "Actions", zh: "动作", vocab: ["跑", "走", "坐", "站", "吃"] },
    { en: "Places", zh: "地点", vocab: ["学校", "医院", "公园", "商店", "家"] },
    { en: "Shopping", zh: "购物", vocab: ["买", "卖", "价格", "便宜", "贵"] },
    { en: "Restaurant", zh: "餐厅", vocab: ["菜单", "点菜", "饮料", "结账", "服务员"] },
    { en: "Hospital", zh: "医院", vocab: ["病人", "医生", "护士", "药", "治疗"] },
    { en: "School", zh: "学校", vocab: ["学生", "老师", "教室", "书", "考试"] }
  ];
  
  // Track vocabulary index for each topic to ensure all words are used
  const topicVocabCounters = new Array(topics.length).fill(0);
  
  for (let month = 2; month <= 15; month++) {
    for (let i = 0; i < 55; i++) {
      const category = categories[i % categories.length];
      const topicIndex = i % topics.length;
      const topicObj = topics[topicIndex];
      const vocabIndex = topicVocabCounters[topicIndex] % topicObj.vocab.length;
      
      // Increment counter for this topic
      topicVocabCounters[topicIndex]++;
      
      additionalLessons.push({
        id: lessonId,
        title: `${topicObj.en} ${Math.floor(topicVocabCounters[topicIndex] / topicObj.vocab.length) + 1}`,
        category,
        level: month <= 5 ? "beginner" : month <= 10 ? "intermediate" : "advanced",
        orderIndex: lessonId,
        content: {
          amharic: [`ቃል${lessonId}`],
          chinese: [topicObj.vocab[vocabIndex]],
          arabic: [`كلمة${lessonId}`],
          english: [`${topicObj.en} Word ${vocabIndex + 1}`]
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
