import './App.css';
import React, {useState, useEffect} from 'react';
import { Provider, defaultTheme, View, TextField, Button, Heading, Flex, InlineAlert, Form } from '@adobe/react-spectrum';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [inputError, setInputError] = useState(null); // Separating Input and SErver/System errors so its clear if its Frontend or Backend error
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (serverError) {
      document.getElementById('server-error-msg')?.focus();
    }
  }, [serverError]);
  const handleConvert = async (e) => {
    e.preventDefault();
    setResponse('');
    setInputError('');
    setServerError('');
    setIsLoading(true);
    if (!input || isNaN(input) || input < 1 || input > 3999) {
      setInputError('Input Invalid. Please enter a valid whole number between 1 and 3999.'); // first layer - Frontend validation before hits Backend 
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:8080/romannumeral', {
        params: { query: input },
        timeout: 5000, // optional timeout in ms
      });

      if (response.data?.output) {
        setResponse(response.data.output);
      } else {
        setServerError('Invalid response from server.'); // In case of invalid json response
      }
    } catch (err) {
      if (err.response) {
        // Server responded with a non-2xx status
        const { statusText, status } = err.response;
        const { errorMessage, field } = err.response.data || {};
        const message = errorMessage || statusText;
        switch (status) {
          case 400:
            if(field === 'query'){
              setInputError(errorMessage || 'Invalid Input'); // In case of any invalid request
            }else {
              setServerError(message || 'Bad Request')
            }
            break;
          case 500:
            setServerError(message || 'Internal Server Error'); // In case of something going wrong with the server
            break;
          default:
            setServerError(message || `Unexpected error (code ${status})`); //Any unexpected error
            break;
        }

      } else if (err.code === 'ECONNABORTED') {
        setServerError('Request timed out. Please try again.'); // Axios returning request time out error
      } else if (!navigator.onLine) {
        setServerError('You appear to be offline. Please check your internet connection.'); // User is offline
      } else {
        setServerError('Something went wrong. Unable to reach the server.');  // Generic fallback
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
      <Provider theme={defaultTheme} scale='large'>
        <View padding="size-400" width="auto" height="50%" justifySelf={'center'}>
          <Flex direction="column" alignItems='start' justifyContent={'center'}>
            <Heading>Roman numeral converter </Heading>
            <Form onSubmit={handleConvert} necessityIndicator='label'> 
              <TextField
                label="Enter a number"
                isRequired
                value={input}
                onChange={setInput}
                type="number"
                width="size-3000"
                validationState={inputError ? 'invalid' : undefined}
                errorMessage={inputError}
                autoFocus
              />
              <div
                aria-keyshortcuts="Enter"
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  height: '1px',
                  width: '1px',
                  overflow: 'hidden'
                }}
              >
                Press Enter to convert the number to Roman numeral
              </div>

              <Button type="submit" variant="primary" marginTop="size-200" width='size-2500' isPending={isLoading} isDisabled={isLoading}>
                Convert to roman numeral
              </Button>
            </Form>
                

                <Flex marginTop="size-300" maxWidth="size-3000">
                  {serverError && (
                    <InlineAlert variant="notice" role="alert" aria-live="polite" id="server-error-msg"
                    tabIndex="-1">
                      <Heading>System Error</Heading>
                      {serverError}
                    </InlineAlert>
                  )}
                  {response && (
                    <InlineAlert data-testid="conversion-result" variant="info" margin={"size-100"} role="status" aria-live="polite">
                      Roman numeral: {response}
                    </InlineAlert>
                  )}
                </Flex>
          </Flex>
        </View>
      </Provider>
  );
}

export default App;
