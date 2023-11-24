import { StyleSheet, Text, View, TouchableOpacity, FlatList, onPress } from 'react-native'
import React, { useState } from 'react'
import SearchBox from '../components/SearchBox'
import SearchResults from '../components/SearchResults'
import Icon from 'react-native-vector-icons/Ionicons'

const Search = ({ navigation, route }) => {
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [input, setInput] = useState("");
  const beer = route.params.data;
  console.log(beer);

  const handleResults = (data) => {
    setResults(data);
    setShowResults(true);
  };

  const hideResults = () => {
    setShowResults(false);
    setInput("");
  };

  // Extract beer names from the array
  const beerNames = beer.map((item) => item.name);

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ margin: 10 }}>
        <Icon name="arrow-back" color="black" size={30} />
      </TouchableOpacity>
      <SearchBox
        fetchUrl={`http://54.89.234.175:8080/beers`}
        onResults={handleResults}
        input={input}
        setInput={setInput}
      />
      <View style={styles.suggestionsContainer}>
        <Text style={styles.header}>Top Rated in Beer</Text>
        <FlatList
          data={beerNames}
          numColumns={2} // Set the number of columns to 2
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.topSearches} key={item.id}>
              <Icon name="repeat" size={20} color="#4f4f4f" />
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          )}
          columnWrapperStyle={styles.columnWrapper} // Style for wrapping columns
        />
      </View>
      {showResults && (
        <SearchResults results={results} hideResults={hideResults} />
      )}
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
  header: {
    color: "#4f4f4f",
    fontFamily: "Metropolis-Medium",
    fontSize: 15
  },
  text: {
    color: "#7f7f7f"
  },
  suggestionsContainer: {
    top: 50,
    marginVertical: 15,
    marginHorizontal: 15,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "white",
  },
  topSearches: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7f7f7f",
    maxWidth: "50%",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    marginVertical: 10,
    flexWrap: "wrap"
  },
  columnWrapper: {
    justifyContent: "space-between", // Adjust the space between columns
  },
});
