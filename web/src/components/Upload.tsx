import React, { useEffect, useState } from 'react';
import { Box, HStack, Image, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { useDropzone } from 'react-dropzone';
import { getPresignUrl } from '../hooks/usePresignUrl';
import { useMutation } from 'react-query';

const getColor = (props: any) => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isDragActive) {
    return '#2196f3';
  }
  return 'gray';
}

const Container = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  border-width: 1px;
  border-radius: 2px;
  border-color: ${(props: any) => getColor(props)};
  border-style: dashed;
  color: #bdbdbd;
  outline: none;
  transition: border .24s ease-in-out;
`;

const uploadHandler = async (url: string, file: any) => {
  try {
    await fetch(url.toString(), {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file?.type,
      },
    });
    console.log(`Upload file ${file.name} success!!!`);
  } catch (error) {
    console.error('Error:', error);
  }
};

// TODO: FIX ME!!!
const STORAGE_HOST = 'https://storage.datasean.com';

const Upload = (props: any) => {
  const { setFieldValue } = props;
  const [files, setFiles] = useState<any>([]);
  const mutation = useMutation(getPresignUrl);

  useEffect(() => () => {
    files.forEach((file: any) => URL.revokeObjectURL(file.preview))
  }, [files])

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    accept: "image/*",
    onDrop: async (acceptedFiles) => {
      try {
        const listFileName = acceptedFiles.map(file => file.name);
        const listPresignedUrls = await mutation.mutateAsync(listFileName) as any;

        await Promise.all(acceptedFiles.map(async (file: any) => {
          const url = listPresignedUrls.find((ele: any) => ele.path === file.name).url;
          await uploadHandler(url, file);
        }))
        setFiles(acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) })));
        setFieldValue('imageUrls', acceptedFiles.map(file => `${STORAGE_HOST}/${file.name}`));

      } catch (error: any) {
        console.log(error);
      }
    }
  });

  return (
    <Container {...getRootProps({ isDragReject, isDragAccept, isDragActive })}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <Text as="i">
          Thả hình ảnh vào đây
        </Text>
      ) : (
        <Text as="i">
          Kéo thả hình ảnh vào đây, hoặc "click" để chọn hình ảnh
        </Text>
      )}
      <HStack spacing={2} paddingTop={4}>
        {files.map((file: any, idx: number) =>
          <Image
            width="100px"
            fallbackSrc="https://via.placeholder.com/150"
            src={file.preview}
            alt="preview items"
            key={idx}
          />
        )}
      </HStack>

    </Container>
  );
};

export default Upload;
