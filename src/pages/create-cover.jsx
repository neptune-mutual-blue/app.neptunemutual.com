import Head from "next/head";
import CreateNewCoverPage from "../modules/cover/create/CreateNewCoverPage";

export default function CreateCover() {
  return (
    <>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name="description"
          content="Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment."
        />
      </Head>
      <CreateNewCoverPage />
    </>
  );
}
