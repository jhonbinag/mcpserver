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
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Layout>
        <Container maxW={'5xl'}>
          <Box textAlign="center" py={20}>
            <Text>Loading...</Text>
          </Box>
        </Container>
      </Layout>
    );
  }

  return null;
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