export const ProjectWebsiteLink = ({ website }) => {
  const text = website.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "");

  return (
    <p>
      <a
        href={website}
        target="_blank"
        rel="noreferrer noopener"
        className="text-4e7dd9 underline hover:no-underline"
      >
        {text}
      </a>
    </p>
  );
};
