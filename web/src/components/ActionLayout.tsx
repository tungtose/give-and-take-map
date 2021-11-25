import React from 'react';
import { Button, Center, HStack, VStack } from '@chakra-ui/react';

function Action() {
  return (
    <VStack spacing={4} alignItems="center" pos="absolute" zIndex="1" w="100vw">
      <Button colorScheme="red"> ABC </Button>
    </VStack>
  )
}

export default Action;
