import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import AddJob from "../AddJob/AddJob";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isConnected } = useAccount();

  return (
    <Flex p="2rem" justifyContent="space-between" alignItems="center">
      <Text>Mini Job DApp</Text>
      <Text>Home</Text>
      {isConnected ? <Button onClick={onOpen}>Add a Job</Button> : <></>}
      <AddJob isOpen={isOpen} onClose={onClose} />
      <ConnectButton />
    </Flex>
  );
};

export default Header;
