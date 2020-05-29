import { Heading, Stack, Text } from "@chakra-ui/core";

import { NextSeo } from "next-seo";
import React from "react";
import { useRouter } from "next/router";

const NotFoundPage: React.FC = () => {
  const { asPath } = useRouter();

  return (
    <Stack maxW="4xl" mx="auto" p={8} spacing={4}>
      <NextSeo title="404" />

      <Heading as="h1">404 Not Found</Heading>

      <Text>
        The route <code>{asPath}</code> does not exist.
      </Text>
    </Stack>
  );
};

export default NotFoundPage;
