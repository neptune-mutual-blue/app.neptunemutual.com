import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head></Head>
        <body className="font-poppins text-black text-para bg-F1F3F6">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
