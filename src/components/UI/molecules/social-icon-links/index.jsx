import FacebookIcon from "@/icons/facebook";
import LinkedinIcon from "@/icons/linkedin";
import TwitterIcon from "@/icons/twitter";

export const SocialIconLinks = ({ links }) => {
  return (
    <div className="mt-5">
      {links.facebook && (
        <a
          href={links.facebook}
          className="inline-block mr-4 hover:text-4e7dd9"
          target="_blank"
          rel="noreferrer"
        >
          <span className="sr-only">Facebook</span>
          <FacebookIcon width={24} />
        </a>
      )}

      {links.linkedin && (
        <a
          href={links.linkedin}
          className="inline-block mr-4 hover:text-4e7dd9"
          target="_blank"
          rel="noreferrer"
        >
          <span className="sr-only">LinkedIn</span>
          <LinkedinIcon width={24} />
        </a>
      )}

      {links.twitter && (
        <a
          href={links.twitter}
          className="inline-block mr-4 hover:text-4e7dd9"
          target="_blank"
          rel="noreferrer"
        >
          <span className="sr-only">Twitter</span>
          <TwitterIcon width={24} />
        </a>
      )}
    </div>
  );
};
