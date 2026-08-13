import { useState } from "react";
import { useHistory } from "react-router-dom";

import { favoriteArticle, unfavoriteArticle } from "../api/articles";
import { Article } from "../api/types";
import { useAuth } from "../auth/AuthContext";

type FavoriteButtonProps = {
  article: Article;
  onChange: (article: Article) => void;
  preview?: boolean;
};

export default function FavoriteButton({ article, onChange, preview = false }: FavoriteButtonProps): JSX.Element {
  const { user, loading } = useAuth();
  const history = useHistory();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick(): Promise<void> {
    if (loading) {
      return;
    }
    if (!user) {
      history.push("/login");
      return;
    }

    setPending(true);
    setError(null);
    try {
      const response = article.favorited ? await unfavoriteArticle(article.slug) : await favoriteArticle(article.slug);
      onChange(response.article);
    } catch {
      setError("Could not update favorite. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const className = [
    "btn",
    "btn-sm",
    article.favorited ? "btn-primary" : "btn-outline-primary",
    preview ? "pull-xs-right" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <button className={className} type="button" onClick={handleClick} disabled={pending || loading}>
        <i className="ion-heart" />
        {preview ? (
          <> {article.favoritesCount}</>
        ) : (
          <>
            &nbsp; {article.favorited ? "Unfavorite" : "Favorite"} Post{" "}
            <span className="counter">({article.favoritesCount})</span>
          </>
        )}
      </button>
      {error && (
        <ul className="error-messages">
          <li>{error}</li>
        </ul>
      )}
    </>
  );
}
