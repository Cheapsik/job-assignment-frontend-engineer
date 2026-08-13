import { useState } from "react";
import { useHistory } from "react-router-dom";

import { followUser, unfollowUser } from "../api/profiles";
import { Profile } from "../api/types";
import { useAuth } from "../auth/AuthContext";

type FollowButtonProps = {
  profile: Profile;
  onChange: (profile: Profile) => void;
  className?: string;
};

export default function FollowButton({
  profile,
  onChange,
  className: extraClassName,
}: FollowButtonProps): JSX.Element | null {
  const { user, loading } = useAuth();
  const history = useHistory();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wait for session restore so we do not flash Follow on the current user's profile.
  if (loading || user?.username === profile.username) {
    return null;
  }

  async function handleClick(): Promise<void> {
    if (!user) {
      history.push("/login");
      return;
    }

    setPending(true);
    setError(null);
    try {
      const response = profile.following ? await unfollowUser(profile.username) : await followUser(profile.username);
      onChange(response.profile);
    } catch {
      setError("Could not update follow. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const className = ["btn", "btn-sm", profile.following ? "btn-secondary" : "btn-outline-secondary", extraClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <button className={className} type="button" onClick={handleClick} disabled={pending}>
        <i className={profile.following ? "ion-minus-round" : "ion-plus-round"} />
        &nbsp; {profile.following ? "Unfollow" : "Follow"} {profile.username}
        {/* TODO: README asks for followers count, but Conduit Profile in swagger.json has no
            followersCount field — cannot display a real count without inventing data. */}
      </button>
      {error && (
        <ul className="error-messages">
          <li>{error}</li>
        </ul>
      )}
    </>
  );
}
