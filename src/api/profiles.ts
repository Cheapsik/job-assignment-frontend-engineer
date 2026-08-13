import { request } from "./client";
import { ProfileResponse } from "./types";

export function getProfile(username: string): Promise<ProfileResponse> {
  return request(`/profiles/${encodeURIComponent(username)}`);
}

export function followUser(username: string): Promise<ProfileResponse> {
  return request(`/profiles/${encodeURIComponent(username)}/follow`, { method: "POST" });
}

export function unfollowUser(username: string): Promise<ProfileResponse> {
  return request(`/profiles/${encodeURIComponent(username)}/follow`, { method: "DELETE" });
}
