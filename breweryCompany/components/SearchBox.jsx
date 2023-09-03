import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'


const SearchBox = ({ fetchUrl, onResults }) => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);

  const getData = async (value) => {
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`Response not OK: ${response.status}`);
      }
      const data = await response.json();
      
      if (!data) {
        throw new Error("Results array not found in response data");
      }
    //   console.log(data)
      const movies = data.filter((item) => {
        const actual_name = item?.name;
        // console.log(value)
        return (
          value &&
          actual_name &&
          actual_name.toLowerCase().includes(value.toLowerCase())
        );
      });
  console.log(movies)
      onResults(movies);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getData(input);
  }, [input]);

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
      <Icon name="search" size={30} color='#ED5A6B'/>
        <TextInput
          style={styles.searchbox}
          value={input}
          placeholder="Search Movies"
          onChangeText={(value) => setInput(value)}
          placeholderTextColor="#a8a8a8"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:"center",
    // justifyContent:"center"
  },
  inputWrapper: {
    backgroundColor: 'white',
    width: '95%',
    borderRadius: 15,
    height: 40,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal:10,
    marginVertical:10
  },
  searchbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    height: '100%',
    fontSize: 16,
    flex: 1,
    // marginLeft: 5,
    color: 'black',
    fontFamily:"Metropolis-Medium  "
  },
});

export default SearchBox;
