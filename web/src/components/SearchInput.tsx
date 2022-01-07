import { useCallback, useEffect, useState } from 'react';
import { Button, HStack, useToast, VStack } from '@chakra-ui/react';
import { MdCall, MdLocationSearching } from 'react-icons/md';
import { useDebounce } from 'react-use';
import useSearchPost from '../hooks/useSearchPost';
import {
  AsyncSelect,
  ChakraStylesConfig,
} from "chakra-react-select";
import { getAutoComplete, getAddressDetail } from '../hooks/useAutoCompleteAddress';
import debounce from 'debounce-promise';

type SearchType = 'phone' | 'address';

const _getOptions = async (inputValue: string, callback: any) => {
  if (!inputValue) return callback([]);
  const data = await getAutoComplete(inputValue);
  if (data) {
    const options = data.predictions.map((predict: any) => ({ value: predict.place_id, label: predict.description }))
    callback(options);
  }
}

const getOptions = debounce(_getOptions, 500);

function SearchInput(props: any) {
  const [searchType, setSearchType] = useState<SearchType>('address');
  const [searchInput, setSearchInput] = useState<string | null>(null);
  const [input, setInput] = useState<string | null>(null);
  const toast = useToast();
  const searchRes = useSearchPost({ searchInput, searchType });

  const [, _cancel] = useDebounce(
    () => {
      setSearchInput(input)
    },
    300,
    [input]
  )

  const chakraStyles = useCallback((searchType: string): ChakraStylesConfig => ({
    dropdownIndicator: (provided) => ({
      ...provided,
      display: 'none',
      p: 0,
      w: "40px",
    }),
    container: (provided) => ({ ...provided, w: ["85%", "500px", "700px"], borderColor: 'gray.500' }),
    menu: (provided) => ({
      ...provided,
      display: searchType === "phone" ? 'none' : 'block'

    }),
  }), [searchType]);


  useEffect(() => {
    if (searchRes.data) {
      const { lat, lng } = searchRes.data;
      props.setViewport({
        latitude: lat,
        longitude: lng,
        zoom: 18,
        bearing: 0,
        pitch: 0,
        transitionDuration: 500,
      })
    }

    if (searchRes.isError) {
      toast({
        status: 'error',
        isClosable: true,
        title: "Không tìm thấy số điện thoại",
      })
    }
  }, [searchRes.data, searchRes.isError])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log("======MATCHING")
      if (input?.length === 0) {
        // setOneLoc(null);
        return;
      }
      searchRes.refetch();
    }
  }

  const onChange = (newValue: string) => {
    console.log("newValue", newValue);
    if (searchType === 'phone') {
      setInput(newValue);
    }
    return newValue;
  }

  const handleChange = async (option: any) => {
    if (option.value) {
      const addressDetail = await getAddressDetail(option.value);
      if (addressDetail.result) {
        const { location } = addressDetail.result?.geometry;
        props.setViewport({
          latitude: location.lat,
          longitude: location.lng,
          zoom: 18,
          bearing: 0,
          pitch: 0,
          transitionDuration: 500,
        })
      }
    }
  }
  return (
    <VStack spacing={4} padding={2} alignItems="center" pos="absolute" zIndex="1" w="100vw">
      <HStack>
        <Button
          colorScheme={searchType === 'address' ? 'blue' : 'gray'}
          size="sm"
          borderRadius={14}
          onClick={() => setSearchType('address')}
          width={120}
          leftIcon={<MdLocationSearching />}
        >
          Địa chỉ
        </Button>
        <Button
          colorScheme={searchType === 'phone' ? 'blue' : 'gray'}
          borderRadius={14}
          width={120}
          size="sm"
          onClick={() => setSearchType('phone')}
          leftIcon={<MdCall />}
        >
          Số điện thoại
        </Button>
      </HStack>
      <AsyncSelect
        chakraStyles={chakraStyles(searchType)}
        noOptionsMessage={() => searchType === 'phone' ? false : "Không tìm thấy địa chỉ"}
        loadingMessage={() => "Đang tìm kiếm..."}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        isClearable
        onInputChange={onChange}
        loadOptions={searchType === 'address' ? getOptions : false}
        placeholder={searchType === 'phone' ? "0355212xxx" : "Hồ Chí Minh"}
      />
    </VStack >
  )
}
export default SearchInput;
