import React, { useEffect, useState } from 'react';
import { Button, Center, HStack, Input, InputGroup, InputLeftElement, InputRightElement, VStack } from '@chakra-ui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AiOutlineSearch, AiOutlineClose, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { MdCall, MdLocationSearching, MdPlusOne } from 'react-icons/md';
import useSearchPost from '../hooks/useSearchPost';
import { useDebounce } from 'react-use';
import ReceiveModal from './ReceiveModal';
import GiveModal from './GiveModal';

type SearchType = 'phone' | 'address';

function Action({ setOneLoc, oneLoc }: { setOneLoc: any, oneLoc: any }) {
  const [searchType, setSearchType] = useState<SearchType>('phone');
  const [searchInput, setSearchInput] = useState<string | null>(null);
  const [input, setInput] = useState<string | null>(null);
  const searchRes = useSearchPost({ searchInput, searchType });
  const searchPlaceHolder = searchType === 'address' ? "Address" : "Phone number"


  const [, cancel] = useDebounce(
    () => {
      setSearchInput(input)
    },
    800,
    [input]
  )

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInput(event.target.value);
  }

  useEffect(() => {
    if (searchRes.isError) setOneLoc(null);

    console.log("==== DEBUG searchRes", searchRes);

    if (searchRes.data) setOneLoc(searchRes.data);

  }, [searchRes.data, searchRes.isError])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log("======MATCHING")
      if (input?.length === 0) {
        setOneLoc(null);
        return;
      }
      searchRes.refetch();
    }
  }

  console.log("[ActionLAyout]: RERENDER");

  return (
    <>
      <VStack spacing={4} padding={2} alignItems="center" pos="absolute" zIndex="1" w="100vw">
        <HStack>
          <Button
            colorScheme={searchType === 'address' ? 'blue' : 'gray'}
            size="sm"
            borderRadius={14}
            onClick={() => setSearchType('address')}
            width={100}
            leftIcon={<MdLocationSearching />}
          >
            Address
          </Button>
          <Button
            colorScheme={searchType === 'phone' ? 'blue' : 'gray'}
            borderRadius={14}
            width={120}
            size="sm"
            onClick={() => setSearchType('phone')}
            leftIcon={<MdCall />}
          >
            Phone
          </Button>
        </HStack>

        <InputGroup size="md" w="100px">
          <InputLeftElement
            pointerEvents="none"
            children={<AiOutlineSearch />}
          />
          <Input
            id="searchInput"
            border={1}
            placeholder={searchPlaceHolder}
            background="gray.500"
            value={input || ''}
            onChange={onChangeInput}
            onKeyDown={handleKeyDown}
          />
          {input &&
            <InputRightElement
              children={<AiOutlineClose onClick={(() => setInput(''))} />}
            />
          }
        </InputGroup>
      </VStack >

      <HStack spacing={4} padding={4} justifyContent="center" pos="absolute" bottom={0} zIndex="1" w="full">
        <GiveModal />
        <ReceiveModal />
      </HStack>
    </>
  )
}

export default React.memo(Action, (prev, next) => prev.oneLoc === next.oneLoc);
