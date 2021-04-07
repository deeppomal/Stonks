import React, {Component} from 'react';
import { 
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    ToastAndroid,
    AsyncStorage
} from "react-native";

import dark_theme from '../constants/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Orientation from 'react-native-orientation';

GoogleSignin.configure({
    webClientId: '821258293313-esr9gc4dtn68ieoq4rgk883m88j5l3ds.apps.googleusercontent.com',
                   
  });

Orientation.lockToPortrait();

Login =({navigation})=>{
    
    async function onGoogleButtonPress() {
       
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);


        try {
            await AsyncStorage.setItem("loginData", true);
         } catch (error) {
           console.log("Something went wrong", error);
         }
        navigation.navigate('Voice')
    
        return auth().signInWithCredential(googleCredential);
      }
    
    
    return( 
        
         <View style={styles.container}>
             <StatusBar backgroundColor={dark_theme.bg_color}  barStyle={'light-content'}/>

            <TouchableOpacity style={styles.btnContainer}
             onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!')).catch((er)=>
             {
                ToastAndroid.showWithGravity(
                    "There's some API issue, please skip login for now",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM
                  );
                  console.log('gerrr',er)})
             }>
                <MaterialCommunityIcons name="google" color='white'
                                size={25} 
                                style={styles.icon}
                               
                />
                <Text style={styles.btnText}>
                    Sign In with Google
                </Text>
            </TouchableOpacity>
             <View style={styles.v1} />
            <Text style={styles.skip}
            onPress={()=>navigation.navigate('Voice')}>SKIP LOGIN</Text>
         </View>
  
     
      )
      
    
  }
  export default Login;

  const styles= StyleSheet.create({
      container:{
          flex:1,
          backgroundColor:dark_theme.bg_color,
          alignItems:'center',
          justifyContent:'center'
      },
      btnContainer:{
          backgroundColor:dark_theme.btn_bg,
          alignSelf:'center',
          height:60,
          width:'70%',
          borderRadius:30,
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
          elevation:40,
        

        
      },
      icon:{
          marginHorizontal:5
      },
      btnText:{
          marginHorizontal:5,
          color:'#fff',
          fontSize:20,
          fontFamily:'SFUIText-Semibold'
          
      },
      skip:{
          textAlign:'center',
          fontSize:16,
          color:'lightgrey',
          fontFamily:'SFUIText-Medium',
         
      },
      v1:{
          width:'100%',
          height:100
      }
  })