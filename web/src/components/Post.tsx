import React, { useEffect, useState } from 'react';
import usePost from '../hooks/usePost';
import { getUnitById } from '../hooks/useUnits';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Text,
  HStack,
  Flex,
  Spinner,
  VStack,
  Image,
  StackDivider,
  Link,
} from '@chakra-ui/react'
import { format } from 'date-fns';
import { MdOutlineCall } from 'react-icons/md';

function PostDetail({ postId, setPostId }: { postId: string, setPostId: any }) {
  const { status, data, error, isFetching } = usePost(postId);
  console.log("[PostId]:", data);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (postId) {
      onOpen()
    }
  }, [postId])

  const headerText = "Thông Tin Liên Lạc";

  const handleOnClose = () => {
    setPostId('');
    onClose();
  }

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={handleOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{headerText}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {isFetching && <Spinner size="sm" />}
          {
            status === "success" &&
            <VStack spacing={4} divider={<StackDivider borderColor="gray.600" />}>
              <VStack spacing={2} w="full">
                {
                  data.items.map((item: any) =>
                    <Flex flexDir="row" justifyContent="space-between" width="100%">
                      <Text>{item.item?.name || "unknown"}:</Text>
                      <Text> {item.amount} {getUnitById(item.item?.unit)}</Text>
                    </Flex>
                  )
                }
              </VStack>


              {/* ****INFO****  */}
              <VStack spacing={2} width="full">
                <Flex flexDir="row" justifyContent="space-between" width="100%">
                  <Text>Họ và tên:</Text>
                  <Text> {data.name} </Text>
                </Flex>
                <Flex flexDir="row" justifyContent="space-between" width="100%">
                  <Text>Số điện thoại:</Text>
                  <Text>
                    <Link href={`tel:${data.phoneNumber}`} isExternal color='teal.500'>
                      <HStack alignItems="center" spacing={1}>
                        <Text> {`${data.phoneNumber.slice(0, -4)}xxxx`} </Text>
                        <MdOutlineCall />
                      </HStack>
                    </Link>
                  </Text>
                </Flex>
                <Flex flexDir="row" justifyContent="space-between" width="100%">
                  <Text>Địa chỉ:</Text>
                  <Text>{data.address}</Text>
                </Flex>
                <Flex flexDir="row" justifyContent="space-between" width="100%">
                  <Text>Ngày tạo:</Text>
                  <Text> {format(new Date(data.createdAt), 'dd/MM/yyyy')} </Text>
                </Flex>
                <Flex flexDir="column" width="100%">
                  <Text>Ghi chú:</Text>
                  <Text as="i">· {data.note} </Text>
                </Flex>
                <Flex flexDir="column" width="100%">
                  <Text>Hình ảnh:</Text>
                  <HStack width="100%" overflowX="auto">
                    {
                      data.imageUrls?.map((url: string) =>
                        <Image
                          fallbackSrc='https://via.placeholder.com/100'
                          boxSize="100px"
                          alt="Image detail"
                          objectFit="cover"
                          src={url}
                        />
                      )
                    }
                  </HStack>
                </Flex>
              </VStack>
            </VStack>
          }
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleOnClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default React.memo(PostDetail);
