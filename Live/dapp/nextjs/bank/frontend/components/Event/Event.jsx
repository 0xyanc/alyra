import { Td, Tr } from "@chakra-ui/react";
import { ethers } from "ethers";

const Event = ({ event }) => {
  return (
    <Tr>
      <Td>
        {event.date.toLocaleDateString()} {event.date.toLocaleTimeString()}
      </Td>
      <Td>{event.name}</Td>
      <Td>{event.account}</Td>
      <Td isNumeric>{ethers.utils.formatEther(event.amount.toString())}</Td>
    </Tr>
  );
};

export default Event;
