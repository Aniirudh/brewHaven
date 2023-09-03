import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet,Image,  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SearchResults = ({ results, hideResults }) => {
  const navigation = useNavigation();
    
  const handleClick = (selectedBeer) => {
    console.log(selectedBeer.id);
    navigation.navigate('BeerDetails',{id: selectedBeer.id}); // Passing selectedMovie as a parameter
    hideResults();
  };

  console.log(results)

  return (
    <View style={styles.resultsList}>
      <ScrollView style={styles.scrollView}>
        <View style={{flex:1}}>
        {results.map((result, id) => (
          <TouchableOpacity key={id} onPress={() => handleClick(result)} style={styles.searchResult}>
            <View>
                            <Image source={{ uri: result?.image_url }} style={styles.itemImage} />
                        </View>
            <Text style={styles.resultText}>{result?.name}</Text>
          </TouchableOpacity>
        ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  resultsList: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white',
    color: '#ffffff',
    borderRadius: 10,
    marginTop: 110,
    maxHeight: "50%",
    zIndex: 1,
    elevation: 5,
    marginHorizontal:10,
    flex:1
  },
  scrollView: {
    flexGrow: 1,
  },
  searchResult: {
    padding: 10,
    cursor: 'pointer',
    borderBottomWidth: 1,
    borderBottomColor: 'silver',
    flexDirection:"row",
    alignItems:"center",
  },
  resultText: {
    color: 'black',
  },
  itemImage: {
    width: 50,
    height: 70,
    resizeMode: 'contain'
},
});

export default SearchResults
