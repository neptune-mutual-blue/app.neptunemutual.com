export const ProjectWebsiteLink = ({ website = "" }) => {
  const text = website.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "");

  return (
    <p>
      <a
        href={website}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className="underline text-4e7dd9 hover:no-underline"
      >
        {text}
      </a>
    </p>
  );
};
