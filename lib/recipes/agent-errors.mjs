export class RecipeAgentError extends Error {}

export async function responseError(response) {
  const body = await response.json().catch(() => null);
  const code = body?.error?.code;
  let message = "The AI service could not complete this request. Please retry.";
  if (code === "insufficient_quota" || code === "billing_hard_limit_reached")
    message = "OpenAI API credits are unavailable or the spending limit has been reached. Check API billing before retrying.";
  else if (response.status === 401)
    message = "The OpenAI API key was rejected. Update the AI connection before retrying.";
  else if (response.status === 403 || code === "model_not_found")
    message = "The AI account cannot access the configured model or feature. Check its permissions.";
  else if (response.status === 429)
    message = "The AI service is temporarily rate limited. Wait a minute before retrying.";
  else if (response.status === 400)
    message = "The AI service rejected the recipe request settings. The AI connection needs a configuration update.";
  // Never return the provider's raw error message: it can contain credentials.
  return new RecipeAgentError(message);
}

export function failureMessage(error) {
  if (error instanceof RecipeAgentError) return error.message;
  if (error?.name === "TimeoutError" || error?.name === "AbortError")
    return "The AI request took too long. Please retry; your existing recipe was kept.";
  return "Import or matching failed. You can retry; no existing recipe data was replaced.";
}
