import React, { Component } from 'react'
import { DrawerItem, DrawerItemList, DrawerContentScrollView, } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import 'react-native-gesture-handler';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CommonActions } from '@react-navigation/native';
import Helper from '../../utils/Helper'
import theme from '../../assets/themes/dark.json';
import PrefManager from '../../data/local/PrefManager'
import LoginScreen from '../Auth/LoginScreen';
import WooCommerceAPI from 'react-native-wc-api';
import HomeScreen from './HomeScreen';
import CartScreen from './CartScreen';
import OrderList from './OrderList';
import AllProducts from './AllProducts';
import Urls from '../../data/remote/Urls'
const helper = new Helper()
// import Icon2 from 'react-native-vector-icons/Fontisto';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const WooCommerce = new WooCommerceAPI({
  url: Urls.Domain,
  consumerKey: Urls.consumerKey,
  consumerSecret: Urls.consumerSecret,
  wpAPI: true,
  version: 'wc/v3',
  queryStringAuth: true,
});
//---------------Testing Screen-------------------
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FlatList } from 'react-native-gesture-handler';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Creating navigator for home Screen
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const prefManager = new PrefManager()


function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const This = props.this;
  // alert(props.this)

  return (
    <DrawerContentScrollView {...props}
    // style={{ marginTop:"70%"}}
    >
      {/* code is in the sticky note */}
      {<View
        style={{
          backgroundColor: "#222831",
          // marginTop: windowHeight < 660 ? -19 : -33, //old
          marginTop: -40,
          right: 2.5,
          // height: windowHeight < 660 ? 130 : 140,
          height: hp(24),
          // borderTopRightRadius: 20, //added later
          alignItems: 'center',
        }} >

        {/* Text Image */}
        <Image style={{
          width: "50%",
          height: "80%",
          marginLeft: "47%",
          marginTop: "10%",
          position: 'absolute',
          tintColor: "#EEEEEE",
        }} source={require("../../assets/Images/SplashText.png")} />

      </View>}
      <DrawerItemList {...props} />


      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          paddingVertical: "5%",
          marginHorizontal: "5%",
          justifyContent: "space-between",
          borderRadius: 5,
          top: -1
        }}
        onPress={() => {
          This.setState({
            submenu: !This.state.submenu
          })
        }}  >


        <MaterialIcons name="menu" size={15}
          style={{ marginLeft: "5%", paddingTop: "1%" }} ></MaterialIcons>
        <Text style={{
          fontSize: 13,
          alignSelf: "center",
          marginRight: '10%',
          color:'#000'
        }}>Categories {props.data}</Text>

        <AntDesign name={This.state.submenu == true ? "up" : "down"}color={'#000'} size={15}
          style={{
            marginLeft: "5%",
            paddingTop: "1%"
          }} />



      </TouchableOpacity>
      {This.state.submenu == true &&

        This.state.categoryAvailable.map((item, i) => {
          return (

            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomWidth: 0.5,
              borderTopWidth: i == 0 ? 0.5 : 0,
              borderColor: "black",
              paddingright: "30%",

            }}>
              <Text
                style={{ marginLeft: "35%", paddingTop: "5%", paddingBottom: "1%",color:'#000' }}
                onPress={() =>

                  This.props.navigation.navigate("AllProducts", {
                    prod_id: item.id,
                    prod_name: item.name
                  })
                }

              > {item.name}</Text>

              <AntDesign name="right" size={15} color='#000'
                style={{ marginRight: "5%", paddingTop: "5%", paddingBottom: "1%", }} ></AntDesign>

            </View>
          )
        })
      }


      {props.data &&
        <TouchableOpacity
          style={{

            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: '1%',
            paddingVertical: "5%",
            marginHorizontal: "5%",
            borderRadius: 5
          }}
          onPress={() => {
            prefManager.deleteUsertData()
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  { name: "LoginScreen" },
                ],
              })
            );
            helper.showToast("User Account logged out", '#000')
          }}>
          <MaterialCommunityIcons name='logout' size={15} color={'#000'}
            style={{ marginLeft: "-11%" }} ></MaterialCommunityIcons>

          <Text style={{
            fontSize: 13,
            marginRight: '33%',
            color:'#000'
          }}>Logout {props.data}</Text>
        </TouchableOpacity>}



      {!props.data &&
        <TouchableOpacity
          style={{

            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: '1%',
            paddingVertical: "5%",
            marginHorizontal: "5%",
            borderRadius: 5
          }}
          onPress={() => {
            navigation.navigate("LoginScreen")
          }} >

          <MaterialCommunityIcons name='login' size={15} color={'#000'}
            style={{ marginLeft: "-14%" }} ></MaterialCommunityIcons>

          <Text style={{
            fontSize: 13,
            marginRight: '37%',
            color:'#000'
          }}>Login {props.data}</Text>
        </TouchableOpacity>}
    </DrawerContentScrollView>
  );
}




export default class DrawerScreen extends Component {
  constructor(props) {
    super(props);
    // this.state = this.state.bind(this);
    this.state = {
      loginState: true,
      submenu: false,
      categoryAvailable: [],
      categoryAvailableProducts: "",

    };
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState({
        submenu: false
      })
    })

    prefManager.getSaveUserData((data) => {
      if (data) {
        this.setState({ loginState: true })
        // console.log(data)
      }
      else {
        this.setState({ loginState: false })
        // console.log("no data found",)

      }
    })

    this.setState({
      categoryAvailable: [],
      categoryAvailableProducts: "",
    })
    let tempDataStore = []
    WooCommerce.get('products/categories', {
      perpage: 100,
    }).then(response => {
      if (response.data == null && response.data == undefined) {
        this.setState({ nodata: true })
      }
      else {
        this.setState({ categoryAvailable: response.data }, () => {
          // console.log('--------------------getting available category------------------', this.state.categoryAvailable)
        })
        for (let index = 0; index < response.data.length; index++) {
          // console.log( response.data[index].id)
          // var id=response.data[index].id
          WooCommerce.get('products/', {
            per_page: '100',
            category: response.data[index].id
          }).then(response => {
            //   console.log("\x1b[33m", '==================products response================================', JSON.stringify(response.data));
            tempDataStore[index] = response.data
            this.setState({
              categoryAvailableProducts: tempDataStore,

            }, () => {
              this.state.isLoading = false
              // console.log("XXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", this.state.categoryAvailableProducts.length)
              //console.log("===========================>>>>>>>>>>>>>>>>>>", tempDataStore)
            })
          }).catch(error => {
            // console.log("\x1b[33m", '==================products Error================================', error);
          });
        }
        this.setState({ loadingBody: false, refreshing: false })
      }
    }).catch(error => {
      // console.log("\x1b[33m", '==================cat Error================================', error);
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }


  MyDrawer() {
    return (
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} data={this.state.loginState} this={this} />}
        initialRouteName="Home"
        screenOptions={{
          headerShown: false
        }}
        drawerContentOptions={{
          activeTintColor: '#33343E',
          inactiveTintColor: '#33343E',
          itemStyle: { marginVertical: 5, },

        }}

        drawerStyle={{
          backgroundColor: '#ffffff',
          // backgroundColor: 'yellow',
          height: "70%",
          marginTop: "30%",
          width: "60%",
          overflow: "hidden",
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,

        }}
      >
        <Drawer.Screen name="HomeTabs" component={this.HomeTabs} options={{
          title: 'Home',

          drawerIcon: () => (
            <MaterialCommunityIcons name='shield-home' size={15} color='#000'
            ></MaterialCommunityIcons >
          ),
        }} />
        {/* <Drawer.Screen name="CartScreen" component={CartScreen} options={{
          title: 'Cart',

          drawerIcon: () => (
            <Icon2  name='cart-outline'size={15} color='#000'
            ></Icon2 >
          ),
        }} /> */}

      </Drawer.Navigator>
    );
  }

  HomeTabs() {
    return (
      <Tab.Navigator
        initialRouteName={'HomeScreen'}
        screenOptions={({ route }) => ({
          tabBarStyle: {
            backgroundColor: theme.app_bottomTab_backgroundColor,
            height: "8%",
            borderTopColor: theme.app_bottomTab_topBorderColor,
          },
        })}
      >

        {/* 1st Tab */}
        <Tab.Screen name="CartScreen" component={CartScreen} options={{
          headerShown: false,
          tabBarLabel: () => { return false },
          tabBarIconStyle: { bottom: "28%" },
          tabBarIcon: ({ focused }) => {
            return (
              <Icon2 name='cart-outline' size={focused ? 30 : 25} color={focused ? '#FEFBF3' : '#F8F0DF'}
                style={{
                  backgroundColor: focused ? '#79B4B7' : "#222831",
                  borderRadius: 100, padding: 10, bottom: -15
                }}
              />
            )
          }
        }} />


        {/* 2nd Tab */}
        <Tab.Screen name="HomeScreen" component={HomeScreen} options={{
          tabBarLabel: () => { return false },
          headerShown: false,
          tabBarIconStyle: { bottom: "28%" },
          tabBarIcon: ({ focused }) => {

            return <Icon name='home' size={focused ? 29 : 25} color={focused ? '#FEFBF3' : '#F8F0DF'}
              style={{
                backgroundColor: focused ? '#79B4B7' : "#222831",
                borderRadius: 100, padding: 9, bottom: -15
              }}
            />;
          }
        }}
        />

        {/* 3rd Tab */}
        <Tab.Screen name="OrderList" component={OrderList} options={{
          tabBarLabel: () => { return false },
          headerShown: false,
          tabBarIconStyle: { bottom: "28%" },
          tabBarIcon: ({ focused }) => {

            return <Icon name='list' size={focused ? 29 : 25} color={focused ? '#FEFBF3' : '#F8F0DF'}
              style={{
                backgroundColor: focused ? '#79B4B7' : "#222831",
                borderRadius: 100, padding: 8, bottom: -15
              }}
            />;
          }
        }}
        />

      </Tab.Navigator>
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1
        }}>
        {this.MyDrawer()}
      </View>
    );
  }
}
