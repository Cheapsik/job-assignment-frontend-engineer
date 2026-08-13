import { Link } from "react-router-dom";

import { Article } from "../api/types";
import { formatArticleDate } from "../utils/date";
import AuthorImage from "./AuthorImage";
import FavoriteButton from "./FavoriteButton";

type ArticlePreviewProps = {
  article: Article;
  onChange: (article: Article) => void;
};

export default function ArticlePreview({ article, onChange }: ArticlePreviewProps): JSX.Element {
  return (
    <div className="article-preview">
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
        <FavoriteButton article={article} onChange={onChange} preview />
      </div>
      <Link to={`/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
      </Link>
    </div>
  );
}
