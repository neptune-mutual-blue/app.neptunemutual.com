export const CoverHeroTitleAndWebsite = ({ title, links }) => {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-h2 font-sora font-bold">{title}</h1>
        <div className="ml-4 rounded-full w-4 h-4 bg-21AD8C"></div>
      </div>
      <p>
        <a
          href={links.website}
          className="text-4E7DD9 underline hover:no-underline"
        >
          {links.website.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "")}
        </a>
      </p>
    </>
  );
};
