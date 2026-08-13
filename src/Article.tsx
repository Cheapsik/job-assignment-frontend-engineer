import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getArticle } from "./api/articles";
import { Article, Profile } from "./api/types";
import AuthorImage from "./components/AuthorImage";
import FavoriteButton from "./components/FavoriteButton";
import FollowButton from "./components/FollowButton";
import Layout from "./components/Layout";
import { PLACEHOLDER_IMAGE } from "./constants";
import { formatArticleDate } from "./utils/date";
import { markdownToHtml } from "./utils/markdown";

type ArticleParams = {
  slug: string;
};

export default function ArticlePage(): JSX.Element {
  const { slug } = useParams<ArticleParams>();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setArticle(null);
    setError(null);

    getArticle(slug)
      .then(response => {
        if (!cancelled) {
          setArticle(response.article);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load this article.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  function handleArticleChange(updated: Article): void {
    setArticle(updated);
  }

  function handleProfileChange(updated: Profile): void {
    setArticle(current => (current ? { ...current, author: updated } : current));
  }

  return (
    <Layout>
      <div className="article-page">
        {!article && !error && (
          <div className="banner">
            <div className="container">
              <h1>Loading...</h1>
            </div>
          </div>
        )}
        {error && (
          <div className="banner">
            <div className="container">
              <h1>{error}</h1>
            </div>
          </div>
        )}
        {article && (
          <>
            <div className="banner">
              <div className="container">
                <h1>{article.title}</h1>
                <ArticleMeta
                  article={article}
                  onArticleChange={handleArticleChange}
                  onProfileChange={handleProfileChange}
                />
              </div>
            </div>

            <div className="container page">
              <div className="row article-content">
                <div className="col-md-12" dangerouslySetInnerHTML={{ __html: markdownToHtml(article.body) }} />
              </div>

              <hr />

              <div className="article-actions">
                <ArticleMeta
                  article={article}
                  onArticleChange={handleArticleChange}
                  onProfileChange={handleProfileChange}
                />
              </div>

              {/* TODO: Comment section is out of assignment scope */}
              <div className="row">
                <div className="col-xs-12 col-md-8 offset-md-2">
                  <form
                    className="card comment-form"
                    onSubmit={event => {
                      event.preventDefault();
                    }}
                  >
                    <div className="card-block">
                      <textarea className="form-control" placeholder="Write a comment..." rows={3} readOnly />
                    </div>
                    <div className="card-footer">
                      <AuthorImage
                        src={article.author.image}
                        alt={article.author.username}
                        className="comment-author-img"
                      />
                      <button className="btn btn-sm btn-primary" type="submit" disabled>
                        Post Comment
                      </button>
                    </div>
                  </form>

                  <div className="card">
                    <div className="card-block">
                      <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    </div>
                    <div className="card-footer">
                      <a href="/#/profile/jacobschmidt" className="comment-author">
                        <img src={PLACEHOLDER_IMAGE} className="comment-author-img" alt="Jacob Schmidt" />
                      </a>
                      &nbsp;
                      <a href="/#/profile/jacobschmidt" className="comment-author">
                        Jacob Schmidt
                      </a>
                      <span className="date-posted">Dec 29th</span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-block">
                      <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    </div>
                    <div className="card-footer">
                      <a href="/#/profile/jacobschmidt" className="comment-author">
                        <img src={PLACEHOLDER_IMAGE} className="comment-author-img" alt="Jacob Schmidt" />
                      </a>
                      &nbsp;
                      <a href="/#/profile/jacobschmidt" className="comment-author">
                        Jacob Schmidt
                      </a>
                      <span className="date-posted">Dec 29th</span>
                      <span className="mod-options">
                        <i className="ion-edit" />
                        <i className="ion-trash-a" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

type ArticleMetaProps = {
  article: Article;
  onArticleChange: (article: Article) => void;
  onProfileChange: (profile: Profile) => void;
};

function ArticleMeta({ article, onArticleChange, onProfileChange }: ArticleMetaProps): JSX.Element {
  return (
    <div className="article-meta">
      <Link to={`/profile/${article.author.username}`}>
        <AuthorImage src={article.author.image} alt={article.author.username} />
      </Link>
      <div className="info">
        <Link to={`/profile/${article.author.username}`} className="author">
          {article.author.username}
        </Link>
        <span className="date">{formatArticleDate(article.createdAt)}</span>
      </div>
      <FollowButton profile={article.author} onChange={onProfileChange} />
      &nbsp;&nbsp;
      <FavoriteButton article={article} onChange={onArticleChange} />
    </div>
  );
}
