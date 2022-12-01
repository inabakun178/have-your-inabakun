import { Box, Link, List, ListItem, Text, Image } from "@chakra-ui/react";

const SnsList = () => {
  return (
    <Box position="fixed" bottom="50px" right="50px">
      <List>
        <ListItem mt="10px">
          <Link href="https://twitter.com/dev_inabakun" isExternal>
            <Image src="/icon-twitter.svg" alt="Twitter" />
          </Link>
        </ListItem>
        <ListItem mt="10px">
          <Link href="https://ja-jp.facebook.com/hayato.inaba.77" isExternal>
            <Image src="/icon-facebook.svg" alt="Facebook" />
          </Link>
        </ListItem>
      </List>
    </Box>
  );
};

export default SnsList;
