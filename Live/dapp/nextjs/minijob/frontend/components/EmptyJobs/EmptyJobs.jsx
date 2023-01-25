import { Card, CardBody, Center, Heading, Stack, Text } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

const EmptyJobs = () => {
  return (
    <Card
      variant="filled"
      direction={{ base: "column", sm: "row" }}
      w="23%"
      overflow="hidden"
      m="auto"
      bg="blanchedalmond"
    >
      <WarningIcon color="darkorange" m="auto" />
      <Stack>
        <CardBody>
          <Heading size="md">There are no jobs on our DApp</Heading>
          <Text>Create the first job!</Text>
        </CardBody>
      </Stack>
    </Card>
  );
};

export default EmptyJobs;
