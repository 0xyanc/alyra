import { Flex, Button, Input } from "@chakra-ui/react";
import { useState } from "react";

export default function AddTodo({ todos, setTodos }) {
  const [task, setTask] = useState("");

  const addTodo = () => {
    let updatedTodos = [...todos];
    updatedTodos.push({ id: crypto.randomUUID(), name: task, isDone: false });

    setTodos(updatedTodos);
    setTask("");
  };

  return (
    <Flex mt="2rem" width="60%">
      <Input placeholder="Add a task" onChange={(e) => setTask(e.currentTarget.value)} />
      <Button onClick={() => addTodo()} colorScheme="purple">
        Add the task
      </Button>
    </Flex>
  );
}
