import React, { useEffect, useState } from 'react';
import { Button, HStack, Input, InputGroup, InputLeftElement, InputRightElement, VStack } from '@chakra-ui/react';
import ReceiveModal from './ReceiveModal';
import GiveModal from './GiveModal';
import SearchInput from './SearchInput';


function Action({ setOneLoc, oneLoc, setViewport }: { setOneLoc: any, oneLoc: any, setViewport: any }) {
  return (
    <>
      <SearchInput setViewport={setViewport} />
      <HStack spacing={[2, 4]} padding={[2, 4]} justifyContent="center" pos="absolute" bottom={[20, 0]} zIndex="1" w="full">
        <GiveModal />
        <ReceiveModal />
      </HStack>
    </>
  )
}

export default React.memo(Action, (prev, next) => prev.oneLoc === next.oneLoc);
