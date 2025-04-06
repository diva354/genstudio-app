import './App.css';
import React, {useState} from 'react';
import { Provider, defaultTheme, View, TextField, Button, Text, Form, Header, Heading, Flex } from '@adobe/react-spectrum';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  
  const handleConvert = async () => {
    setResponse('');
    setError('');
    setisLoading(true);
    if (!input || isNaN(input) || input < 1 || input > 3999) {
      setError('Input Invalid. Please enter a valid whole number between 1 and 3999.');
      setisLoading(false);
      return;
    }

    try {
      /*const response = await fetchWithTimeout(`http://localhost:8080/romannumeral?query=${input}`,{}, 5000);*/
      const response = await axios.get('http://localhost:8080/romannumeral', {
        params: { query: input },
        timeout: 5000, // optional timeout in ms
      });

      if (response.data?.output) {
        setResponse(response.data.output);
      } else {
        setError('Invalid response from server.');
      }
      /*if (!response.ok) {
        const { errorMessage, statusCode } = await response.json();
        
        switch(statusCode) {
          case 400:
            setError(errorMessage || 'Bad Request');
            break;
          case 500:
            setError(errorMessage || 'Internal Server Error');
            break;
          default:
            setError(errorMessage || 'Unexpected Error');
            break;
        }

        return;
      }
      const data = await response.json();
      setResponse(data.output);*/
    } catch (err) {
      debugger
      /*console.error(err.message);
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('Unable to reach server. You might be offline or facing a CORS issue.');
      } else if (err.message === 'Request timed out') {
        setError('Sorry your request timed out. Please try again.')
      } else {
        setError('Unexpected error occurred.');
      }*/
      if (err.response) {
        // Server responded with a non-2xx status
        const { statusText, status } = err.response;

        switch (status) {
          case 400:
            setError(statusText || 'Bad Request');
            break;
          case 500:
            setError(statusText || 'Internal Server Error');
            break;
          default:
            setError(statusText || `Unexpected error (code ${status})`);
            break;
        }

      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (!navigator.onLine) {
        // User is offline
        setError('You appear to be offline. Please check your internet connection.');
      } else {
        // Generic fallback
        setError('Something went wrong. Unable to reach the server.');
      }
    } finally {
      setisLoading(false);
    }
  };
  return (
    <>
      <Provider theme={defaultTheme} scale='large'>
        <View padding="size-400" width="auto" height="50%" justifySelf={'center'}>
          <Flex direction="column" alignItems='start' justifyContent={'center'}>
            <Heading>Roman numeral converter </Heading>
                {input === '9999' && (() => { throw new Error('Simulated render crash'); })()}
                <TextField
                  label="Enter a number"
                  value={input}
                  onChange={setInput}
                  type="number"
                  width="size-3000"
                  validationState={!!error ? 'invalid' : undefined}
                  errorMessage={error}
                />
                <Button variant="primary" onPress={handleConvert} marginTop="size-200" width='size-2500' isPending={isLoading} isDisabled={isLoading}>
                  Convert to roman numeral
                </Button>

                <Flex marginTop="size-300" maxWidth="size-3000">
                  {/* {error && <Text UNSAFE_style={{ color: 'red' }}>{error}</Text>} */}
                  {response && <Text>Roman numeral: {response}</Text>}
                </Flex>
          </Flex>
        </View>
      </Provider>
    </>
  );
}

export default App;
