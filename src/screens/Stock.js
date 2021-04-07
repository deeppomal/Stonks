import React, {Component} from 'react';

import { 
  ScrollView,
  StyleSheet, View,Text,ToastAndroid,StatusBar,BackHandler 

} from "react-native";

import { AreaChart, Grid,YAxis,LineChart,XAxis } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Orientation from 'react-native-orientation';


const alpha = require('alphavantage')({ key: 'MXPTZY9XBQTA2R3Y' });

class Stock extends Component {



  constructor(props) {
    super(props);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
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
    
    Orientation.lockToLandscape();
   this.getStonks('aapl','Daily');
   
    
  }

 

  componentDidUpdate = (prevProps) => {  
  
    console.log('this props',this.props?.route?.params?.ticker2);
    this.props?.route?.params?.ticker2 ? 
    this.getStonks(this.props?.route?.params?.ticker2,'Daily')
    :null
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
}

handleBackButtonClick() {
    this.props.navigation.goBack(null);
    Orientation.lockToPortrait();
    return true;
}

  getStonks=(ticker,selected)=>{
    
    console.log('selected',selected)
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

        for (var i =0;i<10;i++){
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
  render() {

   
    
 
    const contentInset = { top: 25, bottom: 20 }
      return (
        <View style={styles.container}>
        <StatusBar backgroundColor={'#fff'} barStyle={'light-content'} />
       <ScrollView>
        
      
        <Text style={styles.title}>
          {this.props?.route?.params?.ticker2 ? this.props?.route?.params?.ticker2 : 'AAPL'} STOCK PRICE BY MINUTE
        </Text>
        <Text style={styles.subTitle
        }>
          Using ordial X axis 
        </Text>
        <TouchableOpacity style={{
          marginVertical:16,
          width:'80%',
          alignSelf:'center',
          backgroundColor:'#f7f7f7',
          padding:10,
          flexDirection:'row',
          alignItems:'center',
          borderRadius:5

        }}
        onPress={()=>{
          this.setState({selectedBtn:'Daily',dates:[],stockList:[]})
          this.props.navigation.navigate('Voice')}

          }>
          <Text style={{color:'grey'}}>
            Search Stocks...
          </Text>
          <MaterialCommunityIcons 
              name="microphone-outline" color='grey'
              size={20} 
              style={styles.mic}
          />
        </TouchableOpacity>
        
        <View style={{flexDirection:'row',marginHorizontal:16,marginBottom:-16,alignItems:'center'}}>

          <Text style={{fontFamily:'SFUIText-Regular',color:'grey',marginHorizontal:10}}> 
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
            this.props?.route?.params?.ticker2 ? 
              this.getStonks(this.props?.route?.params?.ticker2,'Daily')
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
            this.props?.route?.params?.ticker2 ? 
              this.getStonks(this.props?.route?.params?.ticker2,'Monthly')
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
            this.props?.route?.params?.ticker2 ? 
              this.getStonks(this.props?.route?.params?.ticker2,'Yearly')
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
        
        </View>
        <View style={{ height: 300, padding: 20 }}>

              <View style={{
                flexDirection:'row',
                height:300
              }}>
                
                  <AreaChart
                        style={{ flex: 1}}
                        data={this.state.stockList}
                        contentInset={contentInset}
                        curve={shape.curveNatural}
                        svg={{ fill: 'rgba(153,197,240,0.8)' }}
                    >
                
                      <Grid />
                  </AreaChart>
                  <YAxis
                      data={this.state.stockList}
                      style={{marginStart:16,marginBottom:-10}}
                      contentInset={contentInset}
                      svg={{
                          fill: 'grey',
                          fontSize: 10,
                          
                      }}
                      
                      formatLabel={(value) => `${value}`}
                  />
              </View>
             
                <XAxis
                    style={{ marginHorizontal: -5,marginVertical:16,marginEnd:25 }}
                    data={this.state.dates}
                    formatLabel={(value,index) => `${this.state.dates[index]}`}
                    contentInset={{left:20,right:20}}
                    svg={{ fontSize: 10, fill: 'grey' }}
                    
                />
            </View>
            <View style={{width:'100%',height:100}} />
        </ScrollView>
      </View>
      );
   
  }
}
export default Stock;

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
  }
});