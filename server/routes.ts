import type { Express, Request, Response } from "express";
import { createServer, type Server } from "node:http";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const JOE_GIRARD_SYSTEM_PROMPT = `You are playing the role of "Joe Girard", the world's greatest salesman, as a training coach. 

# Your Identity:
- You are charismatic, enthusiastic, and direct
- You train salespeople to become legendary, not just at closing deals, but at building lifelong relationships

# Your Golden Rules (Philosophy):
1. **Law of 250**: Every customer knows 250 other people. Never lose one!
2. **Sell Yourself First**: People buy trust and personality before the product
3. **Absolute Honesty**: Lies kill business relationships
4. **Golden Memory**: Care about the smallest details of customers' lives
5. **Relentless Follow-up**: Your name should be in the customer's mind 24/7

# Training Session Rules:
- Play the customer role realistically based on the persona given
- After each user response, FIRST provide brief coaching feedback in [brackets] evaluating their sales skills
- Then continue the customer conversation
- Be challenging but fair - test their ability to build rapport, handle objections, and serve (not just sell)

# Evaluation Criteria:
1. Building Human Connection (Did they try to connect personally?)
2. Trust & Credibility (Were they honest and direct?)
3. Active Listening (Did they listen more than talk?)
4. Objection Handling (Did they turn objections into trust-building opportunities?)
5. Service Focus (Did they focus on serving rather than just selling?)

Keep responses conversational and realistic.`;

const CUSTOMER_PERSONAS: Record<string, string> = {
  hesitant: "You are a customer who loves the product but is terrified of making a commitment. You keep saying things like 'I need to think about it' and 'Let me talk to my spouse first'. You want reassurance but are genuinely nervous about big purchases.",
  "price-focused": "You are a highly analytical customer who has visited 5 competitors and knows every price point. You constantly compare prices and ask 'Can you beat their offer?' You respect value but need to be convinced, not just told.",
  angry: "You are a returning customer who is VERY upset about a previous purchase. Something went wrong and you feel ignored. You're giving them one more chance but you're skeptical. Start with 'I came back because I want to give you a chance to make this right.'",
  nervous: "You are a first-time buyer making a major purchase. You're excited but overwhelmed by options and afraid of making a mistake. You ask lots of questions and need patient guidance.",
  analytical: "You are a corporate decision-maker (like a CTO) evaluating this product for your company. You want data, proof points, and case studies. You're skeptical of salespeople and respect expertise.",
  bargain: "You are a bargain hunter who loves negotiating. You never accept the first price and always push for extras. You'll walk away if you don't feel like you got a special deal.",
  random: "You are a pleasant but undecided customer. You're browsing with no specific need but could be convinced if the right opportunity presents itself.",
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Training start endpoint
  app.post("/api/training/start", async (req: Request, res: Response) => {
    try {
      const { scenarioId, customerType } = req.body;
      const persona = CUSTOMER_PERSONAS[customerType] || CUSTOMER_PERSONAS.random;

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `${JOE_GIRARD_SYSTEM_PROMPT}\n\nCUSTOMER PERSONA: ${persona}\n\nStart the conversation as the customer. Give a realistic opening line as if you just walked into the store/office. Keep it to 1-2 sentences.`,
          },
          {
            role: "user",
            content: "Start the sales roleplay scenario.",
          },
        ],
        max_completion_tokens: 200,
      });

      const greeting = response.choices[0]?.message?.content || "Hi, I'm looking around today...";

      res.json({ greeting, scenarioId });
    } catch (error) {
      console.error("Error starting training:", error);
      res.json({ greeting: "Hi there, I'm just browsing today. What do you have?" });
    }
  });

  // Training respond endpoint
  app.post("/api/training/respond", async (req: Request, res: Response) => {
    try {
      const { scenarioId, customerType, messages } = req.body;
      const persona = CUSTOMER_PERSONAS[customerType] || CUSTOMER_PERSONAS.random;

      // Convert messages to OpenAI format
      const chatMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
        {
          role: "system",
          content: `${JOE_GIRARD_SYSTEM_PROMPT}\n\nCUSTOMER PERSONA: ${persona}\n\nRespond in this format:\n[COACHING FEEDBACK: Brief evaluation of the salesperson's last response - 1-2 sentences max]\n\nThen continue as the customer with a realistic response. Be challenging but fair.`,
        },
      ];

      // Add conversation history
      for (const msg of messages) {
        if (msg.role === "user") {
          chatMessages.push({ role: "user", content: msg.content });
        } else if (msg.role === "customer") {
          chatMessages.push({ role: "assistant", content: msg.content });
        }
      }

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: chatMessages,
        max_completion_tokens: 500,
      });

      const fullResponse = response.choices[0]?.message?.content || "I see...";

      // Parse feedback and customer response
      const feedbackMatch = fullResponse.match(/\[COACHING FEEDBACK:(.*?)\]/s);
      let feedback = feedbackMatch ? feedbackMatch[1].trim() : null;
      let customerResponse = fullResponse
        .replace(/\[COACHING FEEDBACK:.*?\]/s, "")
        .trim();

      // Clean up the response
      if (!customerResponse) {
        customerResponse = "Hmm, interesting...";
      }

      res.json({
        response: customerResponse,
        feedback: feedback,
      });
    } catch (error) {
      console.error("Error in training respond:", error);
      res.json({
        response: "Let me think about that for a moment...",
        feedback: null,
      });
    }
  });

  // Session summary endpoint (generates final feedback)
  app.post("/api/training/summary", async (req: Request, res: Response) => {
    try {
      const { messages, scenarioId } = req.body;

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `You are Joe Girard, the world's greatest salesman, reviewing a training session. Based on the conversation, provide:
1. A brief encouraging summary (2-3 sentences) of what the trainee did well
2. One specific area for improvement
3. A motivational quote in your signature style

Keep the total response under 100 words. Be warm but honest.`,
          },
          {
            role: "user",
            content: `Review this sales training conversation:\n${JSON.stringify(messages)}`,
          },
        ],
        max_completion_tokens: 200,
      });

      const feedback = response.choices[0]?.message?.content || "Great effort! Keep practicing and remember - every customer is a door to 250 more!";

      res.json({ feedback });
    } catch (error) {
      console.error("Error generating summary:", error);
      res.json({
        feedback: "Great job building rapport with the customer! Keep focusing on active listening and remember - people buy YOU before they buy the product!",
      });
    }
  });

  // Session evaluation endpoint
  app.post("/api/training/evaluate", async (req: Request, res: Response) => {
    try {
      const { scenarioId, customerType, messages, duration } = req.body;

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `You are Joe Girard, the world's greatest salesman, evaluating a sales training session.

Based on the conversation, provide a detailed evaluation in JSON format:
{
  "scores": {
    "buildingRapport": <0-100>,
    "buildingTrust": <0-100>,
    "activeListening": <0-100>,
    "handlingObjections": <0-100>,
    "focusOnService": <0-100>,
    "overall": <0-100>
  },
  "feedback": "<2-3 sentence personalized coaching feedback in Joe Girard's warm, encouraging style>",
  "keyStrengths": ["<strength 1>", "<strength 2>"],
  "areasToImprove": ["<area 1>", "<area 2>"]
}

Be encouraging but honest. The overall score should be a weighted average of all categories.
If the conversation was brief, adjust expectations accordingly.
Respond ONLY with valid JSON.`,
          },
          {
            role: "user",
            content: `Evaluate this ${Math.floor(duration / 60)} minute training session:\n\nScenario: ${scenarioId}\nCustomer Type: ${customerType}\n\nConversation:\n${messages.map((m: any) => `${m.role === 'user' ? 'Salesperson' : 'Customer'}: ${m.content}`).join('\n')}`,
          },
        ],
        max_completion_tokens: 500,
      });

      const content = response.choices[0]?.message?.content || "{}";
      
      // Parse JSON response
      try {
        const evaluation = JSON.parse(content);
        res.json(evaluation);
      } catch {
        // Fallback if JSON parsing fails
        res.json({
          scores: {
            buildingRapport: 70,
            buildingTrust: 65,
            activeListening: 70,
            handlingObjections: 60,
            focusOnService: 75,
            overall: 68,
          },
          feedback: content.slice(0, 200) || "Great effort! Keep practicing and remember - every customer is a door to 250 more!",
          keyStrengths: ["Building rapport", "Showing interest"],
          areasToImprove: ["Active listening", "Handling objections"],
        });
      }
    } catch (error) {
      console.error("Error evaluating session:", error);
      res.json({
        scores: {
          buildingRapport: 70,
          buildingTrust: 65,
          activeListening: 70,
          handlingObjections: 60,
          focusOnService: 75,
          overall: 68,
        },
        feedback: "Great job building rapport! Keep practicing and remember Joe's golden rule - people buy YOU before they buy the product!",
        keyStrengths: ["Building rapport"],
        areasToImprove: ["Active listening"],
      });
    }
  });

  // AI Tips generator based on analytics
  app.post("/api/training/tips", async (req: Request, res: Response) => {
    try {
      const { analytics, recentSessions } = req.body;

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `You are Joe Girard's AI coaching assistant. Based on the user's training analytics and recent sessions, generate 3 personalized tips to help them improve.

Format your response as JSON:
{
  "tips": [
    {"title": "<short title>", "description": "<1-2 sentence actionable tip>", "category": "<focus area>"},
    {"title": "<short title>", "description": "<1-2 sentence actionable tip>", "category": "<focus area>"},
    {"title": "<short title>", "description": "<1-2 sentence actionable tip>", "category": "<focus area>"}
  ]
}

Categories: buildingRapport, buildingTrust, activeListening, handlingObjections, focusOnService, consistency

Be specific and actionable. Reference Joe Girard's principles when relevant.
Respond ONLY with valid JSON.`,
          },
          {
            role: "user",
            content: `Analytics:\n${JSON.stringify(analytics)}\n\nRecent Sessions:\n${JSON.stringify(recentSessions?.slice(0, 3))}`,
          },
        ],
        max_completion_tokens: 400,
      });

      const content = response.choices[0]?.message?.content || "{}";
      
      try {
        const tips = JSON.parse(content);
        res.json(tips);
      } catch {
        res.json({
          tips: [
            { title: "Practice Makes Perfect", description: "Complete at least one training session daily to build muscle memory.", category: "consistency" },
            { title: "Focus on Listening", description: "In your next session, try asking 3 questions before making any statements.", category: "activeListening" },
            { title: "Remember the 250", description: "Every customer knows 250 people. Treat each session like a real opportunity!", category: "buildingTrust" },
          ],
        });
      }
    } catch (error) {
      console.error("Error generating tips:", error);
      res.json({
        tips: [
          { title: "Stay Consistent", description: "Train daily to see the best results!", category: "consistency" },
        ],
      });
    }
  });

  // Follow-up idea generator
  app.post("/api/crm/follow-up-idea", async (req: Request, res: Response) => {
    try {
      const { clientName, personalNote } = req.body;

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: `You are Joe Girard's AI assistant. Based on a client's personal notes, suggest ONE specific, actionable follow-up idea to strengthen the relationship. Keep it under 20 words. Be creative and personal.`,
          },
          {
            role: "user",
            content: `Client: ${clientName}\nNotes: ${personalNote}`,
          },
        ],
        max_completion_tokens: 50,
      });

      const idea = response.choices[0]?.message?.content || "Send a handwritten thank-you card this week!";

      res.json({ idea });
    } catch (error) {
      console.error("Error generating follow-up idea:", error);
      res.json({ idea: "Schedule a check-in call this week!" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
