import { useEffect, useState } from 'react';
import usePost from '../hooks/usePost';
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
} from '@chakra-ui/react'

function PostDetail({ postId }: { postId: string }) {
  const { status, data, error, isFetching } = usePost(postId);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (postId) {
      onOpen()
    }
  }, [postId])

  return (
    <div>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>
              {`postId: ${postId}`}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default PostDetail;
