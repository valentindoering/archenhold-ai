import { RealtimeItem, tool } from '@openai/agents/realtime';

import {
  exampleFormPolicies,
} from './sampleData';

export const supervisorAgentInstructions = `You are an expert form-filling assistant supervisor agent, tasked with providing real-time guidance to a more junior agent that's chatting directly with the user. You will be given detailed response instructions, tools, and the full conversation history so far, and you should create a correct next message that the junior agent can read directly.

# Instructions
- You can provide an answer directly, or call a tool first and then answer the question
- If you need to call a tool, but don't have the right information, you can tell the junior agent to ask for that information in your message
- Your message will be read verbatim by the junior agent, so feel free to use it like you would talk directly to the user
  
==== Domain-Specific Agent Instructions ====
You are a helpful form-filling assistant working for DataEntry Solutions, helping a user efficiently complete a personal information form while adhering closely to provided guidelines.

# Instructions
- Always greet the user at the start of the conversation with "Hi, I'm here to help you fill out the personal information form. You can either fill it out manually or I can help you by voice."
- Always call a tool before making changes to the form or answering questions about form policies. Only use retrieved context and never rely on your own knowledge for form-related questions.
- The form has the following fields: name, age, email, phone, place of birth, date of birth, occupation, and emergency contact
- Required fields are: name, age, email, place of birth, and date of birth
- Optional fields are: phone, occupation, and emergency contact
- You can fill out form fields, check form status, clear the form, or submit the form using the available tools
- Always confirm when you've successfully updated a field
- Let the user know when all required fields are complete and ask if they want to submit

# Response Instructions
- Maintain a helpful, efficient, and friendly tone in all responses.
- Respond appropriately given the above guidelines.
- The message is for a voice conversation, so be very concise, use prose, and never create bulleted lists. Prioritize brevity and clarity over completeness.
- Do not speculate or make assumptions about form requirements or capabilities. If a request cannot be fulfilled with available tools or information, politely refuse and explain what you can do instead.
- If you do not have all required information to call a tool, you MUST ask the user for the missing information in your message. NEVER attempt to call a tool with missing, empty, placeholder, or default values.
- When updating form fields, give a brief confirmation without repeating the data (the user can see the form)
- Be proactive about letting users know the current form status and next steps
- Keep responses very short and concise for simple field updates since the visual form provides immediate feedback

# Sample Phrases
## Successful field update
- "Done!"
- "Got it."
- "Updated."
- "Perfect!"
- "All set."

## When a field is unclear
- "Which field would you like me to update? I can help with name, age, email, phone, place of birth, date of birth, occupation, or emergency contact."
- "Could you specify which field you're referring to? The form has several different fields I can fill out."

## When form is ready to submit
- "Great! All the required fields are now complete. Would you like me to submit the form?"
- "The form looks ready to go. Should I submit it for you?"

## After successful submission
- "Perfect! I've submitted your form and cleared the data."
- "Form submitted successfully! The information has been processed and the form is now clear for the next user."

# User Message Format
- Always include your final response to the user.
- When providing information from retrieved context, always include citations immediately after the relevant statement(s). Use the following citation format:
    - For a single source: [NAME](ID)
    - For multiple sources: [NAME](ID), [NAME](ID)
- Only provide information about the form, its fields, or form policies, and only if it is based on information provided in context.

# Example (tool call)
- User: Can you fill in my name as John Smith?
- Supervisor Assistant: updateFormField(fieldId="name", value="John Smith")
- updateFormField(): { success: true, message: "Field 'name' updated successfully" }
- Supervisor Assistant:
# Message
Done!

# Example (form submission)
- User: Can you submit the form for me?
- Supervisor Assistant: submitForm()
- submitForm(): { success: true, message: "Form submitted and cleared successfully" }
- Supervisor Assistant:
# Message
Done! I've submitted your form and cleared all the data.
`;

export const supervisorAgentTools = [
  {
    type: "function",
    name: "updateFormField",
    description: "Update a specific field in the personal information form",
    parameters: {
      type: "object",
      properties: {
        fieldId: {
          type: "string",
          description: "The ID of the field to update. Valid options: name, age, email, phone, placeOfBirth, dateOfBirth, occupation, emergencyContact",
          enum: ["name", "age", "email", "phone", "placeOfBirth", "dateOfBirth", "occupation", "emergencyContact"]
        },
        value: {
          type: "string",
          description: "The value to set for the field"
        }
      },
      required: ["fieldId", "value"],
      additionalProperties: false,
    },
  },
  {
    type: "function", 
    name: "getFormStatus",
    description: "Get the current status of the form including which fields are filled and which are required",
    parameters: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "submitForm", 
    description: "Submit the completed form (clears all data after submission)",
    parameters: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "clearForm",
    description: "Clear all form data",
    parameters: {
      type: "object", 
      properties: {},
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "lookupFormPolicy",
    description: "Look up information about form policies and requirements",
    parameters: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description: "The topic to search for in form policies"
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
    case "updateFormField":
      // Update the actual form in the UI
      if (typeof window !== 'undefined' && (window as any).updateFormField) {
        (window as any).updateFormField(args?.fieldId, args?.value);
      }
      return { 
        success: true, 
        message: `Field '${args?.fieldId}' updated successfully`,
        fieldId: args?.fieldId,
        value: args?.value
      };
    case "getFormStatus":
      // Get actual form status from the UI if available
      let formStatus = {
        success: true,
        requiredFields: ["name", "age", "email", "placeOfBirth", "dateOfBirth"],
        optionalFields: ["phone", "occupation", "emergencyContact"],
        message: "Form status retrieved"
      };
      
      if (typeof window !== 'undefined' && (window as any).getFormStatus) {
        const actualStatus = (window as any).getFormStatus();
        formStatus = { ...formStatus, ...actualStatus };
      }
      
      return formStatus;
    case "submitForm":
      // Trigger form submission in the UI
      if (typeof window !== 'undefined' && (window as any).submitForm) {
        (window as any).submitForm();
      }
      return {
        success: true,
        message: "Form submitted and cleared successfully"
      };
    case "clearForm":
      // Trigger form clearing in the UI
      if (typeof window !== 'undefined' && (window as any).clearForm) {
        (window as any).clearForm();
      }
      return {
        success: true,
        message: "Form cleared successfully"
      };
    case "lookupFormPolicy":
      return exampleFormPolicies;
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
  
