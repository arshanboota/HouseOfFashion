import React, { Component } from 'react'
import { Provider } from "react-redux"
import MyReducers from './source/data/local/reducers/MyReducers'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
const prefManager = new PrefManager()
import PrefManager from './source/data/local/PrefManager'

import Testing from './source/Views/Home/Testing';
//---------------Testing Screen-------------------
import SplashScreen from './source/Views/InitalScreens/SplashScreen'
import WelcomeScreen from './source/Views/Auth/WelcomeScreen'
import LoginScreen from './source/Views/Auth/LoginScreen';
import SignupScreen from './source/Views/Auth/SignupScreen';
import ForgetPassword from './source/Views/Auth/ForgetPassword';
import ProductScreen from './source/Views/Home/ProductScreen';
import CartScreen from './source/Views/Home/CartScreen';
import OrderList from './source/Views/Home/OrderList';
import CheckoutWeb from './source/Views/Home/CheckoutWeb';
import orderDetail from './source/Views/Home/orderDetail';
import DrawerScreen from './source/Views/Home/DrawerScreen';
import AllProducts from './source/Views/Home/AllProducts';

const Stack = createStackNavigator();
export default class App extends Component {
  constructor(props) {
    super(props);
    // this.state=this.state.bind(this)
    this.state = {
      LogoutData: ''
    };

  }
  componentDidMount() {
    let tempStorage = prefManager.getSaveUserData(data => {
      data = data
    })
    this.setState({
      LogoutData: tempStorage
    })
  }

  render() {
    return (
      <Provider store={MyReducers}>
        <NavigationContainer >
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            headermode={"none"}
            >
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen name="HomeScreen" component={DrawerScreen} />
            <Stack.Screen name="ProductScreen" component={ProductScreen} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="OrderList" component={OrderList} />
            <Stack.Screen name="orderDetail" component={orderDetail} />
            <Stack.Screen name="CheckoutWeb" component={CheckoutWeb} />
            <Stack.Screen name="AllProducts" component={AllProducts} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}


