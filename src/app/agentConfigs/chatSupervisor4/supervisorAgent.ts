import { RealtimeItem, tool } from '@openai/agents/realtime';

import {
  exampleFlashcardPolicies,
} from './sampleData';

export const supervisorAgentInstructions = `You are an expert flashcard learning assistant supervisor agent, tasked with providing real-time guidance to a more junior agent that's chatting directly with the user. You will be given detailed response instructions, tools, and the full conversation history so far, and you should create a correct next message that the junior agent can read directly.

# Instructions
- You can provide an answer directly, or call a tool first and then answer the question
- If you need to call a tool, but don't have the right information, you can tell the junior agent to ask for that information in your message
- Your message will be read verbatim by the junior agent, so feel free to use it like you would talk directly to the user
  
==== Domain-Specific Agent Instructions ====
You are a helpful flashcard learning assistant working for LanguageMaster Pro, helping a user efficiently learn Spanish through interactive flashcard sessions while adhering closely to provided guidelines.

# Instructions
- Always greet the user at the start of the conversation with "Hi, I'm here to help you practice Spanish with flashcards. You can start a session by saying 'start' or by using the buttons on the flashcard app."
- Always call a tool before making changes to the flashcard app or answering questions about learning policies. Only use retrieved context and never rely on your own knowledge for flashcard-related questions.
- The flashcard app has the following controls: start session, next card, and restart (translations are always visible)
- You can control the flashcard app, start sessions, or navigate through cards using the available tools
- Always confirm when you've successfully performed an action on the flashcard app
- Let the user know when they've completed all flashcards and ask if they want to restart
- When evaluating user Spanish pronunciation attempts, provide feedback in English only
- If the user's Spanish attempt is reasonably close or correct, automatically advance to the next card after providing encouragement

# Response Instructions
- Maintain a helpful, encouraging, and friendly tone in all responses.
- Respond appropriately given the above guidelines.
- The message is for a voice conversation, so be very concise, use prose, and never create bulleted lists. Prioritize brevity and clarity over completeness.
- Do not speculate or make assumptions about flashcard requirements or capabilities. If a request cannot be fulfilled with available tools or information, politely refuse and explain what you can do instead.
- If you do not have all required information to call a tool, you MUST ask the user for the missing information in your message. NEVER attempt to call a tool with missing, empty, placeholder, or default values.
- When controlling the flashcard app, give a brief confirmation without over-explaining (the user can see the app)
- Be proactive about encouraging users and helping them progress through their learning session
- Keep responses very short and concise for simple app controls since the visual flashcard app provides immediate feedback

# Sample Phrases
## Successful app control
- "Started!"
- "Next card!"
- "Perfect!"
- "Session restarted!"

## Evaluating user Spanish attempts (always in English)
- "Excellent! That's correct. Moving to the next card."
- "Great job! You got it right. Let's continue."
- "Perfect pronunciation! Next card coming up."
- "Good effort! That was close. Let me help you with the correct pronunciation and then we'll move on."
- "Nice try! The correct pronunciation is [provide guidance]. Let's try the next one."

## When app action is unclear
- "Would you like me to start the flashcard session or go to the next card?"
- "I can help you start, go to the next card, or restart the session."

## When session is complete
- "Great job! You've completed all the flashcards. Would you like to start over?"
- "Excellent work! You've finished the session. Want to try again?"

## After successful session restart
- "Perfect! I've restarted the flashcard session. Ready to begin again?"
- "Session restarted! Let's practice those Spanish phrases again."

# User Message Format
- Always include your final response to the user.
- When providing information from retrieved context, always include citations immediately after the relevant statement(s). Use the following citation format:
    - For a single source: [NAME](ID)
    - For multiple sources: [NAME](ID), [NAME](ID)
- Only provide information about the flashcard app, its features, or learning policies, and only if it is based on information provided in context.

# Example (tool call)
- User: Can you start the flashcard session?
- Supervisor Assistant: startFlashcardSession()
- startFlashcardSession(): { success: true, message: "Flashcard session started successfully" }
- Supervisor Assistant:
# Message
Started!

# Example (session completion)
- User: Can you go to the next card?
- Supervisor Assistant: nextFlashcard()
- nextFlashcard(): { success: true, message: "Session completed - no more cards" }
- Supervisor Assistant:
# Message
Great job! You've completed all the flashcards. Would you like to start over?
`;

export const supervisorAgentTools = [
  {
    type: "function",
    name: "startFlashcardSession",
    description: "Start the flashcard learning session",
    parameters: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    type: "function", 
    name: "nextFlashcard",
    description: "Move to the next flashcard in the session",
    parameters: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "restartSession",
    description: "Restart the flashcard session from the beginning",
    parameters: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "getFlashcardStatus",
    description: "Get the current status of the flashcard session",
    parameters: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "lookupFlashcardPolicy",
    description: "Look up information about flashcard learning policies and features",
    parameters: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description: "The topic to search for in flashcard policies"
        }
      },
      required: ["topic"],
      additionalProperties: false,
    },
  },
];

async function fetchResponsesMessage(body: any) {
  const response = await fetch('/api/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Preserve the previous behaviour of forcing sequential tool calls.
    body: JSON.stringify({ ...body, parallel_tool_calls: false }),
  });

  if (!response.ok) {
    console.warn('Server returned an error:', response);
    return { error: 'Something went wrong.' };
  }

  const completion = await response.json();
  return completion;
}

function getToolResponse(fName: string, args?: any) {
  switch (fName) {
    case "startFlashcardSession":
      // Start the flashcard session in the UI
      if (typeof window !== 'undefined' && (window as any).startFlashcardSession) {
        (window as any).startFlashcardSession();
      }
      return { 
        success: true, 
        message: "Flashcard session started successfully"
      };
    // Removed revealAnswer - translations are always visible
    case "nextFlashcard":
      // Move to next flashcard in the UI
      let nextResult = {
        success: true,
        message: "Moved to next flashcard"
      };
      
      if (typeof window !== 'undefined' && (window as any).nextFlashcard) {
        const result = (window as any).nextFlashcard();
        if (result && result.completed) {
          nextResult.message = "Session completed - no more cards";
        }
      }
      
      return nextResult;
    case "restartSession":
      // Restart the flashcard session in the UI
      if (typeof window !== 'undefined' && (window as any).restartFlashcardSession) {
        (window as any).restartFlashcardSession();
      }
      return {
        success: true,
        message: "Flashcard session restarted successfully"
      };
    case "getFlashcardStatus":
      // Get flashcard status from the UI if available
      let flashcardStatus = {
        success: true,
        currentCard: 1,
        totalCards: 10,
        isStarted: false,
        isRevealed: false,
        message: "Flashcard status retrieved"
      };
      
      if (typeof window !== 'undefined' && (window as any).getFlashcardStatus) {
        const actualStatus = (window as any).getFlashcardStatus();
        flashcardStatus = { ...flashcardStatus, ...actualStatus };
      }
      
      return flashcardStatus;
    case "lookupFlashcardPolicy":
      return exampleFlashcardPolicies;
    default:
      return { result: true };
  }
}

/**
 * Iteratively handles function calls returned by the Responses API until the
 * supervisor produces a final textual answer. Returns that answer as a string.
 */
async function handleToolCalls(
  body: any,
  response: any,
  addBreadcrumb?: (title: string, data?: any) => void,
) {
  let currentResponse = response;

  while (true) {
    if (currentResponse?.error) {
      return { error: 'Something went wrong.' } as any;
    }

    const outputItems: any[] = currentResponse.output ?? [];

    // Gather all function calls in the output.
    const functionCalls = outputItems.filter((item) => item.type === 'function_call');

    if (functionCalls.length === 0) {
      // No more function calls – build and return the assistant's final message.
      const assistantMessages = outputItems.filter((item) => item.type === 'message');

      const finalText = assistantMessages
        .map((msg: any) => {
          const contentArr = msg.content ?? [];
          return contentArr
            .filter((c: any) => c.type === 'output_text')
            .map((c: any) => c.text)
            .join('');
        })
        .join('\n');

      return finalText;
    }

    // For each function call returned by the supervisor model, execute it locally and append its
    // output to the request body as a `function_call_output` item.
    for (const toolCall of functionCalls) {
      const fName = toolCall.name;
      const args = JSON.parse(toolCall.arguments || '{}');
      const toolRes = getToolResponse(fName, args);

      // Since we're using a local function, we don't need to add our own breadcrumbs
      if (addBreadcrumb) {
        addBreadcrumb(`[supervisorAgent] function call: ${fName}`, args);
      }
      if (addBreadcrumb) {
        addBreadcrumb(`[supervisorAgent] function call result: ${fName}`, toolRes);
      }

      // Add function call and result to the request body to send back to realtime
      body.input.push(
        {
          type: 'function_call',
          call_id: toolCall.call_id,
          name: toolCall.name,
          arguments: toolCall.arguments,
        },
        {
          type: 'function_call_output',
          call_id: toolCall.call_id,
          output: JSON.stringify(toolRes),
        },
      );
    }

    // Make the follow-up request including the tool outputs.
    currentResponse = await fetchResponsesMessage(body);
  }
}

export const getNextResponseFromSupervisor = tool({
  name: 'getNextResponseFromSupervisor',
  description:
    'Determines the next response whenever the agent faces a non-trivial decision, produced by a highly intelligent supervisor agent. Returns a message describing what to do next.',
  parameters: {
    type: 'object',
    properties: {
      relevantContextFromLastUserMessage: {
        type: 'string',
        description:
          'Key information from the user described in their most recent message. This is critical to provide as the supervisor agent with full context as the last message might not be available. Okay to omit if the user message didn\'t add any new information.',
      },
    },
    required: ['relevantContextFromLastUserMessage'],
    additionalProperties: false,
  },
  execute: async (input, details) => {
    const { relevantContextFromLastUserMessage } = input as {
      relevantContextFromLastUserMessage: string;
    };

    const addBreadcrumb = (details?.context as any)?.addTranscriptBreadcrumb as
      | ((title: string, data?: any) => void)
      | undefined;

    const history: RealtimeItem[] = (details?.context as any)?.history ?? [];
    const filteredLogs = history.filter((log) => log.type === 'message');

    const body: any = {
      model: 'gpt-4.1',
      input: [
        {
          type: 'message',
          role: 'system',
          content: supervisorAgentInstructions,
        },
        {
          type: 'message',
          role: 'user',
          content: `==== Conversation History ====
          ${JSON.stringify(filteredLogs, null, 2)}
          
          ==== Relevant Context From Last User Message ===
          ${relevantContextFromLastUserMessage}
          `,
        },
      ],
      tools: supervisorAgentTools,
    };

    const response = await fetchResponsesMessage(body);
    if (response.error) {
      return { error: 'Something went wrong.' };
    }

    const finalText = await handleToolCalls(body, response, addBreadcrumb);
    if ((finalText as any)?.error) {
      return { error: 'Something went wrong.' };
    }

    return { nextResponse: finalText as string };
  },
});
  
