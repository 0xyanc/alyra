import { Flex, Text, Button } from '@chakra-ui/react'
import Header from '../header/Header'
import Footer from '../footer/Footer'

export default function Layout({ children }) {
    return (
        <Flex direction="column" minH="100vh">
            <Header/>
            <Flex grow="1">
                {children}
            </Flex>
            <Footer/>
        </Flex>
    )
}