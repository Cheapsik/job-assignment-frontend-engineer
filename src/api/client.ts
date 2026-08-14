const API_URL = process.env.REACT_APP_API_URL;

type TokenGetter = () => string | null;

type ErrorBody = {
  errors?: Record<string, string[]>;
};

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

function readErrorPayload(data: ErrorBody): Record<string, string[]> {
  return data.errors ?? { body: ["Request failed"] };
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

  let data: T & ErrorBody;
  try {
    data = await response.json();
  } catch (error) {
    throw new ApiError(response.status, { body: ["Request failed"] });
  }

  if (!response.ok) {
    throw new ApiError(response.status, readErrorPayload(data));
  }

  return data;
}
