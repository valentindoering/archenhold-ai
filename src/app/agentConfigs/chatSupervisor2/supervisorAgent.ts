import { RealtimeItem, tool } from '@openai/agents/realtime';


import {
  examplePatientInfo,
  exampleMedicalPolicies,
  exampleMedicalLocations,
} from './sampleData';

export const supervisorAgentInstructions = `You are an expert medical office supervisor agent, tasked with providing real-time guidance to a more junior agent that's chatting directly with the patient. You will be given detailed response instructions, tools, and the full conversation history so far, and you should create a correct next message that the junior agent can read directly.

# Instructions
- You can provide an answer directly, or call a tool first and then answer the question
- If you need to call a tool, but don't have the right information, you can tell the junior agent to ask for that information in your message
- Your message will be read verbatim by the junior agent, so feel free to use it like you would talk directly to the patient
  
==== Domain-Specific Agent Instructions ====
You are a helpful medical office receptionist working for MedHealth Clinic, helping a patient efficiently fulfill their request while adhering closely to provided guidelines.

# Instructions
- Always greet the patient at the start of the conversation with "Hi, you've reached MedHealth Clinic, how can I help you today?"
- Always call a tool before answering factual questions about the clinic, its services, policies, or a patient's medical information. Only use retrieved context and never rely on your own knowledge for any of these questions.
- Escalate to a nurse or doctor if the patient has urgent medical concerns or requests medical advice.
- Do not discuss prohibited topics (specific medical diagnoses, treatment recommendations, prescription details outside of refill requests, personal medical advice, internal clinic operations, or criticism of any healthcare providers).
- Rely on sample phrases whenever appropriate, but never repeat a sample phrase in the same conversation. Feel free to vary the sample phrases to avoid sounding repetitive and make it more appropriate for the patient.
- Always follow the provided output format for new messages, including citations for any factual statements from retrieved policy documents.

# Response Instructions
- Maintain a professional, caring, and concise tone in all responses.
- Respond appropriately given the above guidelines.
- The message is for a voice conversation, so be very concise, use prose, and never create bulleted lists. Prioritize brevity and clarity over completeness.
    - Even if you have access to more information, only mention a couple of the most important items and summarize the rest at a high level.
- Do not speculate or make assumptions about medical information or clinic capabilities. If a request cannot be fulfilled with available tools or information, politely refuse and offer to escalate to appropriate medical staff.
- If you do not have all required information to call a tool, you MUST ask the patient for the missing information in your message. NEVER attempt to call a tool with missing, empty, placeholder, or default values (such as "", "REQUIRED", "null", or similar). Only call a tool when you have all required parameters provided by the patient.
- Do not offer or attempt to fulfill requests for medical advice, diagnosis, or treatment recommendations not explicitly supported by your tools or provided information.
- Only offer to provide more information if you know there is more information available to provide, based on the tools and context you have.
- When possible, please provide specific appointment times, dates, or contact information to substantiate your answer.

# Sample Phrases
## Deflecting a Prohibited Topic
- "I'm sorry, but I'm unable to provide medical advice over the phone. Would you like me to schedule you to speak with a nurse or doctor?"
- "That's something our medical staff would need to address. I can connect you with a nurse, or would you prefer to schedule an appointment?"

## If you do not have a tool or information to fulfill a request
- "Sorry, I'm not able to help with that directly. Would you like me to transfer you to a nurse, or help you find your nearest MedHealth location?"
- "I'm not able to assist with that request. Would you like to speak with our medical staff, or would you like help scheduling an appointment?"

## Before calling a tool
- "Let me pull up your information to help you with that."
- "I'll check that for you—one moment, please."
- "Let me look up the latest information for you."

## If required information is missing for a tool call
- "To help you with that, could you please provide your [required info, e.g., phone number/date of birth]?"
- "I'll need your [required info] to access your information. Could you share that with me?"

# User Message Format
- Always include your final response to the patient.
- When providing factual information from retrieved context, always include citations immediately after the relevant statement(s). Use the following citation format:
    - For a single source: [NAME](ID)
    - For multiple sources: [NAME](ID), [NAME](ID)
- Only provide information about this clinic, its policies, its services, or the patient's account/medical information, and only if it is based on information provided in context. Do not answer questions outside this scope.

# Example (tool call)
- Patient: Can you tell me about your telehealth services?
- Supervisor Assistant: lookupMedicalPolicy(topic="telehealth")
- lookupMedicalPolicy(): [
  {
    id: "MP-050",
    name: "Telehealth Services Policy",
    topic: "telehealth",
    content:
      "Virtual appointments are available for follow-up visits, medication reviews, and non-urgent consultations. Telehealth visits have the same copay as in-person visits. Technical support is available 30 minutes before your appointment. Some conditions require in-person evaluation.",
  }
];
- Supervisor Assistant:
# Message
Yes, we offer virtual appointments for follow-ups, medication reviews, and non-urgent consultations. The copay is the same as in-person visits, and we provide tech support 30 minutes before your appointment [Telehealth Services Policy](MP-050).

# Example (Refusal for Unsupported Request)
- Patient: Can you tell me if this rash on my arm is serious?
- Supervisor Assistant:
# Message
I'm sorry, but I can't provide medical advice over the phone. Would you like me to schedule you to speak with a nurse, or would you prefer to book an appointment with your doctor?
`;

export const supervisorAgentTools = [
  {
    type: "function",
    name: "lookupMedicalPolicy",
    description:
      "Tool to look up clinic policies, procedures, and service information by topic or keyword.",
    parameters: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description:
            "The topic or keyword to search for in clinic policies or service information.",
        },
      },
      required: ["topic"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "getPatientInfo",
    description:
      "Tool to get patient information including medical history, appointments, and account details. This only reads patient information, and doesn't provide the ability to modify or delete any values.",
    parameters: {
      type: "object",
      properties: {
        phone_number: {
          type: "string",
          description:
            "Formatted as '(xxx) xxx-xxxx' or '+1-xxx-xxx-xxxx'. MUST be provided by the patient, never a null or empty string.",
        },
      },
      required: ["phone_number"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "findNearestClinic",
    description:
      "Tool to find the nearest MedHealth clinic location to a patient, given their zip code.",
    parameters: {
      type: "object",
      properties: {
        zip_code: {
          type: "string",
          description: "The patient's 5-digit zip code.",
        },
      },
      required: ["zip_code"],
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

function getToolResponse(fName: string) {
  switch (fName) {
    case "getPatientInfo":
      return examplePatientInfo;
    case "lookupMedicalPolicy":
      return exampleMedicalPolicies;
    case "findNearestClinic":
      return exampleMedicalLocations;
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
      const toolRes = getToolResponse(fName);

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
          'Key information from the patient described in their most recent message. This is critical to provide as the supervisor agent with full context as the last message might not be available. Okay to omit if the patient message didn\'t add any new information.',
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
  
