import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ScrollView,
  StatusBar,
  TouchableNativeFeedback,
  TouchableOpacity,ToastAndroid,
  BackHandler
} from 'react-native';

// import Voice
import Voice from 'react-native-voice';
import dark_theme from '../constants/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PulseLoader from 'react-native-pulse-loader';
import Home from './Home';
import Orientation from 'react-native-orientation';

const alpha = require('alphavantage')({ key: 'MXPTZY9XBQTA2R3Y' });

const VoiceScreen = ({ navigation }) => {
  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);
  const [isAnimVisible, setAnimVisible] = useState(false);
  const [stockPrice, setStockPrice] = useState('');
  const [stockPrice2, setStockPrice2] = useState('');

  useEffect(() => {
    //Setting callbacks for the process status
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    
    return () => {
      //destroy the process after switching the screen
      Voice.destroy().then(Voice.removeAllListeners);
    
    };
  }, []);


  const onSpeechStart = (e) => {
    //Invoked when .start() is called without error
    console.log('onSpeechStart: ', e);
    setStarted('√');
  };

  const onSpeechEnd = (e) => {
    //Invoked when SpeechRecognizer stops recognition
    console.log('onSpeechEnd: ', e);
    setEnd('√');
    setAnimVisible(false)
  };

  const onSpeechError = (e) => {
    //Invoked when an error occurs.
    console.log('onSpeechError: ', e);
    setError(JSON.stringify(e.error));
    setAnimVisible(false)
  };

  const onSpeechResults = (e) => {
    //Invoked when SpeechRecognizer is finished recognizing
    console.log('onSpeechResults: ', e.value[0]);
    setResults(e.value);
    setAnimVisible(false)
    nameToTicker(e.value[0])
  };

  const nameToTicker=(words)=> {
    var n = words.split(" ");
    
    if(n[0]=='current' && n[1]=='price' &&  n[2]=='of')
    {
      alpha.data.search(n[n.length-1]).then((data) => {
      
     
        console.log('searchdata',data)

        alpha.data.daily(data.bestMatches[0]['1. symbol']).then((data) => {

      
          console.log('stockData',data)
          var stocks = data['Time Series (Daily)']
          var values = [];
          
          
          for (const [key, value] of Object.entries(stocks)) {
           
            values.push(parseFloat(value['4. close']));
            
          }
          
          setStockPrice(data['Meta Data']['2. Symbol']+' is at $'+values[0])
  
         
          }).catch((error)=>{
            console.log('API error',error)
            ToastAndroid.showWithGravity(
              "API calls exceded, please try again in sometime",
              ToastAndroid.LONG,
              ToastAndroid.CENTER
            );
            
          })

          alpha.data.daily(data.bestMatches[1]['1. symbol']).then((data) => {

      
            console.log('stockData',data)
            var stocks = data['Time Series (Daily)']
            var values = [];
            
            
            for (const [key, value] of Object.entries(stocks)) {
             
              values.push(parseFloat(value['4. close']));
              
            }
            
            setStockPrice2(data['Meta Data']['2. Symbol']+' is at $'+values[0])
    
           
            }).catch((error)=>{
              console.log('API error',error)
              ToastAndroid.showWithGravity(
                "API calls exceded, please try again in sometime",
                ToastAndroid.LONG,
                ToastAndroid.CENTER
              );
            })
        destroyRecognizer
      }).catch((error)=>{
        console.log('API error',error)
        ToastAndroid.showWithGravity(
          "API calls exceded, please try again in sometime",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      })
  
      
    }
    else if(n[0]=='show' && n[1]=='Trends' &&  n[2]=='of')
    {
    
      
      alpha.data.search(n[n.length-1]).then((data) => {
        
        console.log('data',data)
        navigation.navigate('Home',{ticker:data.bestMatches[0]['1. symbol']})
        destroyRecognizer
      });
    }

}
  const onSpeechPartialResults = (e) => {
    //Invoked when any results are computed
    console.log('onSpeechPartialResults: ', e);
    setPartialResults(e.value);
  };

  const onSpeechVolumeChanged = (e) => {
    //Invoked when pitch that is recognized changed
    console.log('onSpeechVolumeChanged: ', e);
    setPitch(e.value);
  };

  const startRecognizing = async () => {
    //Starts listening for speech for a specific locale
    
    try {
      setAnimVisible(true)
      setStockPrice('')
      setStockPrice2('')
      await Voice.start('en-US');
      setPitch('');
      setError('');
      setStarted('');
      setResults([]);
      setPartialResults([]);
      setEnd('');
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
      setAnimVisible(false)
    }
  };

  const stopRecognizing = async () => {
    //Stops listening for speech
    try {
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  const cancelRecognizing = async () => {
    //Cancels the speech recognition
    try {
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  const destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance
    try {
      setAnimVisible(false)
      setStockPrice('')
      setStockPrice2('')
      await Voice.destroy();
      setPitch('');
      setError('');
      setStarted('');
      setResults([]);
      setPartialResults([]);
      setEnd('');
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
      setAnimVisible(false)
    }
  };


  Orientation.lockToPortrait();
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={dark_theme.bg_color}  barStyle='light-content'/>
     
        <Text style={[styles.titleText,{marginTop:20}]}>
          Ask Alfred questions
        </Text>
        <Text style={styles.titleText}>
          regarding stock prices
        </Text>
        {
          isAnimVisible ? 
            <PulseLoader size={0} />
            :
          null
        }
        
        <View style={{width:'100%',height:'20%'}} />
        <Text style={styles.results}>
          {results[0]}
        </Text>
        <Text style={styles.results}>
          { stockPrice ? stockPrice :  null}
        </Text>
        <Text style={styles.results}>
          { stockPrice2 ? stockPrice2 :  null}
        </Text>
       
        <View style={{width:'100%',height:'20%'}} />

       
        <TouchableOpacity onPress={startRecognizing}>
          <MaterialCommunityIcons 
              name="microphone-outline" color='white'
              size={70} 
              style={styles.mic}                  
          />
        </TouchableOpacity>
       
      
       
        <View style={styles.horizontalView}>
         
         
          <TouchableOpacity
            onPress={startRecognizing}
            style={styles.btnContainer}
            >
             <MaterialCommunityIcons 
                name="refresh" color='#fff'
                size={30} 
                style={styles.bottomBtn}              
              />  
          </TouchableOpacity>
          <TouchableOpacity
            onPress={destroyRecognizer}
          
            style={styles.btnContainer}
            >
             <MaterialCommunityIcons 
                name="close" color='#fff'
                size={30} 
                style={styles.bottomBtn}                 
              />  
          </TouchableOpacity>
        </View>
 
    </SafeAreaView>
  );
};

export default VoiceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:dark_theme.bg_color
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontFamily:'SFUIText-Semibold',
    color:'#a29bba',
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#8ad24e',
    marginRight: 2,
    marginLeft: 2,
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  horizontalView: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 50,
    alignSelf:'center'
  },
  textStyle: {
    textAlign: 'center',
    padding: 12,
  },
  imageButton: {
    width: 50,
    height: 50,
   
  },
  textWithSpaceStyle: {
    flex: 1,
    textAlign: 'center',
    color: '#B0171F',
  },
  mic:{
    alignSelf:'center',
    marginVertical:-15
  },
  bottomBtn:{
    
  },
  btnContainer:{
    height:40,
    width:40,
    borderRadius:150/2,
    backgroundColor:'#9e98b3',
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:16
  },
  results:{
    color:'lightgrey',
    alignSelf:'center',
    fontSize:18,
    fontFamily:'SFUIText-Medium',
    marginHorizontal:20
  },
  ring: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: "tomato",
    borderWidth: 10,
  },
});