import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Layout from '@/components/layout/Layout'
import { Flex, Heading, IconButton, Text } from '@chakra-ui/react'
import AddTodo from '@/components/addTodo/AddTodo'
import TodoList from '@/components/todolist/TodoList'
import { useState } from 'react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useColorMode } from '@chakra-ui/color-mode'

export default function Home() {

  const [todos, setTodos] = useState([])
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <>
      <Head>
        <title>TodoList App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <IconButton mt={4} aria-label="Toggle Mode" onClick={toggleColorMode}>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </IconButton>
        <Flex direction="column" p="2rem" alignItems="center" width="100%">
          <Heading as='h1' size='xl'>
            TODO APP
          </Heading>
          <AddTodo todos={todos} setTodos={setTodos} />
          <TodoList todos={todos} setTodos={setTodos} />
        </Flex>
      </Layout>
    </>
  )
}
