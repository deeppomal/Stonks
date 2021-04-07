import React, {Component} from 'react';

import { NavigationContainer, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import Login from '../screens/Login';
import BiometricPopup from '../screens/Biometric';
import VoiceScreen from '../screens/Voice';
import Stock from '../screens/Stock';

const Stack = createStackNavigator();   


class Navigation extends Component {



    render() {
      
      
      
      return( 
        
          <NavigationContainer >
          
         
            <Stack.Navigator initialRouteName="Biometric"
              screenOptions={{
                headerShown: false
              }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Biometric" component={BiometricPopup} />
                <Stack.Screen name="Voice" component={VoiceScreen} />
                <Stack.Screen name="Stock" component={Stock} />
              
             
            </Stack.Navigator>
         
        
          
          </NavigationContainer>
  
     
      )
      
    }
  }
  export default Navigation;