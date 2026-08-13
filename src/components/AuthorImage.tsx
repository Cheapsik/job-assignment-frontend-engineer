const PLACEHOLDER_IMAGE = "http://i.imgur.com/Qr71crq.jpg";

type AuthorImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
};

export default function AuthorImage({ src, alt, className }: AuthorImageProps): JSX.Element {
  return <img src={src || PLACEHOLDER_IMAGE} alt={alt} className={className} />;
}
