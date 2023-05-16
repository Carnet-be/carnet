import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

interface NotionMagicLinkEmailProps {
  username: string;
  verify_link: string;
  baseUrl: string;
}

export const EmailResetPassword = ({
  username,
  verify_link,
  baseUrl,
}: NotionMagicLinkEmailProps) => {
  return (
    <Html>
      <Head>
        <title>Password Forget</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
      </Head>
      <Preview>Please reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/assets/logo.png`}
            width="100"
            height="50"
            alt={`${baseUrl}/assets/logo.png`}
          />
          <Text style={{ ...text, marginBottom: "14px" }}>
            {`
            We are sorry to hear that you forgot your password.
            To reset your password, click the button below.

            `}
          </Text>
          <Button
            href={`${verify_link}`}
            style={{
              ...button,

              paddingTop: "10px",

              paddingBottom: "10px",
              paddingLeft: "24px",
              paddingRight: "24px",
              borderRadius: "100px",
            }}
          >
            Reset Password
          </Button>
          <Text
            style={{
              ...text,
              //color: "#ababab",
              marginTop: "14px",
              marginBottom: "16px",
            }}
          >
            Welcome to Carnet! <br /> The Carnet Team
          </Text>
          <Hr />
          <Text
            style={{
              ...text,
              color: "#ababab",
              fontStyle: "italic",
              marginTop: "12px",
              marginBottom: "38px",
            }}
          >
            If you did not request a password reset, please ignore this email.
            This link will expire in 24 hours.
          </Text>
          {/* <Img
          src={`${baseUrl}/assets/big_logo.png`}
          width="32"
          height="32"
          alt="Carnet's Logo"
        />
        <Text style={footer}>
          <Link
            href={`${baseUrl}`}
            target="_blank"
            style={{ ...link, color: "#898989" }}
          >
            Carnet
          </Link>
          , the all-in-one-workspace
          <br />
          for your notes, tasks, wikis, and databases.
        </Text> */}
        </Container>
      </Body>
    </Html>
  );
};

export default EmailResetPassword;

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
};

const button = {
  backgroundColor: "#181CA9",
  borderRadius: "4px",
  color: "#ffffff",
  display: "inline-block",
  fontFamily: "sans-serif",
  fontSize: "14px",
  fontWeight: "bold",
  lineHeight: "16px",
  padding: "24px",
  textDecoration: "none",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};
