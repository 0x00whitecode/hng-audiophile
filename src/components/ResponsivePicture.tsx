type SrcSet = {
  desktop: string;
  tablet: string;
  mobile: string;
};

export default function ResponsivePicture({
  src,
  alt,
  className,
  priority = false,
}: {
  src: SrcSet;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <picture className={className}>
      <source media="(min-width: 1024px)" srcSet={src.desktop} />
      <source media="(min-width: 640px)" srcSet={src.tablet} />
      <img
        src={src.mobile}
        alt={alt}
        className="w-full h-full object-cover"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "low"}
      />
    </picture>
  );
}