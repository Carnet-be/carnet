import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";
import Cookies from "js-cookie";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const locale = ctx?.query?.locale || "fr";
    const cookies = ctx.req?.headers?.cookie;
    if (cookies) {
      const langCookie = cookies
        .split(";")
        .find((c) => c.trim().startsWith("lang="));
      if (langCookie) {
        const lang = langCookie.split("=")[1];
        if (lang !== locale) {
          Cookies.set("lang", locale as string, { expires: 365 });
        }
      } else {
        Cookies.set("lang", locale as string, { expires: 365 });
      }
    } else {
      Cookies.set("lang", locale as string, { expires: 365 });
    }
    return { ...initialProps, locale };
  }

  render() {
    return (
      <Html lang={this.props.locale}>
        <Head></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
