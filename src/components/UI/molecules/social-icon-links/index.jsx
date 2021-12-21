import FacebookIcon from "@/icons/facebook";
import LinkedinIcon from "@/icons/linkedin";
import TwitterIcon from "@/icons/twitter";

export const SocialIconLinks = ({ links }) => {
  return (
    <div className="mt-5">
      {links.facebook && (
        <a
          href={links.facebook}
          className="inline-block mr-4 hover:text-4E7DD9"
          target="_blank"
          rel="noreferrer"
        >
          <FacebookIcon />
        </a>
      )}

      {links.linkedin && (
        <a
          href={links.linkedin}
          className="inline-block mr-4 hover:text-4E7DD9"
          target="_blank"
          rel="noreferrer"
        >
          <LinkedinIcon />
        </a>
      )}

      {links.twitter && (
        <a
          href={links.twitter}
          className="inline-block mr-4 hover:text-4E7DD9"
          target="_blank"
          rel="noreferrer"
        >
          <TwitterIcon />
        </a>
      )}
    </div>
  );
};
