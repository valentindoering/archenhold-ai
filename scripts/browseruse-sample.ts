// npx tsx scripts/browseruse-sample.ts
import { BrowserUse } from 'browser-use-sdk'
import 'dotenv/config'

// Check for API key in environment variables
const apiKey = process.env.BROWSERUSE_API_KEY || process.env.BROWSER_USE_API_KEY;

if (!apiKey) {
  console.error('Error: Missing BrowserUse API key!');
  console.error('Please set either BROWSERUSE_API_KEY or BROWSER_USE_API_KEY environment variable.');
  console.error('');
  console.error('Options:');
  console.error('1. Create a .env file in the project root with:');
  console.error('   BROWSERUSE_API_KEY=your-api-key-here');
  console.error('');
  console.error('2. Or export it in your shell:');
  console.error('   export BROWSERUSE_API_KEY="your-api-key-here"');
  console.error('');
  console.error('Get your API key from: https://browseruse.ai');
  process.exit(1);
}

const client = new BrowserUse({
  apiKey: apiKey,
});

const TODAY = "2025-08-16";

interface Person {
  name: string;
  location: string;
  loves: string;
}

const PEOPLE: Person[] = [
  // ...
  {
    name: "Valentin Döring",
    location: "SF, CA",
    loves: "Exploring new places like Slovenia.",
  },
];

async function main() {
  for (const person of PEOPLE) {
    const task = await client.tasks.create({
      agentSettings: { llm: "gpt-4.1" },
      task: `
        You are a travel planning assistant.

        Find a great flight

          - from ${person.location}
          - on ${TODAY}
          - for ${person.name}
          - who loves ${person.loves}.
        
        List the top 3 flights with links and price.
      `,
    })
    
    console.log(`Created task for ${person.name}:`, task);
  }
}

main().catch(console.error);