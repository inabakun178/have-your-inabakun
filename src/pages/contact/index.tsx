import type { NextPage } from "next";
import { Box, Text } from "@chakra-ui/react";
import PageTemplate from "../../components/common/PageTemplate/PageTemplate";

const Contact: NextPage = () => {
  return (
    <PageTemplate pageTitle="Contact">
      <Box pt={{ base: "150px", md: "200px" }}>
        <Text
          fontSize={{ base: "18px", md: "30px" }}
          color="rgba(255,255,255, 0.5)"
          textAlign="center"
        >
          フォーム制作中。
          <br />
          ご連絡はTwitterのDMにお願い致します。
        </Text>
      </Box>
    </PageTemplate>
  );
};

export default Contact;
