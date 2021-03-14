import React from 'react';
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

const styles = StyleSheet.create({
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

export const ListItem = ({item}) => {
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
};
