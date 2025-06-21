import { corsHeaders } from "@shared/cors.ts";

// Configuration constants
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 500;
const REQUEST_TIMEOUT_MS = 30000;
const MAX_CONTENT_LENGTH = 10000;

// Environment variable validation
function validateEnvironment(): {
  googleApiKey: string;
} {
  const googleApiKey = "AIzaSyAktTRGHEmzYHT7fTUVWnwlMf-qDCBUa6o";

  if (!googleApiKey) {
    throw new Error("Missing Google AI Studio API key");
  }

  return { googleApiKey };
}

// Input validation
function validateInput(body: any): {
  content: string;
  subreddit: string;
  tone: string;
} {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a valid JSON object");
  }

  const { content, subreddit, tone } = body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new Error("Content is required and must be a non-empty string");
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    throw new Error(
      `Content exceeds maximum length of ${MAX_CONTENT_LENGTH} characters`,
    );
  }

  return {
    content: content.trim(),
    subreddit:
      subreddit && typeof subreddit === "string" ? subreddit.trim() : "general",
    tone: tone && typeof tone === "string" ? tone.trim() : "professional",
  };
}

// Delay utility
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  baseDelay: number = RETRY_BASE_DELAY_MS,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}`);
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt} failed:`, {
        error: lastError.message,
        stack: lastError.stack,
      });

      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (error instanceof Response) {
        if (error.status >= 400 && error.status < 500 && error.status !== 429) {
          console.log("Client error detected, not retrying");
          throw error;
        }
      }

      if (attempt === maxRetries) {
        console.error("Max retries reached, throwing last error");
        throw lastError;
      }

      const delayMs = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Waiting ${delayMs}ms before retry...`);
      await delay(delayMs);
    }
  }

  throw lastError!;
}

// API call function
async function callGoogleAIAPI(
  content: string,
  subreddit: string,
  tone: string,
  googleApiKey: string,
): Promise<any> {
  const prompt = `You are an AI assistant that optimizes Reddit posts for specific subreddits. Your task is to adapt the given content to match the tone, style, and rules of the target subreddit while maintaining the core message.

Guidelines:
- Adapt the tone to match the subreddit culture (${tone})
- Ensure compliance with common Reddit posting guidelines
- Keep the core message intact
- Make it engaging and authentic
- Use appropriate formatting for Reddit
- Provide optimization tips as a separate field

Respond with a JSON object containing:
{
  "optimizedContent": "the optimized content",
  "optimizedTitle": "an optimized title if applicable",
  "tips": ["array of optimization tips applied"]
}

Please optimize this content for r/${subreddit}:

${content}

Tone preference: ${tone}`;

  const requestPayload = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    },
  };

  console.log("Making API request:", {
    endpoint:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    contentLength: content.length,
    subreddit,
    tone,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${googleApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    console.log("API response received:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      let errorText = "";
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = "Could not read error response";
      }

      console.error("API error details:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      const error = new Error(
        `API error: ${response.status} - ${response.statusText}: ${errorText}`,
      );
      (error as any).status = response.status;
      throw error;
    }

    const data = await response.json();
    console.log("API response parsed successfully:", {
      hasCandidates: !!data.candidates,
      candidatesLength: data.candidates?.length || 0,
      hasContent: !!data.candidates?.[0]?.content,
      hasParts: !!data.candidates?.[0]?.content?.parts,
    });

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error(`Request timeout after ${REQUEST_TIMEOUT_MS}ms`);
    }
    throw error;
  }
}

// Response processing function
function processAPIResponse(
  data: any,
  content: string,
  subreddit: string,
  tone: string,
) {
  const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!aiContent) {
    console.error("No content in API response:", data);
    throw new Error("No content received from AI API");
  }

  let optimizedContent = aiContent;
  let optimizedTitle = "";
  let tips: string[] = [];

  try {
    const parsedResponse = JSON.parse(aiContent);
    if (parsedResponse.optimizedContent) {
      optimizedContent = parsedResponse.optimizedContent;
      optimizedTitle = parsedResponse.optimizedTitle || "";
      tips = Array.isArray(parsedResponse.tips) ? parsedResponse.tips : [];
    }
  } catch (e) {
    console.log("AI response is not JSON, using as plain text");
    tips = [
      "Content optimized for better engagement",
      "Tone adjusted for target audience",
      "Structure improved for readability",
    ];
  }

  return {
    optimizedContent,
    optimizedTitle,
    originalContent: content,
    subreddit,
    tone,
    tips,
    timestamp: new Date().toISOString(),
  };
}

// Error response helper
function createErrorResponse(error: Error, statusCode: number = 500): Response {
  const errorResponse = {
    error: "Failed to optimize content",
    details: error.message,
    timestamp: new Date().toISOString(),
    requestId: crypto.randomUUID(),
  };

  console.error("Returning error response:", errorResponse);

  return new Response(JSON.stringify(errorResponse), {
    status: statusCode,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Main handler
Deno.serve(async (req) => {
  console.log(`Request received: ${req.method} ${req.url}`);

  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  if (req.method !== "POST") {
    console.error(`Invalid method: ${req.method}`);
    return createErrorResponse(new Error("Method not allowed. Use POST."), 405);
  }

  try {
    // Validate environment
    console.log("Validating environment variables...");
    const { googleApiKey } = validateEnvironment();
    console.log("Environment validation successful");

    // Parse and validate input
    console.log("Parsing request body...");
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      return createErrorResponse(
        new Error("Invalid JSON in request body"),
        400,
      );
    }

    console.log("Validating input...");
    const { content, subreddit, tone } = validateInput(requestBody);
    console.log("Input validation successful:", {
      contentLength: content.length,
      subreddit,
      tone,
    });

    // Make API call with retry logic
    console.log("Making API call with retry logic...");
    const apiData = await retryWithBackoff(() =>
      callGoogleAIAPI(content, subreddit, tone, googleApiKey),
    );

    // Process response
    console.log("Processing API response...");
    const responseData = processAPIResponse(apiData, content, subreddit, tone);

    console.log("Request completed successfully:", {
      hasOptimizedContent: !!responseData.optimizedContent,
      optimizedContentLength: responseData.optimizedContent.length,
      tipsCount: responseData.tips.length,
    });

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Unhandled error in main handler:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    const statusCode = (error as any)?.status || 500;
    return createErrorResponse(error as Error, statusCode);
  }
});
