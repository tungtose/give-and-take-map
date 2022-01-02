import React, { useEffect } from 'react';
import {
  useToast,
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
  VStack,
  StackDivider,
  FormControl,
  FormLabel,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  Textarea,
  InputGroup,
  Input,
} from '@chakra-ui/react'
import * as R from 'ramda';
import { AiOutlineMinus } from 'react-icons/ai';
import { Field, Form, Formik } from 'formik';
import useItems from '../hooks/useItems';
import Upload from './Upload';
import { useMutation } from 'react-query';
import { createPost } from '../hooks/useCreatePost';
import AddressInput from './AddressInput';


const transformInput = (formValues: any, serverItems: any) => {
  const temp = R.groupBy((d: any) => d.slug, serverItems.necessities);
  const items = Object.keys(formValues.item).map(key => {
    return {
      amount: parseInt(formValues.item[key]),
      // @ts-ignore
      item: R.prop('_id', R.prop(0, temp[key])) as any
    }
  })
  return { ...formValues, type: 'receive', items };
}

function ReceiveModal() {
  const mutateCreatePost = useMutation(createPost);
  const { isFetching, data, error } = useItems();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const headerText = "Bạn muốn nhận gì?";

  useEffect(() => {
    const { isError, isSuccess } = mutateCreatePost;
    if (isSuccess) {
      toast({
        status: 'success',
        isClosable: true,
        title: "Thêm bài đăng thành công",
      })
    }
    if (isError) {
      console.log(mutateCreatePost.error);
      toast({
        status: 'error',
        isClosable: true,
        title: "Thêm bài đăng thất bại",
        // description: mutateCreatePost?.error.toString() as unknown as string
      })
      mutateCreatePost.reset()
    }
  }, [mutateCreatePost.isSuccess, mutateCreatePost.isError])

  if (isFetching) return <> ... </>

  console.log("ReceiveModal: rerender")
  return (
    <>
      <Button
        colorScheme={"red"}
        size="sm"
        borderRadius={14}
        onClick={onOpen}
        width={150}
        leftIcon={<AiOutlineMinus />}
      >
        Tôi muốn nhận
      </Button>
      <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <Formik
          initialValues={{}}
          onSubmit={async (values, actions) => {
            const input = transformInput(values, data);
            console.log("Submit", input);
            await mutateCreatePost.mutateAsync(input);
            actions.resetForm();
          }}
        >
          {(props) =>
            <Form style={{ width: "100%" }}>
              <ModalContent>
                <ModalHeader>{headerText}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <VStack spacing={2} alignItems="flex-start" w="full" divider={<StackDivider borderColor="gray.600" />}>
                    <VStack spacing={4} w="full" alignItems="flex-start" pb={14}>
                      <Text fontSize="lg">Nhu yếu phẩm</Text>
                      <Divider color="gray.600" />
                      {data.necessities && data.necessities.map((item: any) =>
                        <Field name={item.slug} key={item._id}>
                          {({ field, form }: { field: any, form: any }) => (
                            <FormControl isInvalid={form.errors.name && form.touched.name}>
                              <FormLabel htmlFor={item.slug}>{item.name}</FormLabel>
                              <NumberInput max={100} min={0} onChange={(valueString: string) => { return props.setFieldValue(`item.${item.slug}`, valueString) }}>
                                <NumberInputField placeholder="Số lượng" />
                                <NumberInputStepper >
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      )}
                    </VStack>

                    <VStack spacing={4} w="full" alignItems="flex-start" >
                      <Text fontSize="lg">Thông tin liên lạc</Text>
                      <Divider color="gray.600" />
                      <Field name="name">
                        {({ field, form }: { field: any, form: any }) => (
                          <FormControl isInvalid={form.errors.name && form.touched.name}>
                            <FormLabel htmlFor="name">Họ và tên</FormLabel>
                            <InputGroup>
                              <Input {...field} id="name" placeholder="Trần Đức Nam" />
                            </InputGroup>
                            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="address">
                        {({ field, form }: { field: any, form: any }) => (
                          <FormControl isInvalid={form.errors.name && form.touched.name}>
                            <FormLabel htmlFor="address">Địa chỉ</FormLabel>
                            <AddressInput setFieldValue={props.setFieldValue} />
                            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="phoneNumber">
                        {({ field, form }: { field: any, form: any }) => (
                          <FormControl isInvalid={form.errors.name && form.touched.name}>
                            <FormLabel htmlFor="phoneNumber">Số điện thoại</FormLabel>
                            <InputGroup>
                              <Input {...field} id="phoneNumber" placeholder="0355212xxx" />
                            </InputGroup>
                            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="note">
                        {({ field, form }: { field: any, form: any }) => (
                          <FormControl isInvalid={form.errors.name && form.touched.name}>
                            <FormLabel htmlFor="note">Hoàn cảnh</FormLabel>
                            <InputGroup>
                              <Textarea {...field} resize="vertical" size="sm" placeholder="Chi tiết hoàn cảnh" />
                            </InputGroup>
                            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <FormLabel htmlFor="images"> Hình ảnh </FormLabel>
                      <Upload setFieldValue={props.setFieldValue} />
                    </VStack>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme='blue' mr={3} type='submit' disabled={props.isSubmitting}>
                    Tiếp tục
                  </Button>
                  <Button onClick={onClose} disabled={props.isSubmitting}>Huỷ</Button>
                </ModalFooter>
              </ModalContent>
            </Form>
          }
        </Formik>
      </Modal>
    </>
  )
}

export default React.memo(ReceiveModal);
