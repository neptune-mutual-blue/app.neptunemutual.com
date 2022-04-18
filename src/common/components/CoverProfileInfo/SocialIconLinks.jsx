import FacebookIcon from "@/icons/FacebookIcon";
import LinkedinIcon from "@/icons/LinkedinIcon";
import TwitterIcon from "@/icons/TwitterIcon";

const IconLink = ({ href, iconText, icon }) => {
  return (
    <a
      href={href}
      className="inline-block mr-4 hover:text-4e7dd9"
      target="_blank"
      rel="noreferrer nofollow"
    >
      <span className="sr-only">{iconText}</span>
      {icon}
    </a>
  );
};

export const SocialIconLinks = ({ links = {} }) => {
  const { facebook, linkedin, twitter } = links;

  return (
    <div className="mt-4 sm:mt-5">
      {facebook && (
        <IconLink
          href={facebook}
          iconText="Facebook"
          icon={<FacebookIcon width={24} />}
        />
      )}

      {linkedin && (
        <IconLink
          href={linkedin}
          iconText="LinkedIn"
          icon={<LinkedinIcon width={24} />}
        />
      )}

      {twitter && (
        <IconLink
          href={twitter}
          iconText="Twitter"
          icon={<TwitterIcon width={24} />}
        />
      )}
    </div>
  );
};
