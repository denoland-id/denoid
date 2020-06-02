import * as React from "react";

import {
  Box,
  Code,
  Heading,
  Icon,
  Input,
  PseudoBox,
  Stack,
  Text,
} from "@chakra-ui/core";
import { useDebounce, useSiteConfig } from "@/hooks";

import { DenoModule } from "@/types";
import { GetStaticProps } from "next";
import { Link } from "@/components";
import { NextSeo } from "next-seo";
import { getModulesTable } from "@/services/airtable";
import { searchModuleFields } from "@/utils";

interface XPageProps {
  data: DenoModule[];
}

export const getStaticProps: GetStaticProps<XPageProps> = async () => {
  const data = await getModulesTable()
    .select({
      fields: ["name", "desc"],
      filterByFormula: "{active} = 1",
      sort: [{ field: "name" }],
    })
    .all()
    .then((d) => d.map(({ fields }) => fields));

  return {
    props: {
      data,
    },
    unstable_revalidate: 10,
  };
};

const XPage: React.FC<XPageProps> = ({ data }) => {
  const { socials } = useSiteConfig();

  const [search, setSearch] = React.useState<string>();
  const [debouncedSearch, update] = useDebounce(search);

  const filteredData = React.useMemo(
    () =>
      debouncedSearch
        ? data.filter((d) => searchModuleFields(d, debouncedSearch))
        : data,
    [debouncedSearch],
  );

  return (
    <Stack maxW="5xl" mx="auto" p={8} spacing={8}>
      <NextSeo
        title="Third Party Modules"
        description="Deno Land Indonesia third party modules"
      />

      <Stack spacing={2}>
        <Heading as="h1">Third Party Modules</Heading>
        <Text>
          Berikut merupakan daftar modul Deno karya para developer Indonesia. 🇮🇩
        </Text>

        <Text wordBreak="break-word">
          Format dasar URL adalah{" "}
          <Code display="inline" p={1}>
            https://denoland.id/x/MODULE_NAME@BRANCH/SCRIPT.ts
          </Code>
          . Jika tidak menyertakan nama branch, URL akan menggunakan branch
          default pada modul, umumnya yaitu branch <Code>master</Code>.
        </Text>

        <Text>
          Anda dapat bantu kontribusi pengembangan layanan berikut pada{" "}
          <Link href={socials.github} isExternal i>
            repositori GitHub kami
          </Link>
          . Untuk menambahkan modul baru, silakan{" "}
          <Link href="https://airtable.com/shreNZcwvO3tM19L1" isExternal i>
            mengisi form modul database
          </Link>
          .
        </Text>
      </Stack>

      <Box>
        <Input
          borderColor="gray.300"
          boxShadow="sm"
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={({ key }) => key === "Enter" && update()}
          placeholder="Input nama modul dan tekan enter"
        />
      </Box>

      <Box
        borderColor="gray.300"
        borderRadius={4}
        borderWidth={1}
        boxShadow="sm"
      >
        {filteredData.length > 0 ? (
          filteredData.map(({ name, desc }) => (
            <PseudoBox
              key={name}
              _hover={{ backgroundColor: "gray.50" }}
              _first={{ borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
              _last={{ borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}
              _notLast={{ borderBottomWidth: 1, borderBottomColor: "gray.200" }}
            >
              <Link
                display="flex"
                _hover={{ textDecoration: "none" }}
                href="/x/[...segments]"
                isNextLink
                linkAs={`/x/${name}`}
                justifyContent="space-between"
              >
                <Box px={4} py={2}>
                  <Text color="blue.500">{name}</Text>
                  <Text fontSize="sm">{desc}</Text>
                </Box>

                <Box color="gray.500" pr={6} py={4}>
                  <Icon name="chevron-right" />
                </Box>
              </Link>
            </PseudoBox>
          ))
        ) : (
          <Text textAlign="center" p={4}>
            Tidak menemukan modul... :(
          </Text>
        )}
      </Box>
    </Stack>
  );
};

export default XPage;
