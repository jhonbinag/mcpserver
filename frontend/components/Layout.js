import { useState } from 'react';
import { Box, Flex, useDisclosure, IconButton, useColorModeValue } from '@chakra-ui/react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// Simple hamburger icon component
const HamburgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Layout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Sidebar isOpen={isOpen} onClose={onClose} />
      
      <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
        <Flex
          as="header"
          position="sticky"
          top={0}
          zIndex={10}
          bg={useColorModeValue("white", "gray.800")}
          borderBottomWidth="1px"
          borderColor={useColorModeValue("gray.200", "gray.700")}
          h="16"
          alignItems="center"
          justifyContent="space-between"
          px={{ base: 4, md: 6 }}
        >
          <IconButton
            display={{ base: "flex", md: "none" }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<HamburgerIcon />}
          />
          
          <Navbar isSidebarPresent={true} />
        </Flex>
        
        <Box as="main" p={4} minH="calc(100vh - 4rem)">
          {children}
        </Box>
      </Box>
    </Box>
  );
} 