import { Box, Link, List, ListItem, Image } from "@chakra-ui/react";

const SnsList = () => {
  const snsLinkList = [
    {
      link: "https://www.instagram.com/purupuruboy2?igsh=dDB0cDd2dGN2bHEw&utm_source=qr",
      image: "icon-instagram.svg",
      name: "Instagram",
    },
    {
      link: "https://twitter.com/dev_inabakun",
      image: "icon-twitter.svg",
      name: "Twitter",
    },
    {
      link: "https://ja-jp.facebook.com/hayato.inaba.77",
      image: "icon-facebook.svg",
      name: "Facebook",
    },
    {
      link: "https://github.com/inabakun178",
      image: "icon-github.svg",
      name: "GitHub",
    },
  ];
  return (
    <Box position="fixed" bottom="15px" right="15px" zIndex={"sticky"}>
      <List>
        {snsLinkList.map((snsLink, index) => (
          <ListItem key={snsLink.name} mt={index === 0 ? "0" : "15px"}>
            <Link href={snsLink.link} isExternal>
              <Image
                src={`/${snsLink.image}`}
                alt={snsLink.name}
                width="40px"
              />
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SnsList;
