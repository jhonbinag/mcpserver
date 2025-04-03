import { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  CloseButton,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  Button,
  VStack,
  HStack,
  Divider,
  Badge,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';

// Mock function to get MCP servers - in production, replace with API call
const getMcpServers = async () => {
  return {
    data: {
      success: true,
      servers: [
        'server-sequential-thinking',
        'perplexity-deep-research',
        'github',
        'claude-code-mcp',
      ]
    }
  };
};

// Navigation items
const NavItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Settings', path: '/settings', icon: '⚙️' },
  { name: 'Documentation', path: '/docs', icon: '📝' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { isAuthenticated } = useAuth();
  const [favoriteServers, setFavoriteServers] = useState([]);
  
  useEffect(() => {
    if (isAuthenticated) {
      const fetchServers = async () => {
        try {
          const { data } = await getMcpServers();
          // For demo, just show first 4 servers
          setFavoriteServers(data.servers.slice(0, 4));
        } catch (error) {
          console.error('Error fetching servers:', error);
        }
      };
      
      fetchServers();
    }
  }, [isAuthenticated]);

  const router = useRouter();
  
  const SidebarContent = (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      overflowY="auto"
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="brand.500">
          MCP Server
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      
      <VStack align="start" spacing={1} p={4}>
        <Text fontWeight="bold" mb={2} color="gray.500" fontSize="sm">
          NAVIGATION
        </Text>
        
        {NavItems.map((item) => (
          <NavItem 
            key={item.name} 
            icon={item.icon} 
            path={item.path}
            active={router.pathname === item.path}
          >
            {item.name}
          </NavItem>
        ))}
        
        <Divider my={4} />
        
        <Text fontWeight="bold" mb={2} color="gray.500" fontSize="sm">
          QUICK ACCESS
        </Text>
        
        {favoriteServers.map((server) => (
          <NavItem 
            key={server} 
            icon="🤖" 
            onClick={() => router.push({
              pathname: '/dashboard',
              query: { server }
            })}
          >
            {formatServerName(server)}
          </NavItem>
        ))}
        
        <Divider my={4} />
        
        <Text fontWeight="bold" mb={2} color="gray.500" fontSize="sm">
          SYSTEM
        </Text>
        
        <NavItem icon="🔌" path="/api-status">
          API Status
          <Badge ml={2} colorScheme="green">Online</Badge>
        </NavItem>
        
        <NavItem icon="🔔" path="/notifications">
          Notifications
          {isAuthenticated && (
            <Badge ml={2} colorScheme="red" borderRadius="full">
              3
            </Badge>
          )}
        </NavItem>
      </VStack>
    </Box>
  );

  return (
    <Box>
      {/* Mobile drawer */}
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          {SidebarContent}
        </DrawerContent>
      </Drawer>
      
      {/* Desktop sidebar */}
      <Box display={{ base: 'none', md: 'block' }} w={60}>
        {SidebarContent}
      </Box>
    </Box>
  );
}

const NavItem = ({ icon, children, active, path, ...rest }) => {
  const bgColor = active ? "brand.50" : "transparent";
  const color = active ? "brand.600" : "gray.600";
  const router = useRouter();
  
  const handleClick = () => {
    if (path) {
      router.push(path);
    }
  };
  
  return (
    <Box
      as="a"
      href={path || "#"}
      onClick={(e) => {
        if (rest.onClick) {
          e.preventDefault();
          rest.onClick();
        } else if (path) {
          e.preventDefault();
          handleClick();
        }
      }}
      style={{ textDecoration: 'none' }}
      w="full"
    >
      <Flex
        align="center"
        p="3"
        mx="1"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={bgColor}
        color={color}
        _hover={{
          bg: 'brand.50',
          color: 'brand.600',
        }}
        fontWeight={active ? "semibold" : "normal"}
        {...rest}
      >
        {icon && (
          <Text mr="3" fontSize="18px">
            {icon}
          </Text>
        )}
        <Text fontSize="sm" fontWeight="medium">
          {children}
        </Text>
      </Flex>
    </Box>
  );
};

// Helper function to format server names for display
function formatServerName(server) {
  return server
    .replace('server-', '')
    .replace('-mcp', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
} 