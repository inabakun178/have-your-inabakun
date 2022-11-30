import NextLink from "next/link";
import { Box, Flex, Link } from "@chakra-ui/react";

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
      <Flex justifyContent="flex-end" alignItems="center" h="100%">
        {/* TODO: ロゴを置く */}
        {pageList.map((page, index) => (
          <Box key={page.name} ml={index === 0 ? 0 : "60px"}>
            <NextLink href={page.link} passHref>
              <Link color="#fff" fontSize="18px" _hover={{ opacity: 0.6 }}>
                {page.name}
              </Link>
            </NextLink>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default HeaderNavigation;
