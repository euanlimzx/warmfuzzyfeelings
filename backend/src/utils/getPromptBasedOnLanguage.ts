// import { franc } from "franc";

type LanguageBasedPrompt = {
  characterTraits: string;
  summary: string;
};

const languageBasedPrompts = {
  cmn: {
    characterTraits: `您是理解和赞美他人的专家。
      根据给定的人物推荐信，创作一个有趣主题的人物总结，能让读者会心一笑。
      请排除当事人的姓名, 撰写信息时就像您在面对面与他们交谈一样。尽可能多地使用personDescriptionResponse字段。尽量避免重复responderNames。
      请将您的总结控制在80字以内。
      <示例>
      舒适圈冠军
      你知道自己喜欢什么，并且不为此感到羞耻。你有最爱的咖啡店、固定的晚餐点单，还有那个总是懂你笑话的朋友。当生活可预测时，生活就很美好。
      熟悉感·规律·忠诚·稳定

      深度挖掘者
      你不会满足于表面层次的东西。当某事引起你的注意时，你会进入完全痴迷模式——阅读每篇文章，观看每个视频，基本上成为非官方专家。
      熟悉感·规律·多样性·稳定

      "那边有什么？"的人
      你对做同样的事情基本过敏。当其他人都在坚持计划时，你已经领先三步在问"但如果我们尝试这个呢？"
      探索·规律·多样性·成长
      
      人际桥梁
      你是那种无论走到哪里都认识人的朋友。你像收集交易卡一样收集人脉和经历，总是试图让你不同的朋友圈聚在一起。
      探索·规律·多样性·社交
      马拉松跑者
      你像没人能比的那样进行长远规划。当其他人都在追逐闪亮的新事物时，你在这里建造真正持久的东西。慢而稳不是无聊——是聪明。
      基础·规律·忠诚·稳定
      
      万能贝果
      你的大脑就像同时打开47个浏览器标签页，说实话？你不愿意改变这种方式。昨天是陶艺，今天是古代历史，明天谁知道呢。
      探索·新鲜感·多样性·成长
      
      生死之交
      当你投入时，你是全身心投入。无论是爱好、人，还是那个没人听过的奇怪独立乐队，你都会在美好时光和"我为什么要这样做？"的时候坚持下去。
      熟悉感·新鲜感·忠诚·稳定
      
      搅局朋友
      你是那个建议随机公路旅行、尝试奇怪菜单项目、问"但如果我们完全不同地做会怎样？"的人。你的存在就让生活变得更有趣。
      探索·新鲜感·多样性·成长
      </示例>`,
    summary: `根据给定的人物总结和来源，识别总结中可以归因于来源信息的词语。遵循给定的模式。
为总结中的每个词语创建一个数组元素，如果没有可以归因该词语的来源，则将来源留空。
尽可能避免来源的重复使用。`,
  },
  eng: {
    characterTraits: `You are an expert on understanding and celebrating people. 
              Based on the charcter testimonials given, create a fun-themed character summary that would put a smile on the face of the reader.
              Exclude the person's name, craft the message as if you were speaking to them in person. Use as many personDescriptionResponse fields as possible. Try and avoid repeating responderNames
              Make your summary no longer than 80 words.
    
              <Examples>
                The Comfort Zone Champion
                You know what you like and you're not ashamed of it. You've got your favorite coffee shop, your go-to dinner order, and that one friend who always gets your jokes. Life's good when it's predictable.
                FRLS
                Familiarity · Routine · Loyalty · Stability
    
                The Deep Diver
                You don't mess around with surface-level stuff. When something catches your eye, you're going full obsession mode—reading every article, watching every video, basically becoming the unofficial expert.
                FRVS
                Familiarity · Routine · Variety · Stability
    
                The "What's Over There?" Person
                You're basically allergic to doing the same thing twice. While everyone else is sticking to the plan, you're already three steps ahead asking "but what if we tried this instead?"
                ERVG
                Exploration · Routine · Variety · Growth
    
                The Human Bridge
                You're that friend who somehow knows someone everywhere you go. You collect people and experiences like trading cards, and you're always trying to get your different friend groups to hang out.
                ERVS
                Exploration · Routine · Variety · Social
    
                The Marathon Runner
                You play the long game like nobody's business. While everyone else is chasing shiny new things, you're over here building something that'll actually last. Slow and steady isn't boring—it's smart.
                FRLS
                Foundation · Routine · Loyalty · Stability
    
                The Everything Bagel
                Your brain is like having 47 browser tabs open at once, and honestly? You wouldn't have it any other way. Yesterday it was pottery, today it's ancient history, tomorrow who knows.
                ENVG
                Exploration · Newness · Variety · Growth
    
                The Ride-or-Die
                When you're in, you're ALL in. Whether it's a hobby, a person, or that weird indie band nobody's heard of, you stick around through the good times and the "why am I doing this?" times.
                FNLS
                Familiarity · Newness · Loyalty · Stability
    
                The Shake-Things-Up Friend
                You're the one who suggests the random road trip, tries the weird menu item, and asks "but what if we did it completely differently?" You make life more interesting just by existing.
                ENVG
                Exploration · Newness · Variety · Growth
              </Examples>`,
    summary: `Based on the given character summary and source, identify the words in the summary that can be attributed to messages in the source.
        Follow the given schema.
        Create one array element per word in the summary, leaving the sources empty if there are no sources that you can attribute to the word.
        Avoid repetition of the sources as much as possible.`,
  },
};

// frunc works best on large chunks of text, so the idea would be to concatenate all responses to create language detection
// for now, this rests on the assumption that the inputs are of only one language
const getLanguageBasedPrompt = async (
  comments: string,
): Promise<LanguageBasedPrompt> => {
  console.log(comments);

  // Use dynamic import for franc
  const { franc } = await import("franc");

  // then check the predominant language of the DB records
  const identifiedLanguage = franc(comments);

  console.log(identifiedLanguage);

  // then output the right instructions for the LLM to use
  return languageBasedPrompts[
    identifiedLanguage as keyof typeof languageBasedPrompts
  ];
};

export default getLanguageBasedPrompt;
