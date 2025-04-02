import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Icon,
  SimpleGrid,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useAuth } from '../components/AuthContext';
import Layout from '../components/Layout';

// Simple icon component for features
const FeatureIcon = (props) => {
  return (
    <Flex
      align="center"
      justify="center"
      w={12}
      h={12}
      rounded="md"
      bg="brand.500"
      color="white"
      {...props}
    >
      {props.children}
    </Flex>
  );
};

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <Layout>
      <Container maxW={'5xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 10, md: 20 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            MCP Server <br />
            <Text as={'span'} color={'brand.500'}>
              Control Dashboard
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            Access and control your MCP servers in one place. Send commands, view responses,
            and monitor your server performance with our intuitive dashboard.
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <Button
              colorScheme={'blue'}
              bg={'brand.500'}
              rounded={'full'}
              px={6}
              _hover={{
                bg: 'brand.600',
              }}
              onClick={() => router.push(isAuthenticated ? '/dashboard' : '/login')}>
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </Button>
          </Stack>
        </Stack>

        <Box py={12}>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Feature
              icon={
                <FeatureIcon>
                  <Text fontWeight="bold">MCP</Text>
                </FeatureIcon>
              }
              title={'Control Multiple MCPs'}
              text={'Access all your MCP servers from a single dashboard. Switch between servers with a click.'}
            />
            <Feature
              icon={
                <FeatureIcon>
                  <Text fontWeight="bold">AI</Text>
                </FeatureIcon>
              }
              title={'Intelligent Routing'}
              text={'Messages are automatically routed to the most appropriate MCP server based on content.'}
            />
            <Feature
              icon={
                <FeatureIcon>
                  <Text fontWeight="bold">API</Text>
                </FeatureIcon>
              }
              title={'API Integration'}
              text={'Easily integrate with existing systems through our RESTful API endpoints.'}
            />
          </SimpleGrid>
        </Box>
      </Container>
    </Layout>
  );
}

function Feature({ title, text, icon }) {
  return (
    <Stack align={'center'} textAlign={'center'}>
      {icon}
      <Heading fontSize={'xl'}>{title}</Heading>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
}