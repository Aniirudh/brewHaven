import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import SearchBox from '../components/SearchBox'
import SearchResults from '../components/SearchResults'
import Icon from 'react-native-vector-icons/Ionicons'

const Search = ({navigation}) => {

    const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [input, setInput] = useState("");

  const handleResults = (data) => {
    setResults(data);
    setShowResults(true);
  };

  const hideResults = () => {
    setShowResults(false);
    setInput("");
  };
  console.log(results)
  return (
    <View>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{margin:10}}>
        <Icon name="arrow-back" color="black" size={30}/>
        </TouchableOpacity>
      <SearchBox
        fetchUrl={`https://api.punkapi.com/v2/beers`}
        onResults={handleResults}
        input={input}
        setInput={setInput}
      />
      <View style={styles.suggestionsContainer}>
        <Text style={styles.header}>Top Searches in Beer</Text>
        <View style={{flexDirection:"row"}}>
        <TouchableOpacity style={styles.topSearches}>
            <Icon name="repeat" size={20} color="#4f4f4f"/>
            <Text style={styles.text}>Buzz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topSearches}>
            <Icon name="repeat" size={20} color="#4f4f4f"/>
            <Text style={styles.text}>Movember</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.topSearches}>
            <Icon name="repeat" size={20} color="#4f4f4f"/>
            <Text style={styles.text}>Berliner Weisse With Yuzu</Text>
        </TouchableOpacity>
        </View>
      </View>
      
      {showResults && (
        <SearchResults results={results} hideResults={hideResults} />
      )}
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
    header:{
        color:"#4f4f4f",
        fontFamily:"Metropolis-Medium",
        fontSize:15
    },
    text:{
        color:"#7f7f7f"
    },
    suggestionsContainer:{
        top:50,
        marginVertical:15,
        marginHorizontal:15,
        backgroundColor:"white",
        paddingVertical:10,
        paddingHorizontal:10,
        borderWidth:1,
        borderRadius:10,
        borderColor:"white",

    },
    topSearches:{
        flexDirection:"row",
        alignItems:"center",
        borderWidth:1,
        borderColor:"#7f7f7f",
        width:"auto",
        borderRadius:15,
        paddingHorizontal:10,
        paddingVertical:5,
        marginHorizontal:5,
        marginVertical:10,
        justifyContent:"space-between",
        flexWrap:"wrap"
    }
})