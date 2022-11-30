import NextLink from "next/link";
import { Box, Flex, Heading, Link, List, ListItem } from "@chakra-ui/react";
import { COLORS } from "../../../lib/colors";

const HeaderNavigation = () => {
  const pageList = [
    {
      name: "Works",
      link: "/works",
    },
    {
      name: "Profile",
      link: "/profile",
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ];

  return (
    <Box
      w="100%"
      h="100px"
      p="0 100px"
      position="sticky"
      zIndex={"sticky"}
      top="0"
    >
      <Flex
        justifyContent="space-between"
        color={COLORS.text.main}
        alignItems="center"
        h="100%"
      >
        {/* TODO: ロゴを置く */}
        <Heading as="h1">
          <NextLink href="/" passHref>
            <Link
              color={COLORS.text.main}
              fontSize="40px"
              letterSpacing="0.15em"
              transition="0.4s"
              _hover={{ opacity: 0.6 }}
            >
              H.Inaba
            </Link>
          </NextLink>
        </Heading>

        <List display="flex">
          {pageList.map((page, index) => (
            <ListItem key={page.name} ml={index === 0 ? 0 : "60px"}>
              <NextLink href={page.link} passHref>
                <Link
                  color={COLORS.text.main}
                  fontSize="18px"
                  letterSpacing="0.1em"
                  transition="0.4s"
                  _hover={{ opacity: 0.6 }}
                >
                  {page.name}
                </Link>
              </NextLink>
            </ListItem>
          ))}
        </List>
      </Flex>
    </Box>
  );
};

export default HeaderNavigation;
