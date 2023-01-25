import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import Event from "../Event/Event";
// import { ConnectButton } from "@rainbow-me/rainbowkit";

const Events = ({ events }) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Date</Th>
            <Th>Event Name</Th>
            <Th>Account</Th>
            <Th>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {events.map((event) => {
            return <Event event={event} key={event.id} />;
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default Events;
