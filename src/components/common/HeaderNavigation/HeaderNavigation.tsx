import NextLink from "next/link";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  List,
  ListItem,
} from "@chakra-ui/react";
import { COLORS } from "../../../lib/colors";

const HeaderNavigation = () => {
  const pageList = [
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
      h={{ base: "50px", md: "100px" }}
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
        <Heading as="h1" lineHeight="1">
          <Link
            as={NextLink}
            href="/"
            display="block"
            color={COLORS.text.main}
            fontSize={{ base: "20px", md: "40px" }}
            letterSpacing="0.15em"
            transition="0.4s"
            _hover={{ opacity: 0.6 }}
          >
            H.Inaba
          </Link>
        </Heading>

        <List display={{ base: "none", md: "flex" }}>
          {pageList.map((page, index) => (
            <ListItem key={page.name} ml={index === 0 ? 0 : "60px"}>
              <Link
                as={NextLink}
                href={page.link}
                color={COLORS.text.main}
                fontSize="18px"
                letterSpacing="0.1em"
                transition="0.4s"
                _hover={{ opacity: 0.6 }}
              >
                {page.name}
              </Link>
            </ListItem>
          ))}
        </List>

        <Button
          display={{ base: "block", md: "none" }}
          padding="0"
          position="relative"
          outline="none"
          background="none"
          _active={{ background: "none" }}
        >
          <Divider
            w="100%"
            h="2px"
            borderBottom="none"
            background={COLORS.text.main}
            opacity="1"
            position="absolute"
            top="10px"
            left="0"
          />
          <Divider
            w="100%"
            h="2px"
            borderBottom="none"
            background={COLORS.text.main}
            opacity="1"
            position="absolute"
            bottom="10px"
            left="0"
          />
        </Button>
      </Flex>
    </Box>
  );
};

export default HeaderNavigation;
