import { Box, List, ListItem, pseudoPropNames, Text } from "@chakra-ui/react";
import { COLORS } from "../../../../lib/colors";

type TextListAreaProps = {
  title: string;
  items: string[];
};

const TextListArea = (props: TextListAreaProps) => {
  return (
    <Box
      p={{ base: "50px 20px", md: "120px 50px" }}
      display={{ base: "block", xl: "flex" }}
      alignItems="center"
      background={COLORS.background.sub}
    >
      <Text
        minW={{ base: "inherit", md: "25%" }}
        fontSize={{ base: "30px", md: "90px" }}
        color="rgba(255,255,255, 0.5)"
      >
        {props.title}
      </Text>
      <List
        pl={{ base: "0", xl: "100px" }}
        mt={{ base: "20px", xl: "0" }}
        color="rgba(255,255,255, 0.5)"
        fontSize={{ base: "15px", md: "18px" }}
        lineHeight="1.8"
        letterSpacing="0.1em"
      >
        {props.items.map((item) => (
          <ListItem key={item}>- {item}</ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TextListArea;
