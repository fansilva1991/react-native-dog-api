/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useCallback} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
} from 'react-native';
import _ from 'lodash';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import useConstant from 'use-constant';
import {
  useAsync,
  useAsyncAbortable,
  useAsyncCallback,
  UseAsyncReturn,
} from 'react-async-hook';

import {Colors} from 'react-native/Libraries/NewAppScreen';

// Reference: https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
const useDebouncedSearch = searchFunction => {
  // Handle the input text state
  const [inputText, setInputText] = useState('');

  // Debounce the original search async function
  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 1000),
  );

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke
  const searchResults = useAsync(async () => {
    if (inputText.length === 0) {
      return [];
    } else {
      return debouncedSearchFunction(inputText);
    }
  }, [debouncedSearchFunction, inputText]);

  // Return everything needed for the hook consumer
  return {
    inputText,
    setInputText,
    searchResults,
  };
};

const useSearchDogs = () => useDebouncedSearch(text => filter(text));

const filter = async text => {
  try {
    if (text === '') {
      return [];
    } else {
      const dogList = await fetchDogList();

      const filteredDogs = dogList.filter(dog => {
        return dog.breed.toLowerCase().includes(text.toLowerCase());
      });
      const dogListWithImages = [];
      for (let i = 0; i < filteredDogs.length; i++) {
        const fd = filteredDogs[i];
        const dogWithImage = {
          breed: fd.breed,
          images: null,
        };
        const breedImages = await getImagesForBreed(fd.breed);
        dogWithImage.images = breedImages;
        dogListWithImages.push(dogWithImage);
      }
      return dogListWithImages;
    }
  } catch (error) {
    console.log('error', error);
    return [];
  }
};

const fetchDogList = async () => {
  let response = await fetch('https://dog.ceo/api/breeds/list/all');
  response = await response.json();
  const responseAsArray = [];
  for (var key in response.message) {
    if (response.message.hasOwnProperty(key)) {
      const dog = {
        breed: key,
        image: null,
      };
      responseAsArray.push(dog);
    }
  }
  return responseAsArray;
};

const getImagesForBreed = async dog => {
  try {
    const response = await fetch(`https://dog.ceo/api/breed/${dog}/images`);
    let dogImagesForBreed = await response.json();
    return dogImagesForBreed.message;
  } catch (error) {
    console.error(error);
  }
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [dogList, setDogList] = useState([]);
  // const [filteredList, setFilteredList] = useState([]);

  const {inputText, setInputText, searchResults} = useSearchDogs(dogList);

  useEffect(() => {
    console.log('searchResults', searchResults);
  }, [searchResults]);

  // useEffect(() => {
  //   fetchDogList().then(result => {
  //     setDogList(result);
  //     setFilteredList(result);
  //   });
  // }, []);

  // useEffect(() => {
  //   // doFilter(search);
  //   // delayedFilter(search);
  // }, [search, delayedFilter]);

  // const doFilter = useCallback(
  //   async text => {
  //     try {
  //       if (text === '') {
  //         setFilteredList([]);
  //       } else {
  //         setLoading(true);
  //         const filteredDogs = dogList.filter(dog => {
  //           return dog.breed.toLowerCase().includes(text.toLowerCase());
  //         });
  //         const dogListWithImages = [];
  //         for (let i = 0; i < filteredDogs.length; i++) {
  //           const fd = filteredDogs[i];
  //           const dogWithImage = {
  //             breed: fd.breed,
  //             images: null,
  //           };
  //           const breedImages = await getImagesForBreed(fd.breed);
  //           dogWithImage.images = breedImages;
  //           console.log('dogWithImage', dogWithImage);
  //           dogListWithImages.push(dogWithImage);
  //         }
  //         setFilteredList(dogListWithImages);
  //         setLoading(false);
  //         return dogListWithImages;
  //       }
  //     } catch (error) {
  //       console.log('error', error);
  //       setFilteredList([]);
  //       return;
  //     }
  //   },
  //   [dogList],
  // );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <TextInput
            style={{
              fontSize: 24,
              margin: 10,
              width: '90%',
              height: 50,
              backgroundColor: 'white',
              borderColor: 'black',
              borderWidth: 1,
              borderRadius: 10,
            }}
            value={inputText}
            onChangeText={text => {
              // setSearch(text);
              // delayedFilter(text);
              setInputText(text);
            }}
          />
          {searchResults.loading === true && (
            <View>
              <Text>Loading</Text>
            </View>
          )}
          {searchResults && (
            <View>
              <Text>{JSON.stringify(searchResults)}</Text>
            </View>
          )}
          {/* {filteredList && filteredList.length > 0 && (
            <View>
              {filteredList.map(item => {
                return <Text>{item.breed}</Text>;
              })}
            </View>
          )} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
