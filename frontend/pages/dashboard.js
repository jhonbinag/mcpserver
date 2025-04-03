import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Select,
} from '@chakra-ui/react';
import { useAuth } from '../components/AuthContext';
import Layout from '../components/Layout';
import axios from 'axios';

// Mock function to get MCP servers
const getMcpServers = async () => {
  // In production, replace with actual API call
  // return await axios.get(`${process.env.API_URL}/api/process`, { 
  //   params: { action: 'list' }
  // });
  
  // For demo, return mock data
  return {
    data: {
      success: true,
      servers: [
        'server-sequential-thinking',
        'perplexity-deep-research',
        'github',
        'claude-code-mcp',
        'n8n-workflow-builder',
        'fetch-mcp',
        'smart-thinking',
        'react-mcp'
      ]
    }
  };
};

export default function Dashboard() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [mcpServers, setMcpServers] = useState([]);
  const [activeServer, setActiveServer] = useState('');
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Handle server selection from URL query params
  useEffect(() => {
    if (router.query.server) {
      setActiveServer(router.query.server);
    }
  }, [router.query]);

  // Fetch MCP servers
  useEffect(() => {
    const fetchMcpServers = async () => {
      try {
        const { data } = await getMcpServers();
        if (data.success) {
          setMcpServers(data.servers);
          if (!activeServer && data.servers.length > 0) {
            setActiveServer(data.servers[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching MCP servers:', error);
      }
    };

    if (isAuthenticated) {
      fetchMcpServers();
    }
  }, [isAuthenticated, activeServer]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    const newMessage = { 
      id: Date.now(), 
      text: message, 
      server: activeServer,
      timestamp: new Date().toISOString(),
      response: null
    };

    // Add message to conversation
    const updatedConversations = [...conversations, newMessage];
    setConversations(updatedConversations);
    setMessage('');

    try {
      // In production, replace with actual API call
      // const { data } = await axios.post(`${process.env.API_URL}/api/conversation`, {
      //   conversationId: 'demo-conversation',
      //   message: message,
      //   context: { domain: activeServer }
      // });

      // Mock response
      const mockResponse = `This is a mock response from the ${activeServer} for your message: "${message}"`;
      
      // Update conversation with response
      const finalConversations = updatedConversations.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, response: mockResponse }
          : msg
      );
      
      setConversations(finalConversations);
      
      toast({
        title: 'Message sent',
        description: `Successfully processed by ${activeServer}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to process your message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <Box p={8}>Loading...</Box>;
  }

  return (
    <Layout>
      <Box>
        <Heading mb={6}>Dashboard</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          <Stat
            px={{ base: 4, md: 8 }}
            py="5"
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
            rounded="lg"
            bg="white"
          >
            <StatLabel fontWeight="medium">Available MCP Servers</StatLabel>
            <StatNumber>{mcpServers.length}</StatNumber>
            <StatHelpText>Ready to process requests</StatHelpText>
          </Stat>
          
          <Stat
            px={{ base: 4, md: 8 }}
            py="5"
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
            rounded="lg"
            bg="white"
          >
            <StatLabel fontWeight="medium">Conversations</StatLabel>
            <StatNumber>{conversations.length}</StatNumber>
            <StatHelpText>Total messages processed</StatHelpText>
          </Stat>
          
          <Stat
            px={{ base: 4, md: 8 }}
            py="5"
            shadow="md"
            border="1px solid"
            borderColor="gray.200"
            rounded="lg"
            bg="white"
          >
            <StatLabel fontWeight="medium">Active Server</StatLabel>
            <Text fontWeight="bold" fontSize="lg" color="brand.500">
              {activeServer ? formatServerName(activeServer) : 'None selected'}
            </Text>
            <StatHelpText>Currently active MCP</StatHelpText>
          </Stat>
        </SimpleGrid>
        
        <Card mb={6} shadow="md">
          <CardHeader bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
            <Heading size="md">Chat with MCP Server</Heading>
          </CardHeader>
          <CardBody>
            <Box mb={4}>
              <FormControl mb={4}>
                <FormLabel>Select MCP Server</FormLabel>
                <Select 
                  value={activeServer} 
                  onChange={(e) => setActiveServer(e.target.value)}
                >
                  {mcpServers.map(server => (
                    <option key={server} value={server}>
                      {formatServerName(server)}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box 
              mb={4} 
              h="300px" 
              overflowY="auto" 
              p={4} 
              border="1px solid" 
              borderColor="gray.200"
              borderRadius="md"
            >
              {conversations.length > 0 ? (
                conversations.map(msg => (
                  <Box key={msg.id} mb={4}>
                    <Flex justify="flex-end">
                      <Box 
                        bg="brand.500" 
                        color="white" 
                        p={3} 
                        borderRadius="lg" 
                        maxW="80%"
                      >
                        <Text>{msg.text}</Text>
                        <Text fontSize="xs" textAlign="right" mt={1}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </Text>
                      </Box>
                    </Flex>
                    
                    {msg.response && (
                      <Flex mt={2}>
                        <Box 
                          bg="gray.100" 
                          p={3} 
                          borderRadius="lg" 
                          maxW="80%"
                        >
                          <Text>{msg.response}</Text>
                          <Flex justify="space-between" mt={1}>
                            <Badge colorScheme="blue">{formatServerName(msg.server)}</Badge>
                            <Text fontSize="xs">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                    )}
                  </Box>
                ))
              ) : (
                <Text color="gray.500" textAlign="center">
                  No messages yet. Start a conversation!
                </Text>
              )}
            </Box>
            
            <form onSubmit={handleSendMessage}>
              <Flex>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Ask something to ${formatServerName(activeServer)}...`}
                  mr={2}
                />
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isLoading}
                  alignSelf="flex-end"
                >
                  Send
                </Button>
              </Flex>
            </form>
          </CardBody>
        </Card>
        
        <Card shadow="md">
          <CardHeader bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
            <Heading size="md">Available MCP Servers</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {mcpServers.map(server => (
                <Card key={server} variant="outline">
                  <CardBody>
                    <Heading size="sm" mb={2}>{formatServerName(server)}</Heading>
                    <Text fontSize="sm" mb={3}>
                      {getServerDescription(server)}
                    </Text>
                    <Button
                      size="sm"
                      colorScheme={activeServer === server ? "blue" : "gray"}
                      variant={activeServer === server ? "solid" : "outline"}
                      onClick={() => setActiveServer(server)}
                      width="full"
                    >
                      {activeServer === server ? 'Selected' : 'Select'}
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>
      </Box>
    </Layout>
  );
}

// Helper function to format server names for display
function formatServerName(server) {
  if (!server) return '';
  
  return server
    .replace('server-', '')
    .replace('-mcp', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to get server descriptions
function getServerDescription(server) {
  const descriptions = {
    'server-sequential-thinking': 'Processes requests using sequential thinking approach.',
    'perplexity-deep-research': 'Conducts deep research on complex topics.',
    'github': 'Interacts with GitHub repositories and issues.',
    'claude-code-mcp': 'Specialized in code generation and analysis.',
    'n8n-workflow-builder': 'Helps build and manage n8n workflows.',
    'fetch-mcp': 'Fetches and processes data from various sources.',
    'smart-thinking': 'Advanced reasoning and problem-solving capabilities.',
    'react-mcp': 'Specializes in React component design and implementation.'
  };
  
  return descriptions[server] || 'MCP Server with processing capabilities.';
} 