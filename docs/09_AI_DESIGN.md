# AI Design

*(To be updated in Phases 9-10)*

## AI Provider: Groq
**1. Explain WHAT was chosen:** Groq LLM API.
**2. Explain WHY it was chosen:** It is free, extremely fast (LPU architecture), and highly capable of structured JSON output.
**3. Explain the PROBLEM it solves:** We need an LLM to generate test cases and analyze stack traces without incurring high API costs.
**4. Explain what alternatives were considered:** OpenAI GPT-4o, Google Gemini.
**5. Explain WHY those alternatives were not selected:** Groq was selected purely based on the developer's preference for a free, fast API tier during this portfolio project's development. 
**6. Explain the trade-offs:** Groq's models (like Llama 3) might sometimes hallucinate differently than GPT-4, but structured output constraints usually mitigate this.
