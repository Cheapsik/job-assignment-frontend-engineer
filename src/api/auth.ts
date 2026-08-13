import { request } from "./client";
import { UserResponse } from "./types";

export function login(email: string, password: string): Promise<UserResponse> {
  return request("/users/login", {
    method: "POST",
    body: JSON.stringify({ user: { email, password } }),
  });
}

export function getCurrentUser(): Promise<UserResponse> {
  return request("/user");
}
