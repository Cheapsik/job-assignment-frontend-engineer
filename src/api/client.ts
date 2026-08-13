const API_URL = process.env.REACT_APP_API_URL

type TokenGetter = () => string | null;

let authTokenGetter: TokenGetter = () => null;

export function setAuthTokenGetter(getter: TokenGetter): void {
  authTokenGetter = getter;
}

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(status: number, errors: Record<string, string[]>) {
    super("API request failed");
    this.status = status;
    this.errors = errors;
  }

  messages(): string[] {
    return Object.entries(this.errors).flatMap(([field, messages]) =>
      messages.map(message => (field === "body" ? message : `${field} ${message}`))
    );
  }
}

function isErrorBody(data: unknown): data is { errors: Record<string, string[]> } {
  if (typeof data !== "object" || data === null || !("errors" in data)) {
    return false;
  }
  const { errors } = data as { errors: unknown };
  return typeof errors === "object" && errors !== null;
}

function readErrorPayload(data: unknown): Record<string, string[]> {
  if (isErrorBody(data)) {
    return data.errors;
  }
  return { body: ["Request failed"] };
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = authTokenGetter();
  if (token) {
    headers.set("Authorization", `Token ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let data: unknown = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new ApiError(response.status, readErrorPayload(data));
  }

  return data as T;
}
