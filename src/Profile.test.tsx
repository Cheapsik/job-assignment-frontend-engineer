import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route } from "react-router-dom";

import { getArticles } from "./api/articles";
import { getCurrentUser } from "./api/auth";
import { followUser, getProfile } from "./api/profiles";
import { Article, Profile, User } from "./api/types";
import { AuthProvider } from "./auth/AuthContext";
import ProfilePage from "./Profile";

jest.mock("./api/articles");
jest.mock("./api/profiles");
jest.mock("./api/auth");

const getArticlesMock = getArticles as jest.MockedFunction<typeof getArticles>;
const getProfileMock = getProfile as jest.MockedFunction<typeof getProfile>;
const followUserMock = followUser as jest.MockedFunction<typeof followUser>;
const getCurrentUserMock = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>;

const aliceProfile: Profile = {
  username: "alice",
  bio: "I am Alice",
  image: "https://example.com/alice.jpg",
  following: false,
};

const aliceArticle: Article = {
  slug: "alice-first-post",
  title: "Alice first post",
  description: "A short description",
  body: "Full body",
  tagList: [],
  createdAt: "2020-01-20T12:00:00.000Z",
  updatedAt: "2020-01-20T12:00:00.000Z",
  favorited: false,
  favoritesCount: 3,
  author: aliceProfile,
};

const bob: User = {
  email: "bob@example.com",
  token: "bob-token",
  username: "bob",
  bio: "I am Bob",
  image: "",
};

function renderProfile(username = "alice"): void {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[`/profile/${username}`]}>
        <Route path="/profile/:username" component={ProfilePage} />
      </MemoryRouter>
    </AuthProvider>
  );
}

describe("Profile page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  it("loads the author profile and their articles from the API", async () => {
    getProfileMock.mockResolvedValue({ profile: aliceProfile });
    getArticlesMock.mockResolvedValue({ articles: [aliceArticle], articlesCount: 1 });

    renderProfile();

    expect(await screen.findByRole("heading", { name: "alice", level: 4 })).toBeInTheDocument();
    expect(screen.getByText("I am Alice")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Alice first post", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("A short description")).toBeInTheDocument();

    await waitFor(() => {
      expect(getProfileMock).toHaveBeenCalledWith("alice");
      expect(getArticlesMock).toHaveBeenCalledWith({ author: "alice" });
    });
  });

  it("shows an error when the profile request fails", async () => {
    getProfileMock.mockRejectedValue(new Error("network"));
    getArticlesMock.mockResolvedValue({ articles: [], articlesCount: 0 });

    renderProfile();

    expect(await screen.findByRole("heading", { name: "Could not load this profile." })).toBeInTheDocument();
    expect(screen.queryByText("I am Alice")).not.toBeInTheDocument();
  });

  it("still shows the profile when only the articles request fails", async () => {
    getProfileMock.mockResolvedValue({ profile: aliceProfile });
    getArticlesMock.mockRejectedValue(new Error("network"));

    renderProfile();

    expect(await screen.findByRole("heading", { name: "alice", level: 4 })).toBeInTheDocument();
    expect(screen.getByText("I am Alice")).toBeInTheDocument();
    expect(await screen.findByText("Could not load articles.")).toBeInTheDocument();
  });

  it("lets a logged-in user follow the profile author", async () => {
    window.localStorage.setItem("jwt", bob.token);
    getCurrentUserMock.mockResolvedValue({ user: bob });
    getProfileMock.mockResolvedValue({ profile: aliceProfile });
    getArticlesMock.mockResolvedValue({ articles: [], articlesCount: 0 });
    followUserMock.mockResolvedValue({
      profile: { ...aliceProfile, following: true },
    });

    renderProfile();

    const followButton = await screen.findByRole("button", { name: /Follow alice/i });
    userEvent.click(followButton);

    await waitFor(() => {
      expect(followUserMock).toHaveBeenCalledWith("alice");
    });
    expect(await screen.findByRole("button", { name: /Unfollow alice/i })).toBeInTheDocument();
  });
});
