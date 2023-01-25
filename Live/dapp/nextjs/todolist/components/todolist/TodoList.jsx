import { Flex, UnorderedList, ListItem } from "@chakra-ui/react";
import Todo from "../todo/Todo";

export default function TodoList({ todos, setTodos }) {
  return (
    <Flex mt="2rem" width="100%" justifyContent="center">
      <UnorderedList>
        {todos.map((todo) => {
          return <Todo todo={todo} setTodos={setTodos} key={todo.id} todos={todos} />;
        })}
      </UnorderedList>
    </Flex>
  );
}
