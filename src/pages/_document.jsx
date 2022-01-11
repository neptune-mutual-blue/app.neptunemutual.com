import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head></Head>
        <body className="font-poppins text-black text-para bg-f1f3f6">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
