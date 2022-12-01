import { Flex, Image } from "@chakra-ui/react";

const Fv = () => {
  return (
    <Flex
      minH={{ base: "calc(100vh - 50px)", md: "calc(100vh - 100px)" }}
      justifyContent="center"
      alignItems="center"
    >
      <Image src="/fv_title.svg" alt="Have Your Inabakun" />
    </Flex>
  );
};

export default Fv;