
import { Message, Course, Chapter, DifyConfig } from "../types";

interface DifyResponse {
  event: string;
  message_id: string;
  conversation_id: string;
  answer: string;
  created_at: number;
}

export const getDifyCoachResponse = async (
  query: string,
  currentCourse: Course,
  currentChapter: Chapter,
  config: DifyConfig,
  conversationId?: string
): Promise<{ answer: string; conversationId: string }> => {
  const { apiKey, baseUrl } = config;

  if (!apiKey || apiKey === "YOUR_DIFY_API_KEY") {
    return {
      answer: "⚠️ **Coach Offline**: The Admin has not configured a valid Dify API Key yet. Please contact support.",
      conversationId: conversationId || ""
    };
  }

  try {
    const response = await fetch(`${baseUrl}/chat-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: {
          course_title: currentCourse.title,
          chapter_title: currentChapter.title,
          chapter_description: currentChapter.description,
          content_summary: currentChapter.content
            .filter(c => c.type === 'text')
            .map(c => c.body)
            .join("\n\n")
        },
        query: query,
        response_mode: "blocking",
        user: "edustream-user-default",
        conversation_id: conversationId || "",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to connect to Dify");
    }

    const data: DifyResponse = await response.json();
    
    return {
      answer: data.answer,
      conversationId: data.conversation_id
    };
  } catch (error) {
    console.error("Dify Service Error:", error);
    return {
      answer: "I'm having trouble connecting to my brain (Dify). Please check the API configuration in settings.",
      conversationId: conversationId || ""
    };
  }
};
