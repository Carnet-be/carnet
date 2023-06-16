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
  title: string;
  description: string;
  link?: string;
  baseUrl: string;
}

export const DefaultEmailNotification = ({
  title,
  description,
  link,
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
      <Preview>Notification</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/assets/logo.png`}
            width="100"
            height="50"
            alt="Carnet's Logo"
          />

          <Text
            style={{
              ...text,
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            {title}
          </Text>
          <Text style={{ ...text, marginBottom: "14px" }}>{description}</Text>
          <Button
            href={`${baseUrl}${link}`}
            style={{
              ...button,

              paddingTop: "10px",
              paddingBottom: "10px",
              paddingLeft: "24px",
              paddingRight: "24px",
              borderRadius: "100px",
            }}
          >
            Check
          </Button>
          <Text
            style={{
              ...text,
              //color: "#ababab",
              marginTop: "14px",
              marginBottom: "16px",
            }}
          ></Text>
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
            Please note that this email was sent automatically. Kindly refrain
            from responding directly to this message.
            <br />
            <br />
            The Carnet Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default DefaultEmailNotification;

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
