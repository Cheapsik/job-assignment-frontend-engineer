import { useEffect, useState } from "react";

import { getArticles } from "./api/articles";
import { Article } from "./api/types";
import ArticlePreview from "./components/ArticlePreview";
import Layout from "./components/Layout";

const POPULAR_TAGS = ["programming", "javascript", "emberjs", "angularjs", "react", "mean", "node", "rails"];

export default function ArticleList(): JSX.Element {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getArticles()
      .then(response => {
        if (!cancelled) {
          setArticles(response.articles);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load articles.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleArticleChange(updated: Article): void {
    setArticles(current => current.map(article => (article.slug === updated.slug ? updated : article)));
  }

  return (
    <Layout>
      <div className="home-page">
        <div className="banner">
          <div className="container">
            <h1 className="logo-font">conduit</h1>
            <p>A place to share your knowledge.</p>
          </div>
        </div>

        <div className="container page">
          <div className="row">
            <div className="col-md-9">
              <div className="feed-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    {/* TODO: Your Feed (/articles/feed) is out of assignment scop. */}
                    <a className="nav-link disabled" href="#/">
                      Your Feed
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link active" href="#/">
                      Global Feed
                    </a>
                  </li>
                </ul>
              </div>

              {loading && <div className="article-preview">Loading articles...</div>}
              {error && <div className="article-preview">{error}</div>}
              {!loading && !error && articles.length === 0 && (
                <div className="article-preview">No articles are here...</div>
              )}
              {articles.map(article => (
                <ArticlePreview key={article.slug} article={article} onChange={handleArticleChange} />
              ))}
            </div>

            <div className="col-md-3">
              <div className="sidebar">
                <p>Popular Tags</p>
                <div className="tag-list">
                  {POPULAR_TAGS.map(tag => (
                    <span key={tag} className="tag-pill tag-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
