import { RegularInput } from "@/components/UI/atoms/input/regular-input";
import { Label } from "@/components/UI/atoms/label";

const SocialUrlInput = ({ handleSocialsInput, socialUrls }) => {
  return (
    <>
      <Label htmlFor={"website_url"} className={"mt-10 mb-2"}>
        Social Profiles
      </Label>

      <RegularInput
        inputProps={{
          id: `website`,
          placeholder: "https://www.example.com",
          value: socialUrls?.website,
          onChange: (e) => handleSocialsInput(e),
        }}
      />
      <p className="text-sm text-9B9B9B mt-2 mb-2 pl-2">
        Enter a link to your website.
      </p>
      <RegularInput
        inputProps={{
          id: `documentation`,
          placeholder: "https://www.example.com",
          value: socialUrls?.documentation,
          onChange: (e) => handleSocialsInput(e),
        }}
      />
      <p className="text-sm text-9B9B9B mt-2 mb-2 pl-2">
        Enter a link to your documentation.
      </p>
      <RegularInput
        inputProps={{
          id: `telegram`,
          placeholder: "https://telegram.com/example",
          value: socialUrls?.telegram,
          onChange: (e) => handleSocialsInput(e),
        }}
      />
      <p className="text-sm text-9B9B9B mt-2 mb-2 pl-2">
        Enter a link to your telegram.
      </p>
      <RegularInput
        inputProps={{
          id: `twitter`,
          placeholder: "https://www.twitter.com/example",
          value: socialUrls?.twitter,
          onChange: (e) => handleSocialsInput(e),
        }}
      />
      <p className="text-sm text-9B9B9B mt-2 mb-2 pl-2">
        Enter a link to your twitter.
      </p>
      <RegularInput
        inputProps={{
          id: `github`,
          placeholder: "https://",
          value: socialUrls?.github,
          onChange: (e) => handleSocialsInput(e),
        }}
      />
      <p className="text-sm text-9B9B9B mt-2 mb-2 pl-2">
        Enter a link to your github.
      </p>
      <RegularInput
        inputProps={{
          id: `facebook`,
          placeholder: "https://www.facebook.com",
          value: socialUrls?.facebook,
          onChange: (e) => handleSocialsInput(e),
        }}
      />
      <p className="text-sm text-9B9B9B mt-2 mb-2 pl-2">
        Enter a link to your facebook.
      </p>
      <RegularInput
        inputProps={{
          id: `blog`,
          placeholder: "https://www.example.com",
          value: socialUrls?.blog,
          onChange: (e) => handleSocialsInput(e),
        }}
      />
      <p className="text-sm text-9B9B9B mt-2 mb-2 pl-2">
        Enter a link to your blog.
      </p>
      <RegularInput
        inputProps={{
          id: `discord`,
          placeholder: "https://",
          value: socialUrls?.discord,
          onChange: (e) => handleSocialsInput(e),
        }}
      />
      <p className="text-sm text-9B9B9B mt-2 mb-2 pl-2">
        Enter a link to your discord.
      </p>
      <RegularInput
        inputProps={{
          id: `linkedin`,
          placeholder: "https://www.example.com",
          value: socialUrls?.linkedin,
          onChange: (e) => handleSocialsInput(e),
        }}
      />
      <p className="text-sm text-9B9B9B mt-2 mb-2 pl-2">
        Enter a link to your LinkedIn.
      </p>
      <RegularInput
        inputProps={{
          id: `slack`,
          placeholder: "https://www.example.com",
          value: socialUrls?.slack,
          onChange: (e) => handleSocialsInput(e),
        }}
      />
      <p className="text-sm text-9B9B9B mt-2 mb-2 pl-2">
        Enter a link to your Slack.
      </p>
    </>
  );
};

export default SocialUrlInput;
