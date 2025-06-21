import { corsHeaders } from "@shared/cors.ts";

// Configuration constants
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 500;
const REQUEST_TIMEOUT_MS = 30000;
const MAX_CONTENT_LENGTH = 10000;
const MIN_SUGGESTIONS = 3;
const MAX_SUGGESTIONS = 10;

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
function validateInput(body: any): { content: string; category: string } {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a valid JSON object");
  }

  const { content, category } = body;

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
    category:
      category && typeof category === "string" ? category.trim() : "general",
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
  category: string,
  googleApiKey: string,
): Promise<any> {
  const prompt = `You are an AI assistant that suggests relevant subreddits for content posting. Analyze the given content and suggest ${MIN_SUGGESTIONS}-${MAX_SUGGESTIONS} appropriate subreddits where this content would be well-received.

Provide your response as a JSON array of objects with the following structure:
[
  {
    "name": "subreddit_name",
    "description": "Brief description of why this subreddit is suitable",
    "subscribers": "estimated subscriber count",
    "engagement": "high/medium/low"
  }
]

Focus on active, relevant communities that would genuinely benefit from this content. Ensure the response is valid JSON.

Please suggest relevant subreddits for this content:

Category: ${category}
Content: ${content}`;

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
      temperature: 0.3,
      maxOutputTokens: 1500,
    },
  };

  console.log("Making API request:", {
    endpoint:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    contentLength: content.length,
    category,
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

// Fallback suggestions by category
function getFallbackSuggestions(category: string): any[] {
  const categoryMap: Record<string, any[]> = {
    technology: [
      {
        name: "technology",
        description: "General technology discussions",
        subscribers: "8M+",
        engagement: "high",
      },
      {
        name: "programming",
        description: "Programming and development",
        subscribers: "4M+",
        engagement: "high",
      },
      {
        name: "webdev",
        description: "Web development community",
        subscribers: "800K+",
        engagement: "medium",
      },
    ],
    business: [
      {
        name: "entrepreneur",
        description: "Entrepreneurship discussions",
        subscribers: "1M+",
        engagement: "high",
      },
      {
        name: "business",
        description: "General business topics",
        subscribers: "2M+",
        engagement: "medium",
      },
      {
        name: "startups",
        description: "Startup community",
        subscribers: "1.5M+",
        engagement: "high",
      },
    ],
    gaming: [
      {
        name: "gaming",
        description: "General gaming community",
        subscribers: "30M+",
        engagement: "high",
      },
      {
        name: "pcgaming",
        description: "PC gaming discussions",
        subscribers: "2M+",
        engagement: "high",
      },
      {
        name: "gamedev",
        description: "Game development",
        subscribers: "200K+",
        engagement: "medium",
      },
    ],
  };

  const categoryKey = category.toLowerCase();
  return (
    categoryMap[categoryKey] || [
      {
        name: "general",
        description: "General discussion community",
        subscribers: "1M+",
        engagement: "medium",
      },
      {
        name: "discussion",
        description: "Open discussion forum",
        subscribers: "500K+",
        engagement: "medium",
      },
      {
        name: "askreddit",
        description: "Ask questions to the Reddit community",
        subscribers: "35M+",
        engagement: "high",
      },
    ]
  );
}

// Response processing function
function processAPIResponse(data: any, category: string) {
  const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!aiContent) {
    console.error("No content in API response:", data);
    throw new Error("No content received from AI API");
  }

  let suggestions = [];

  try {
    const parsedSuggestions = JSON.parse(aiContent);

    if (Array.isArray(parsedSuggestions)) {
      suggestions = parsedSuggestions.map((suggestion, index) => ({
        name: suggestion.name || `suggestion_${index}`,
        description: suggestion.description || "No description available",
        subscribers: suggestion.subscribers || "Unknown",
        engagement: suggestion.engagement || "medium",
      }));
    } else {
      console.warn("AI response is not an array, using fallback");
      throw new Error("Invalid response format");
    }
  } catch (parseError) {
    console.error(
      "Failed to parse AI suggestions, using fallback:",
      parseError,
    );
    suggestions = getFallbackSuggestions(category);
  }

  // Ensure we have at least minimum suggestions
  if (suggestions.length === 0) {
    console.warn("No suggestions found, using fallback");
    suggestions = getFallbackSuggestions(category);
  }

  // Limit to maximum suggestions
  if (suggestions.length > MAX_SUGGESTIONS) {
    suggestions = suggestions.slice(0, MAX_SUGGESTIONS);
  }

  return {
    suggestions,
    category,
    timestamp: new Date().toISOString(),
    count: suggestions.length,
  };
}

// Error response helper
function createErrorResponse(error: Error, statusCode: number = 500): Response {
  const errorResponse = {
    error: "Failed to suggest subreddits",
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
    const { content, category } = validateInput(requestBody);
    console.log("Input validation successful:", {
      contentLength: content.length,
      category,
    });

    // Make API call with retry logic
    console.log("Making API call with retry logic...");
    const apiData = await retryWithBackoff(() =>
      callGoogleAIAPI(content, category, googleApiKey),
    );

    // Process response
    console.log("Processing API response...");
    const responseData = processAPIResponse(apiData, category);

    console.log("Request completed successfully:", {
      suggestionsCount: responseData.suggestions.length,
      category: responseData.category,
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
