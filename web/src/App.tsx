import { useState } from 'react'
import { ChakraProvider } from "@chakra-ui/react"
import { Button } from '@chakra-ui/react';
import theme from './theme';
import Map from './components/Map';
function App() {

  return (
    <ChakraProvider theme={theme} resetCSS>

      <Map> </Map>

    </ChakraProvider>
  )
}

export default App




