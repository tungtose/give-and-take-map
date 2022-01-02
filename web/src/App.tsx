import { ChakraProvider } from "@chakra-ui/react"
import theme from './theme';
import Map from './components/Map';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import GlobalLoadingIndicator from "./components/GlobalLoading";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

function App() {

  return (
    <ChakraProvider theme={theme} resetCSS >
      <QueryClientProvider client={queryClient}>
        <GlobalLoadingIndicator />
        <Map />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default App




