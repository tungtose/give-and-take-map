import { Box, Spinner, VStack } from '@chakra-ui/react'
import { useIsFetching } from 'react-query'

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching()

  return isFetching ? (
    <VStack spacing={4} padding={2} alignItems="end" pos="absolute" zIndex="1" w="100vw">
      <Spinner color='#63B3ED' />
    </VStack>
  ) : null
}

export default GlobalLoadingIndicator
