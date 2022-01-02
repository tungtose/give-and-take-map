import React, { useEffect, useState } from 'react';
import {
  Select,
  AsyncSelect,
  CreatableSelect,
  AsyncCreatableSelect,
} from "chakra-react-select";
import { useAutoCompleteAddress, getAutoComplete, getAddressDetail } from '../hooks/useAutoCompleteAddress';
import debounce from 'debounce-promise';


const _getOptions = async (inputValue: string, callback: any) => {
  console.log("getOptions", inputValue);
  if (!inputValue) return callback([]);
  const data = await getAutoComplete(inputValue);
  if (data) {
    const options = data.predictions.map((predict: any) => ({ value: predict.place_id, label: predict.description }))
    console.log("OPTIONS", options);
    callback(options);
  }
}

const getOptions = debounce(_getOptions, 500);

function AddressInput({ setFieldValue }: { setFieldValue: any }) {

  const onChange = (newValue: string) => {
    return newValue;
  }

  const handleChange = async (option: any) => {
    if (option.value) {
      const addressDetail = await getAddressDetail(option.value);
      console.log("addressDetail", addressDetail);
      setFieldValue('address', option.label);
      setFieldValue('loc', addressDetail.result?.geometry?.location);
    }
  }

  return (
    <AsyncSelect
      onChange={handleChange}
      onInputChange={onChange}
      loadOptions={getOptions}
    />
  )
}

export default AddressInput;
