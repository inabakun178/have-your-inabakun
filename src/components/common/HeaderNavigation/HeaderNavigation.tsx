import NextLink from "next/link";
import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  Flex,
  Heading,
  Link,
  List,
  ListItem,
  useDisclosure,
} from "@chakra-ui/react";
import { COLORS } from "../../../lib/colors";
import React from "react";

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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);

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
          ref={btnRef}
          onClick={onOpen}
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

        <Drawer
          isOpen={isOpen}
          onClose={onClose}
          finalFocusRef={btnRef}
          size="full"
        >
          <DrawerContent background={COLORS.background.main}>
            <DrawerCloseButton color={COLORS.text.main} size="lg" />
            <DrawerBody
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <List>
                {pageList.map((page, index) => (
                  <ListItem
                    key={page.name}
                    mt={index === 0 ? 0 : "60px"}
                    textAlign="center"
                  >
                    <Link
                      as={NextLink}
                      href={page.link}
                      p="20px"
                      display="block"
                      color={COLORS.text.main}
                      fontSize="25px"
                      letterSpacing="0.1em"
                      _hover={{ opacity: 0.6 }}
                      onClick={onClose}
                    >
                      {page.name}
                    </Link>
                  </ListItem>
                ))}
              </List>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
};

export default HeaderNavigation;
