export class ApiError extends Error {
  constructor(message, { status = 0, code = "UNKNOWN_ERROR", fields = {} } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export const apiRequest = async (path, options = {}) => {
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let response;

  try {
    response = await fetch(path, {
      ...options,
      headers,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw error;
    }

    throw new ApiError("The service is temporarily unavailable. Please try again.", {
      code: "NETWORK_ERROR",
    });
  }

  const contentType = response.headers.get("content-type") || "";
  let payload = null;

  if (/json\b/i.test(contentType)) {
    try {
      payload = await response.json();
    } catch {
      throw new ApiError("The API returned an invalid JSON response.", {
        status: response.status,
        code: "INVALID_RESPONSE",
      });
    }
  }

  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message || "The request could not be completed.",
      {
        status: response.status,
        code: payload?.error?.code,
        fields: payload?.error?.fields,
      }
    );
  }

  if (!payload) {
    throw new ApiError("The API returned an unexpected response.", {
      status: response.status,
      code: "INVALID_RESPONSE",
    });
  }

  return payload;
};
