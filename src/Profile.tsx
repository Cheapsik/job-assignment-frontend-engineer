import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getArticles } from "./api/articles";
import { getProfile } from "./api/profiles";
import { Article, Profile } from "./api/types";
import ArticlePreview from "./components/ArticlePreview";
import AuthorImage from "./components/AuthorImage";
import FollowButton from "./components/FollowButton";
import Layout from "./components/Layout";

type ProfileParams = {
  username: string;
};

export default function ProfilePage(): JSX.Element {
  const { username } = useParams<ProfileParams>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [articlesError, setArticlesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setProfile(null);
    setArticles([]);
    setError(null);
    setArticlesError(null);

    getProfile(username)
      .then(profileResponse => {
        if (!cancelled) {
          setProfile(profileResponse.profile);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load this profile.");
        }
      });

    getArticles({ author: username })
      .then(articlesResponse => {
        if (!cancelled) {
          setArticles(articlesResponse.articles);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setArticlesError("Could not load articles.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  function handleArticleChange(updated: Article): void {
    setArticles(current => current.map(article => (article.slug === updated.slug ? updated : article)));
  }

  return (
    <Layout>
      <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                {error && <h4>{error}</h4>}
                {profile && (
                  <>
                    <AuthorImage src={profile.image} alt={profile.username} className="user-img" />
                    <h4>{profile.username}</h4>
                    <p>{profile.bio}</p>
                    <FollowButton profile={profile} onChange={setProfile} className="action-btn" />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <a className="nav-link active" href={`#/profile/${username}`}>
                      My Articles
                    </a>
                  </li>
                  <li className="nav-item">
                    {/* TODO: Favorited Articles tab is out of assignment scope */}
                    <a className="nav-link disabled" href={`#/profile/${username}`}>
                      Favorited Articles
                    </a>
                  </li>
                </ul>
              </div>

              {articlesError && <div className="article-preview">{articlesError}</div>}
              {articles.length === 0 && !articlesError && !error && profile && (
                <div className="article-preview">No articles are here...</div>
              )}
              {articles.map(article => (
                <ArticlePreview key={article.slug} article={article} onChange={handleArticleChange} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
