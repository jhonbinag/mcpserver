import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from '../components/AuthContext';
import '../styles/globals.css';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

// Extend the theme to include custom colors, fonts, etc
const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      500: '#0099ff',
      600: '#0077cc',
      700: '#005999',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
});

// Add authentication check wrapper
function AuthCheck({ children }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Don't redirect if we're on the login page or if we're still loading
    if (!loading && !isAuthenticated && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading state while checking authentication
  if (loading && router.pathname !== '/login') {
    return (
      <Box textAlign="center" py={20}>
        <Text>Loading...</Text>
      </Box>
    );
  }

  return children;
}

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <AuthCheck>
          <Component {...pageProps} />
        </AuthCheck>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp; 