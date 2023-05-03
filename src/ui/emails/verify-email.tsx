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

export const EmailVerifyEmail = ({
  username,
  verify_link,
  baseUrl,
}: NotionMagicLinkEmailProps) => {
  return (
    <Html>
      <Head>
        <title>Log in to Carnet</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
      </Head>
      <Preview>Email Verification for {username} on Carnet</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading
            style={{
              color: "#181CA9",
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "12px",
            }}
          >
            CARNET
          </Heading>

          <Text style={{ ...text, marginBottom: "16px" }}>
            {`Hi there, ${username}.`}
          </Text>
          <Text style={{ ...text, marginBottom: "14px" }}>
            {`We're happy you signed up for Carnet! To start using your account,
          click the button below to verify your email address.`}
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
            Verify Now
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
            This email is required for security reasons to verify your account.
            If you did not sign up for Carnet, you can safely ignore this email.
            The link will expire in 24 hours.
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

export default EmailVerifyEmail;

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
