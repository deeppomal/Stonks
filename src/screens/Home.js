import React, {Component} from 'react';

import { 

  StyleSheet, View,Text,ToastAndroid, StatusBar,AsyncStorage

} from "react-native";

import { AreaChart, Grid,YAxis,LineChart,XAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Orientation from 'react-native-orientation';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const alpha = require('alphavantage')({ key: 'your_key' });

class Home extends Component {



  constructor(props) {
    super(props);

  
    this.state = {
        chartOptions: {
            series: [{
                data: [1, 2, 3]
            }]
        },
        stockList:[],
        dates:[],
        selectedBtn:'Daily',
      
        
    };
}

  componentDidMount(){
    
    Orientation.lockToPortrait();
   this.getStonks('aapl','Daily');
   
    
  }

 

  componentDidUpdate = (prevProps) => {  
  
    Orientation.lockToPortrait();
    console.log('this props',this.props?.route?.params?.ticker);
    this.props?.route?.params?.ticker ? 
    this.getStonks(this.props?.route?.params?.ticker,'Daily')
    :null
  }

  getStonks=(ticker,selected)=>{
    
   
    if(selected=='Daily')
    {
      alpha.data.intraday(ticker).then((data) => {

      
        console.log('MAINS',data)
        var stocks = data['Time Series (1min)']
      
        var values = [];
        var keys =[]

        
      
        for (const [key, value] of Object.entries(stocks)) {
          keys.push(key.slice(-8,-3))
          values.push(parseFloat(value['1. open']));
          
        }

        var newVals = []
        var newKeys = []

        for (var i =0;i<5;i++){
          newKeys.push(keys[i])
          newVals.push(values[i])
        }

      
        this.setState({stockList:newVals.slice(0).reverse(),dates:newKeys.slice(0).reverse()})
        }).catch((error)=>{
          console.log('API error',error)
          ToastAndroid.showWithGravity(
            "API calls exceded, please try again in sometime",
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
        })
    }
    else if ( selected=='Monthly')
    {
      alpha.data.daily(ticker).then((data) => {

      
        
        var stocks = data['Time Series (Daily)']
      
        var values = [];
        var keys =[]
      
       
        for (const [key, value] of Object.entries(stocks)) {
          keys.push(key.slice(-5))
          values.push(parseFloat(value['1. open']));
          
        }

        var newVals = []
        var newKeys = []

        for (var i =0;i<5;i++){
          newKeys.push(keys[i])
          newVals.push(values[i])
        }

      
        this.setState({stockList:newVals.slice(0).reverse(),dates:newKeys.slice(0).reverse()})
      }).catch((error)=>{
        console.log('API error',error)
        ToastAndroid.showWithGravity(
          "API calls exceded, please try again in sometime",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      })
    }
    else if ( selected=='Yearly')
    {
      alpha.data.monthly(ticker).then((data) => {

      
        
        var stocks = data['Monthly Time Series']
      
        var values = [];
        var keys =[]
      
        for (const [key, value] of Object.entries(stocks)) {
          keys.push(key.slice(-5))
          values.push(parseFloat(value['1. open']));
          
        }

        var newVals = []
        var newKeys = []

        for (var i =0;i<5;i++){
          newKeys.push(keys[i])
          newVals.push(values[i])
        }

      
        this.setState({stockList:newVals.slice(0).reverse(),dates:newKeys.slice(0).reverse()})
      }).catch((error)=>{
        console.log('API error',error)
        ToastAndroid.showWithGravity(
          "API calls exceded, please try again in sometime",
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      })
    }
  }
  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      try {
        await AsyncStorage.setItem("loginData", false);
     } catch (error) {
       console.log("Something went wrong", error);
     }

      this.props.navigation.navigate('Login')
      ToastAndroid.showWithGravity(
        "Logged out",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM
      );
    } catch (error) {
      console.error(error);
    }
  };
  render() {

   
    const data = [50, 10, 40, 95,  15, 91, 35, 53,  24, 50, 20, 80]
    const data2 = ['01/20','01/21','01/22','01/23','01/24','01/25','01/26','01/27','01/28','01/29','01/30','01/31']
 
    const contentInset = { top: 25, bottom: 20 }
      return (
        <View style={styles.container}>
          
        <StatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
        
      
        <Text style={styles.title}>
          {this.props?.route?.params?.ticker ? this.props?.route?.params?.ticker : 'AAPL'} stock price by minute 
        </Text>
        <Text style={styles.subTitle
        }>
          Using ordial X axis 
        </Text>
        <MaterialCommunityIcons 
              name="logout" color='grey'
              size={22} 
              style={styles.logout}
              onPress={()=>this.signOut()}
          />
        <TouchableOpacity style={styles.searchBtn}
        onPress={()=>{
          this.setState({selectedBtn:'Daily',dates:[],stockList:[]})
          this.props.navigation.navigate('Voice')}

          }>
          <Text style={styles.searchTxt}>
            Search Stocks...
          </Text>
          <MaterialCommunityIcons 
              name="microphone-outline" color='grey'
              size={20} 
              style={styles.mic}
          />
        </TouchableOpacity>
        
        <View style={styles.zoomView}>

          <Text style={styles.zoomTxt}> 
            Zoom
          </Text>
          <TouchableOpacity style={[
            this.state.selectedBtn=='Daily' ?
            {
              padding:4,
              borderRadius:3,
              backgroundColor:'#e6ebf5',
              marginHorizontal:5
          
            }
            :
            {
              padding:4,
              borderRadius:3,
              backgroundColor:'#f7f7f7',
              marginHorizontal:5
            }
          ]}
          onPress={()=>{
            this.setState({selectedBtn:'Daily'})
            this.props?.route?.params?.ticker ? 
              this.getStonks(this.props?.route?.params?.ticker,'Daily')
            :
              this.getStonks('aapl','Daily')

            }}>
            <Text style={[
              this.state.selectedBtn=='Daily'?
              {
                fontSize:12,
                fontFamily:'SFUIText-Semibold'
              }
              :
              {
                fontSize:12,
                fontFamily:'SFUIText-Medium'
              }
            ]}>1 H</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[
            this.state.selectedBtn=='Monthly' ?
            {
              padding:4,
              borderRadius:3,
              backgroundColor:'#e6ebf5',
              marginHorizontal:5
          
            }
            :
            {
              padding:4,
              borderRadius:3,
              backgroundColor:'#f7f7f7',
              marginHorizontal:5
            }
          ]}
          onPress={()=>{
            this.setState({selectedBtn:'Monthly'})
            this.props?.route?.params?.ticker ? 
              this.getStonks(this.props?.route?.params?.ticker,'Monthly')
            :
              this.getStonks('aapl','Monthly')

            }}>
            <Text style={[
              this.state.selectedBtn=='Monthly'?
              {
                fontSize:12,
                fontFamily:'SFUIText-Semibold'
              }
              :
              {
                fontSize:12,
                fontFamily:'SFUIText-Medium'
              }
            ]}>1 D</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[
            this.state.selectedBtn=='Yearly' ?
            {
              padding:5,
              borderRadius:3,
              backgroundColor:'#e6ebf5',
              marginHorizontal:5
          
            }
            :
            {
              padding:5,
              borderRadius:3,
              backgroundColor:'#f7f7f7',
              marginHorizontal:5
            }
          ]} 
          onPress={()=>{
            this.setState({selectedBtn:'Yearly'})
            this.props?.route?.params?.ticker ? 
              this.getStonks(this.props?.route?.params?.ticker,'Yearly')
            :
              this.getStonks('aapl','Yearly')

            }}> 
            <Text style={[
              this.state.selectedBtn=='Yearly'?
              {
                fontSize:12,
                fontFamily:'SFUIText-Semibold'
              }
              :
              {
                fontSize:12,
                fontFamily:'SFUIText-Medium'
              }
            ]}>All</Text>
          </TouchableOpacity>
          <MaterialCommunityIcons 
              name="fullscreen" color='grey'
              size={25} 
              style={styles.mic}
              onPress={()=>this.props.navigation.navigate('Stock',{ticker2:this.props?.route?.params?.ticker ? this.props?.route?.params?.ticker : 'AAPL'})}
          />
        </View>
        <View style={styles.graphView}>

              <View style={styles.graphView2}>
                
                  <AreaChart
                        style={styles.chart}
                        data={this.state.stockList}
                        contentInset={contentInset}
                        curve={shape.curveNatural}
                        svg={{ fill: 'rgba(153,197,240,0.8)' }}
                    >
                
                      <Grid />
                  </AreaChart>
                  <YAxis
                      data={this.state.stockList}
                      style={styles.y}
                      contentInset={contentInset}
                      svg={{
                          fill: 'grey',
                          fontSize: 10,
                          
                      }}
                      
                      formatLabel={(value) => `${value}`}
                  />
              </View>
             
                <XAxis
                    style={styles.x}
                    data={this.state.dates}
                    formatLabel={(value,index) => `${this.state.dates[index]}`}
                    contentInset={{left:20,right:20}}
                    svg={{ fontSize: 10, fill: 'grey' }}
                    
                />
            </View>
    
      </View>
      );
   
  }
}
export default Home;

const styles = StyleSheet.create({
  container: {
      backgroundColor: '#fff',
      flex: 1
  },
  title:{
    textAlign:'center',
    fontSize:18,
    fontFamily:'SFUIText-Semibold',
    marginTop:25
  },
  subTitle:{
    textAlign:'center',
    fontSize:14,
    fontFamily:'SFUIText-Regular',
    
  },
  
  btnText:{
    fontSize:12,
    fontFamily:'SFUIText-Medium'
  },
  mic:{
    position:'absolute',
    right:16
  },
  searchBtn:{
    marginVertical:16,
    width:'80%',
    alignSelf:'center',
    backgroundColor:'#f7f7f7',
    padding:10,
    flexDirection:'row',
    alignItems:'center',
    borderRadius:5

  },
  searchTxt:{color:'grey'},
  zoomView:{
    flexDirection:'row',
    marginHorizontal:16,
    marginBottom:-16,
    alignItems:'center'
  },
  zoomTxt:{fontFamily:'SFUIText-Regular',color:'grey',marginHorizontal:10},
  graphView:{ height: 300, padding: 20 },
  graphView2:{
    flexDirection:'row',
    height:300
  },
  chart:{ flex: 1},
  y:{marginStart:16,marginBottom:-10},
  x:{ marginHorizontal: -5,marginVertical:16,marginEnd:25 },
  logout:{
    position:'absolute',
    right:16,
    marginTop:30
  }
});