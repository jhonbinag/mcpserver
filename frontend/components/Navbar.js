import { 
  Box, 
  Flex, 
  Text, 
  Button, 
  Stack, 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  HStack,
  Spacer,
  IconButton,
  useColorModeValue 
} from '@chakra-ui/react';
import { useAuth } from './AuthContext';
import Link from 'next/link';

export default function Navbar({ isSidebarPresent }) {
  const { isAuthenticated, user, logout } = useAuth();
  
  return (
    <Flex
      w="full"
      alignItems="center"
      justifyContent="flex-end"
    >
      {!isSidebarPresent && (
        <Link href="/">
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="brand.500"
            cursor="pointer"
            mr={4}
          >
            MCP Server
          </Text>
        </Link>
      )}
      
      <Spacer display={{ base: "none", md: "block" }} />
      
      <HStack spacing={3}>
        {!isAuthenticated ? (
          <Link href="/login">
            <Button
              size="sm"
              fontSize="sm"
              fontWeight={600}
              color="white"
              bg="brand.500"
              _hover={{
                bg: 'brand.600',
              }}
            >
              Login
            </Button>
          </Link>
        ) : (
          <Menu>
            <MenuButton
              as={Button}
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
            >
              <HStack>
                <Text display={{ base: "none", md: "block" }} fontWeight="medium" fontSize="sm">
                  {user?.email || 'User'}
                </Text>
                <Avatar
                  size="sm"
                  src="https://avatars.dicebear.com/api/human/mcp.svg"
                />
              </HStack>
            </MenuButton>
            <MenuList>
              <Link href="/dashboard">
                <MenuItem>Dashboard</MenuItem>
              </Link>
              <Link href="/profile">
                <MenuItem>Profile</MenuItem>
              </Link>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>
    </Flex>
  );
} 