import * as React from "react";

import { Code, Heading, Stack } from "@chakra-ui/core";

import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { STATUS_CODES } from "http";

type ErrorPageProps = {
  statusCode: number;
  title: string;
};

const ErrorPage: NextPage<ErrorPageProps> = ({ children, ...props }) => (
  <Stack maxW="4xl" mx="auto" p={8} spacing={4}>
    <NextSeo title={`${props.statusCode}`} />

    <Heading as="h1">
      {props.statusCode} {props.title}
    </Heading>

    <Code>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </Code>
  </Stack>
);

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return {
    statusCode,
    title: STATUS_CODES[statusCode],
  };
};

export default ErrorPage;
