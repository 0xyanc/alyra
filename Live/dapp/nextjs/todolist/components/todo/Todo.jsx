import { Button, Checkbox, Flex, ListItem, Text } from "@chakra-ui/react";

export default function Todo({ todo, setTodos, todos }) {
  const setCheckedItems = (checked, id) => {
    let myTodos = [...todos];
    let index = myTodos.findIndex((t) => t.id === id);
    myTodos[index].isDone = checked;
    setTodos(myTodos);
  };

  const deleteTodo = (id) => {
    let myTodos = [...todos];
    let updatedTodos = myTodos.filter((t) => t.id !== id);
    setTodos(updatedTodos);
  };

  return (
    <ListItem mt="1rem">
      {todo.isDone ? <strike>{todo.name}</strike> : <>{todo.name}</>}
      <Checkbox colorScheme="green" ml="1rem" mr="1rem" onChange={(e) => setCheckedItems(e.target.checked, todo.id)}>
        Completed
      </Checkbox>
      <Button onClick={() => deleteTodo(todo.id)}>Delete</Button>
    </ListItem>
  );
}
