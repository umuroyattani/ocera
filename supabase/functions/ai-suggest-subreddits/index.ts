import { corsHeaders } from "@shared/cors.ts";

// Configuration constants
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1000;
const REQUEST_TIMEOUT_MS = 45000;
const MAX_CONTENT_LENGTH = 8000;
const MIN_SUGGESTIONS = 3;
const MAX_SUGGESTIONS = 10;

// Environment variable validation with fallback
function validateEnvironment(): {
  googleApiKey: string;
} {
  // Try multiple possible API key sources
  const googleApiKey =
    Deno.env.get("GOOGLE_AI_API_KEY") ||
    Deno.env.get("GOOGLE_API_KEY") ||
    "AIzaSyAktTRGHEmzYHT7fTUVWnwlMf-qDCBUa6o";

  if (!googleApiKey || googleApiKey.length < 20) {
    console.error("Invalid or missing Google AI Studio API key");
    throw new Error("Missing or invalid Google AI Studio API key");
  }

  console.log("API Key validation successful, length:", googleApiKey.length);
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

// API call function with enhanced error handling
async function callGoogleAIAPI(
  content: string,
  category: string,
  googleApiKey: string,
): Promise<any> {
  // Validate inputs
  if (!content || content.length < 10) {
    throw new Error("Content too short for analysis");
  }

  if (!googleApiKey || googleApiKey.length < 20) {
    throw new Error("Invalid API key format");
  }

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
      maxOutputTokens: 2000,
      topP: 0.8,
      topK: 40,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  };

  const endpoint =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  console.log("Making API request:", {
    endpoint,
    contentLength: content.length,
    category,
    payloadSize: JSON.stringify(requestPayload).length,
    timestamp: new Date().toISOString(),
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log("Request timeout triggered after", REQUEST_TIMEOUT_MS, "ms");
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${endpoint}?key=${googleApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Supabase-Edge-Function/1.0",
      },
      body: JSON.stringify(requestPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("API response received:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      let errorText = "";
      let errorData: any = null;

      try {
        errorText = await response.text();
        try {
          errorData = JSON.parse(errorText);
        } catch {
          // errorText is not JSON, keep as string
        }
      } catch (e) {
        errorText = "Could not read error response";
      }

      console.error("API error details:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText,
        parsedError: errorData,
        url: response.url,
      });

      // Handle specific error cases
      let errorMessage = `API error: ${response.status} - ${response.statusText}`;

      if (response.status === 400) {
        errorMessage =
          "Invalid request format or content blocked by safety filters";
      } else if (response.status === 401) {
        errorMessage = "Invalid API key or authentication failed";
      } else if (response.status === 403) {
        errorMessage = "API access forbidden - check API key permissions";
      } else if (response.status === 429) {
        errorMessage = "Rate limit exceeded - please try again later";
      } else if (response.status >= 500) {
        errorMessage = "Google AI service temporarily unavailable";
      }

      if (errorData?.error?.message) {
        errorMessage += `: ${errorData.error.message}`;
      }

      const error = new Error(errorMessage);
      (error as any).status = response.status;
      (error as any).details = errorData;
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

// Response processing function with enhanced validation
function processAPIResponse(data: any, category: string) {
  console.log("Processing API response:", {
    hasCandidates: !!data.candidates,
    candidatesCount: data.candidates?.length || 0,
    firstCandidateFinishReason: data.candidates?.[0]?.finishReason,
    hasContent: !!data.candidates?.[0]?.content,
    safetyRatings: data.candidates?.[0]?.safetyRatings,
  });

  // Check for safety issues
  if (data.candidates?.[0]?.finishReason === "SAFETY") {
    console.warn(
      "Content was blocked by safety filters, using fallback suggestions",
    );
    return {
      suggestions: getFallbackSuggestions(category),
      category,
      timestamp: new Date().toISOString(),
      count: getFallbackSuggestions(category).length,
      fallback: true,
      reason: "Content blocked by safety filters",
    };
  }

  const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!aiContent) {
    console.error("No content in API response:", {
      fullResponse: JSON.stringify(data, null, 2),
    });

    // Use fallback suggestions
    const fallbackSuggestions = getFallbackSuggestions(category);
    return {
      suggestions: fallbackSuggestions,
      category,
      timestamp: new Date().toISOString(),
      count: fallbackSuggestions.length,
      fallback: true,
      reason: "No AI content received",
    };
  }

  let suggestions = [];

  try {
    // Try to parse as JSON first
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
      throw new Error("Invalid response format - not an array");
    }
  } catch (parseError) {
    console.error(
      "Failed to parse AI suggestions, using fallback:",
      parseError,
      "Raw content:",
      aiContent.substring(0, 500),
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

  // Validate each suggestion
  suggestions = suggestions.filter((s) => s.name && s.name.length > 0);

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
