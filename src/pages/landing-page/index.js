export { default } from "@/modules/landing-page";

export const getStaticProps = () => {
  return {
    props: {
      noWrappers: true,
    },
  };
};
