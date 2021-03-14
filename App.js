/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {defaultData} from './defaultData';
import {fetchImageForBreed, fetchDogList} from './src/services/index';
import {defaultDataToArray} from './src/utils/index';
import {useDebouncedSearch} from './src/hooks/index';
import {ListItem} from './src/components/list-item/index';

import {Colors} from 'react-native/Libraries/NewAppScreen';

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
        const breedImages = await fetchImageForBreed(fd.breed);
        dogWithImage.images = breedImages;
        dogListWithImages.push(dogWithImage);
      }
      return dogListWithImages;
    }
  } catch (error) {
    return [];
  }
};

const App = () => {
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
              return <ListItem item={item} />;
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
              return <ListItem item={item} />;
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
  separator: {height: 16},
});

export default App;
