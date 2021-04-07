import React, {Component} from 'react';
import {Text,View, StyleSheet, TouchableOpacity,StatusBar,Image, ToastAndroid,AsyncStorage} from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import dark_theme from '../constants/colors';
import Orientation from 'react-native-orientation';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default class BiometricPopup extends Component {
  constructor() {
    super();

    this.state = {
      biometryType: null,
      logStat:'',
      isLoginScreenPresented:false
    };
  }
  async componentDidMount() {

    Orientation.lockToPortrait();
    
    // this.getLoginStatus();

    const isSignedIn = await GoogleSignin.isSignedIn();
    this.setState({ isLoginScreenPresented: !isSignedIn });

    FingerprintScanner.isSensorAvailable()
      .then((biometryType) => {
        this.setState({biometryType});
      })
      .catch((error) => console.log('isSensorAvailable error => ', error));

     
  }

  async getLoginStatus() {
    try {
      let userData = await AsyncStorage.getItem("loginData");
      let data = JSON.parse(userData);

      console.log('ogCall',userData)
      this.setState({logStat:userData})
      
    } catch (error) {
      console.log("Something went wrong1", error);
    }
  }
  
  getMessage=()=>{
  const {biometryType}=this.state;
    if(biometryType=='Face ID')
    {
      return 'Scan your Face on the device to continue'
    }
    else
    {
      return 'Scan your Fingerprint on the device scanner to continue'
    }
  }

  showAuthenticationDialog = () => {
    const {biometryType}=this.state;
    if(biometryType!==null && biometryType!==undefined )
    {
    FingerprintScanner.authenticate({
      description: this.getMessage()
    })
      .then(() => {
        

      console.log('metCall',this.state.isLoginScreenPresented)
      if(this.state.isLoginScreenPresented)
        {
          this.props.navigation.navigate('Login')
        }
     
      
      else {
        this.props.navigation.navigate('Voice')
      }
        
      })
      .catch((error) => {
        console.log('Authentication error is => ', error);
      });
    }
    else
    {
    console.log('biometric authentication is not available');
    }
  };

  render() {
    const {biometryType}=this.state;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={'#fff'} barStyle={'light-content'} />
        <View style={styles.v1} />
        <Image source={require('../constants/assets/face.png')}
              onPress={this.showAuthenticationDialog()}
              style={styles.img} />
        <View style={styles.v2} />
        <Text style={styles.title} >
          Login with Fingerprint
        </Text>
        <Text style={styles.subTitle}>
          Use your Fingerprint for faster, easier access to sign in
        </Text>
        <View style={styles.v3} />
     
        <TouchableOpacity style={styles.btn1}
        onPress={()=>this.props.navigation.navigate('Login')}>
          <Text style={styles.text1}>SKIP</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff'
  },

  img:{
    height:60,
    width:60,
    alignSelf:'center',
    marginVertical:10
  },
  v1:{
    width:'100%',
    height:'20%',
    
  },
  v2:{
    width:'100%',
    height:'20%'
  },
  title:{
    textAlign:'center',
    fontFamily:'SFUIText-Semibold',
    fontSize:15,
    marginVertical:3
    
  },
  subTitle:{
    textAlign:'center',
    fontFamily:'SFUIText-Regular',
    fontSize:12,
  },
  v3:{
    width:'100%',
    height:'10%'
  },
  btn1:{
    alignSelf:'center',
    backgroundColor:dark_theme.bg_color,
    height:50,
    width:'80%',
    marginVertical:5,
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center'

  },
  btn2:{
    alignSelf:'center',
    borderWidth:1,
    borderColor:dark_theme.bg_color,
    height:50,
    width:'80%',
    marginVertical:5,
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center'
  },
  text1:{
    color:'#fff',
    fontSize:16,
    fontFamily:'SFUIText-Bold'
  },
  text2:{
    color:dark_theme.bg_color,
    fontSize:16,
    fontFamily:'SFUIText-Regular'
  }
});