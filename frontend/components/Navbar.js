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
  useColorModeValue 
} from '@chakra-ui/react';
import { useAuth } from './AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  
  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        justify={'space-between'}
      >
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Link href="/">
            <Text
              textAlign="left"
              fontFamily={'heading'}
              color={useColorModeValue('gray.800', 'white')}
              fontWeight="bold"
              cursor="pointer"
            >
              MCP Server
            </Text>
          </Link>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          {!isAuthenticated ? (
            <Link href="/login">
              <Button
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'brand.500'}
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
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <Avatar
                  size={'sm'}
                  src={'https://avatars.dicebear.com/api/human/mcp.svg'}
                />
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
        </Stack>
      </Flex>
    </Box>
  );
} 