import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  FormControl,
  FormLabel,
  Switch,
  Select,
  Input,
  Button,
  HStack,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useAuth } from '../components/AuthContext';
import Layout from '../components/Layout';

export default function Settings() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  if (loading) {
    return <Box p={8}>Loading...</Box>;
  }

  return (
    <Layout>
      <Box>
        <Heading mb={6}>Settings</Heading>
        <Text mb={6} color="gray.600">
          Configure your MCP Server dashboard preferences and API settings.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card shadow="md">
            <CardHeader bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
              <Heading size="md">User Preferences</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="start">
                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <FormLabel htmlFor="dark-mode" mb="0">
                    Dark Mode
                  </FormLabel>
                  <Switch id="dark-mode" colorScheme="blue" />
                </FormControl>

                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <FormLabel htmlFor="notifications" mb="0">
                    Enable Notifications
                  </FormLabel>
                  <Switch id="notifications" colorScheme="blue" defaultChecked />
                </FormControl>

                <FormControl>
                  <FormLabel>Default MCP Server</FormLabel>
                  <Select defaultValue="server-sequential-thinking">
                    <option value="server-sequential-thinking">Sequential Thinking</option>
                    <option value="perplexity-deep-research">Perplexity Research</option>
                    <option value="github">GitHub</option>
                    <option value="claude-code-mcp">Claude Code</option>
                  </Select>
                </FormControl>
              </VStack>
            </CardBody>
          </Card>

          <Card shadow="md">
            <CardHeader bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
              <Heading size="md">API Configuration</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="start">
                <FormControl>
                  <FormLabel>API Endpoint</FormLabel>
                  <Input defaultValue="https://ammcpserver.vercel.app" />
                </FormControl>

                <FormControl>
                  <FormLabel>API Key</FormLabel>
                  <Input type="password" defaultValue="*************" />
                </FormControl>

                <FormControl display="flex" alignItems="center" justifyContent="space-between">
                  <FormLabel htmlFor="api-logging" mb="0">
                    Enable API Logging
                  </FormLabel>
                  <Switch id="api-logging" colorScheme="blue" />
                </FormControl>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        <HStack spacing={4} mt={8} justifyContent="flex-end">
          <Button variant="outline">Cancel</Button>
          <Button colorScheme="blue" onClick={handleSave}>Save Settings</Button>
        </HStack>
      </Box>
    </Layout>
  );
} 