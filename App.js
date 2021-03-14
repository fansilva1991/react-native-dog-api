/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import _ from 'lodash';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import useConstant from 'use-constant';
import {useAsync} from 'react-async-hook';
import {defaultData} from './defaultData';

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

const defaultDataToArray = data => {
  const responseAsArray = [];
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      const dog = {
        breed: key,
        image: null,
      };
      responseAsArray.push(dog);
    }
  }
  return responseAsArray;
};

const App: () => Node = () => {
  const backgroundStyle = {
    backgroundColor: Colors.lighter,
    flex: 1,
    justifyContent: 'center',
  };

  const {inputText, setInputText, searchResults} = useSearchDogs(defaultData);

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.viewContainer}>
        <TextInput
          style={styles.searchBox}
          value={inputText}
          onChangeText={text => {
            setInputText(text);
          }}
        />
        {searchResults.loading === true && (
          <View style={styles.loadingView}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {searchResults?.result?.length > 0 && (
          <FlatList
            data={searchResults.result}
            renderItem={({item}) => {
              return (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemBreedText}>{item.breed}</Text>
                  {item?.images && (
                    <ScrollView horizontal style={styles.itemImageContainer}>
                      {item.images.map((image, index) => {
                        return (
                          <Image
                            style={styles.itemImage}
                            source={{
                              uri: image,
                            }}
                          />
                        );
                      })}
                    </ScrollView>
                  )}
                </View>
              );
            }}
            keyExtractor={(item, index) => item.key}
            ItemSeparatorComponent={() => {
              return <View style={styles.separator} />;
            }}
          />
        )}
        {searchResults?.result?.length === 0 && (
          <FlatList
            data={defaultDataToArray(defaultData)}
            renderItem={({item}) => {
              return (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemBreedText}>{item.breed}</Text>
                  {item?.images && (
                    <ScrollView horizontal style={styles.itemImageContainer}>
                      {item.images.map((image, index) => {
                        return (
                          <Image
                            style={styles.itemImage}
                            source={{
                              uri: image,
                            }}
                          />
                        );
                      })}
                    </ScrollView>
                  )}
                </View>
              );
            }}
            keyExtractor={(item, index) => item.key}
            ItemSeparatorComponent={() => {
              return <View style={styles.separator} />;
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  searchBox: {
    fontSize: 24,
    margin: 8,
    width: '90%',
    height: 50,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
  },
  loadingView: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  itemContainer: {
    marginStart: 8,
  },
  itemBreedText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemImageContainer: {flexDirection: 'row'},
  itemImage: {width: 75, height: 75, margin: 4},
  separator: {height: 16},
});

export default App;
