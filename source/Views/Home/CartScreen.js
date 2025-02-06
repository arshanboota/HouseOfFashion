// import React, { Component } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, Modal, BackHandler, ScrollView, FlatList, StatusBar, ActivityIndicator } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import { connect } from 'react-redux'
// import { headings } from '../../utils/Styles'
// import ReducersProps from '../../data/local/reducers/ReducersProps'
// import ReducersActions from '../../data/local/reducers/ReducersActions'
// import SimpleStyleButton from '../ReuseAbleComponents/SimpleStyleBUtton'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Helper from '../../utils/Helper';
// import PrefManager from '../../data/local/PrefManager'
// import WebView from 'react-native-webview';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// const helper = new Helper()
// const prefManager = new PrefManager()

// class CartScreen extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {

//             data: [],
//             totalPrice: 0,


//             isCheckOut: false,
//             isloading: true,
//             redirectUrl: '',
//             email: '',
//             mainUrl: 'https://houseoffashion.gtechsol.au/login/',
//             password: '',
//             PRELOAD_WEB: '',
//             loading_msg: "",
//         };
//         this.webViewRef = React.createRef();
//     }
//     componentDidMount() {
//         // console.log('Data================================', this.state.data)
//         this._unsubscribe = this.props.navigation.addListener('focus', () => {
//             this.setState({ isloading: true, data: [] }, () => {
//                 prefManager.getSaveCartData(data => {
//                     this.setState({ data: data }, () => {
//                         let { data } = this.state
//                         var tempTotal = 0
//                         if (data != null && data != '' && data != undefined)
//                             data.forEach((product, index) => {
//                                 if (product.p_sale_price == 0) {
//                                     tempTotal = tempTotal + (product.p_actual_price * product.p_quantity)
//                                 }
//                                 else {
//                                     tempTotal = tempTotal + (product.p_sale_price * product.p_quantity)
//                                 }
//                             }),
//                                 this.getUserEmailandUserPass()
//                         this.setState({ totalPrice: tempTotal, isloading: false })
//                     })
//                 })
//             })
//         });
//         this.setState({ isloading: true, data: [] })
//         prefManager.getSaveCartData(data => {
//             this.setState({ data: data }, () => {
//                 let { data } = this.state
//                 var tempTotal = 0
//                 if (data != null && data != '' && data != undefined)
//                     data.forEach((product, index) => {
//                         if (product.p_sale_price == 0) {
//                             tempTotal = tempTotal + (product.p_actual_price * product.p_quantity)
//                         }
//                         else {
//                             tempTotal = tempTotal + (product.p_sale_price * product.p_quantity)
//                         }
//                     }),
//                         this.getUserEmailandUserPass()
//                 this.setState({ totalPrice: tempTotal, isloading: false })
//             })
//         })
//         this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
//     }
//     handleBackButtonClick() {
//         this.props.navigation.navigate("HomeScreen");
//         return true;
//     }
//     componentWillMount() {
//         BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
//     }
//     componentWillUnmount() {
//         BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
//     }
//     getUserEmailandUserPass = () => {
//         prefManager.getSaveUserData(data => {
//             console.log("session data", data)
//             if (data && data.length > 0) {
//                 this.setState({ email: data[0].email, password: data[0].password });
//                 // this.setState({ isloading: true })
//                 this.setState({ loading_msg: 'Please wait...!' })
//                 this.preloadWebView();
//             } else {
//                 // console.error("No user data found.");
//                 this.setState({ isloading: false })
//             }
//         });
//     };



//     proceedTCheckoutCOntroller() {
//         let { data } = this.state

//         prefManager.getSaveUserData(cartData => {
//             if (cartData) {
//                 // console.log(cartData)
//                 this.props.navigation.navigate("CheckoutWeb", { productData: data })
//             }
//             else {
//                 this.props.navigation.navigate("WelcomeScreen")
//             }
//         })
//         // this.props.navigation.navigate("checkoutWeb", { productData: data })
//     }
//     deleteItemFromCart(index) {
//         let { theme, } = this.props
//         var tempCartArray = this.state.data
//         var tempTotal = this.state.totalPrice
//         var product = this.state.data
//         //console.log('is it there=======================', product)
//         if (product[index].p_sale_price == 0) {
//             tempTotal = tempTotal - (product[index].p_actual_price * product[index].p_quantity)
//         }
//         else {
//             tempTotal = tempTotal - (product[index].p_sale_price * product[index].p_quantity)
//         }

//         tempCartArray.splice(index, 1);

//         this.setState({ data: tempCartArray, totalPrice: tempTotal })

//         prefManager.saveCartData(tempCartArray)
//         if (tempCartArray == "") {
//             this.props.navigation.goBack();
//         }
//         helper.showToast("Item Removed From Cart", theme.disc_text_color_productDetail)
//     }




//     preloadWebView = async () => {
//         await new Promise((resolve) => setTimeout(resolve, 5000));

//         if (this.webViewRef.current) {
//             this.setState({ loading_msg: 'We are collecting your data' })
//             this.webViewRef.current.injectJavaScript(`
//                     window.location.href = 'https://houseoffashion.gtechsol.au/login/';
//                     this.setState({ isloading: true })
//             `);
//         }
//     };

//     handleLogin = () => {
//         const { email, password } = this.state;
//         if (!email || !password) {
//             console.error("Email or password is empty.");
//             return;
//         }

//         const loginScript = `
//             document.getElementById('user_login').value = '${email}';
//             document.getElementById('user_pass').value = '${password}';
//             document.getElementById('wppb-submit').click();
//         `;

//         this.webViewRef.current && this.webViewRef.current.injectJavaScript(loginScript);
//     };

//     onNavigationStateChange = (navState) => {
//         const redirectUrl = navState.url;
//         console.log(".....", navState)

//         this.setState({ redirectUrl });
//         if (redirectUrl.includes('https://houseoffashion.gtechsol.au/?loginerror=')) {
//             console.log("Login error occurred");
//         } else if (redirectUrl.includes('https://houseoffashion.gtechsol.au/login/')) {
//             if (navState.title == 'Login – GTech Store') {
//                 this.handleLogin();
//             }
//             this.handleLogin();
//         } if (redirectUrl.includes('https://houseoffashion.gtechsol.au/my-account/')) {
//             if (navState.title == 'My account – GTech Store') {
//                 this.setState({ isloading: false });
//             }
//         }
//         if (redirectUrl.includes("https://houseoffashion.gtechsol.au/checkout-2/order-received/")) {
//             setTimeout(() => {
//                 prefManager.deleteCartData()
//                 axios.get('https://houseoffashion.gtechsol.au/my-account/customer-logout/?_wpnonce=178ddabc77', {})
//                 helper.resetAndGo(this.props.navigation, "HomeScreen")
//             }, 1000);
//         }
//     };

//     async insertItemsController() {
//         const { data } = this.state;
//         const users = [];
//         this.setState({ loading_msg: 'Hold on....! Your order is Processing' })
//         for (let index = -1; index < data.length; index++) {
//             if (index === -1) {
//                 try {
//                     // const response = await fetch("https://houseoffashion.gtechsol.au/?empty-cart", {
//                     const response = await fetch("https://houseoffashion.gtechsol.au/?clear-cart", {
//                         method: "POST"
//                     });
//                     console.log("XXXXXXXXXXXXXXXX", "https://houseoffashion.gtechsol.au/?clear-cart");
//                     users.push(response);
//                 } catch (error) {
//                     console.error("Error emptying cart:", error);
//                     // Handle the error as needed
//                 }
//             } else {
//                 const currentItem = data[index];
//                 const isVariationIdValid = currentItem.p_weight_id !== undefined && currentItem.p_weight_id !== -1;

//                 let tempUrl;

//                 if (!isVariationIdValid) {
//                     tempUrl = `https://houseoffashion.gtechsol.au/?add-to-cart=${currentItem.p_id}&quantity=${currentItem.p_quantity}`;
//                 } else {
//                     tempUrl = `https://houseoffashion.gtechsol.au/?add-to-cart=${currentItem.p_id}&quantity=${currentItem.p_quantity}&variation_id=${currentItem.p_weight_id}`;
//                 }

//                 try {
//                     const response = await fetch(tempUrl, {
//                         method: "POST"
//                     });

//                     console.log("XXXXXXXXXXXXXXXX", tempUrl);
//                     users.push(response);
//                 } catch (error) {
//                     console.error("Error adding to cart:", error);
//                     // Handle the error as needed
//                 }
//             }

//         }


//         this.webViewRef.current.injectJavaScript(`
//                     window.location.href = 'https://houseoffashion.gtechsol.au/checkout-3/';
//                     this.setState({
//                         isloading: false,
//                     });
//             `);
//     }





//     render() {
//         let { theme, language, } = this.props
//         let { totalPrice } = this.state

//         return (


//             // ______________Parent View
//             <View style={{
//                 flex: 1,
//                 backgroundColor: theme.CartScreen_primary_backgroundColor,
//             }}>

//                 <StatusBar backgroundColor={"transparent"} translucent />
//                 <View style={{
//                     height: "11%",
//                     // backgroundColor: "red",
//                     flexDirection: "row",
//                     paddingBottom: "5%",
//                 }}>

//                     {/* Back Button */}
//                     <TouchableOpacity
//                         style={{
//                             height: "40%",
//                             width: "10%",
//                             marginTop: "11%",
//                             marginLeft: "4%",
//                             // backgroundColor:"pink",
//                         }}
//                         onPress={() => this.props.navigation.navigate("HomeScreen")}
//                     >
//                         <Icon name='arrow-left' size={28} color={theme.CartScreen_icon_arrowColor} />
//                     </TouchableOpacity>

//                     {/* Cart Text */}
//                     <Text style={{
//                         ...headings.h2,
//                         height: "55%",
//                         width: "30%",
//                         // backgroundColor:"pink",
//                         marginLeft: "23%",
//                         fontWeight: 'bold',
//                         marginTop: "10%",
//                         color: theme.homeScreen_primary_textColor,
//                     }}> {language.My_Cart} </Text>
//                 </View>


//                 {/* Empty cart image */}
//                 {((this.state.data == "" || this.state.data == null) && !this.state.isloading) && <View style={{ height: "100%", width: "100%", }}>
//                     <Image
//                         style={{ height: "48%", width: "80%", marginTop: "25%", justifyContent: "center", alignSelf: "center" }}
//                         resizeMode="contain"
//                         source={require('../../assets/Images/EmptyCart.png')}
//                     >
//                     </Image>
//                     <Text style={{ marginTop: "1%", textAlign: "center", ...headings.h2, fontWeight: "bold", color: theme.CartScreen_primary_textColor }}>Cart is Empty</Text>

//                 </View>}



//                 {/* Flat List For Cart Items */}
//                 <FlatList
//                     nestedScrollEnabled={true}
//                     data={this.state.data}
//                     keyExtractor={item => item.id}
//                     renderItem={({ item, index }) => (

//                         <View style={{
//                             backgroundColor: "#364547",
//                             paddingVertical: 2,
//                             marginTop: "2%",
//                             paddingLeft: 16,
//                             paddingRight: 16,
//                             flexDirection: 'row',
//                             width: "100%",

//                         }}>


//                             {/* Image */}
//                             <Image style={{
//                                 marginVertical: "0.1%",
//                                 width: "30%",
//                                 height: 100,
//                                 borderRadius: 10,
//                                 // borderWidth: 1,
//                                 // borderColor: theme.CartScreen_primary_buttonColor
//                             }}
//                                 resizeMode="cover"
//                                 source={{ uri: item.p_image }} />


//                             {/* Title */}
//                             <Text style={{
//                                 color: theme.CartScreen_primary_textColor,
//                                 fontSize: 16,
//                                 width: "70%",
//                                 paddingTop: "3%",
//                                 marginLeft: 10,

//                             }} numberOfLines={6} >{item.p_name} {'\n'}


//                                 {/* price */}
//                                 <Text style={{
//                                     fontSize: 13,
//                                     width: "10%",
//                                     top: "15%"
//                                 }} numberOfLines={1} >Price:  ${item.p_sale_price == '' ? item.p_actual_price : item.p_sale_price
//                                     }{'\n'}</Text>


//                                 {/* Qunatity */}
//                                 <Text style={{
//                                     fontSize: 13,
//                                     width: "10%",
//                                 }} numberOfLines={1} >Quantity:  {item.p_quantity + "\n"}</Text>

//                                 {/*Total  price */}
//                                 <Text style={{
//                                     marginTop: "2%",
//                                     fontSize: 13,
//                                     width: "10%",

//                                 }}
//                                     numberOfLines={1} >Total Price:  ${item.p_sale_price == 0 ? item.p_quantity * item.p_actual_price : item.p_quantity * item.p_sale_price}</Text>
//                                 {/* numberOfLines={1} >TotalPrice:${item.p_sale_price == 0 ? item.p_quantity * item.p_actual_price : item.p_sale_price == null ? item.p_quantity * item.p_actual_price : item.p_quantity * item.p_sale_price}</Text> */}
//                             </Text>


//                             <View style={{
//                                 flex: 0.5,
//                                 marginTop: "10%",
//                                 position: "absolute",
//                                 marginLeft: "97%"
//                             }} >

//                                 <TouchableOpacity
//                                     onPress={() => { this.deleteItemFromCart(index) }}
//                                     style={{
//                                         // backgroundColor: 'plum',
//                                         width: 50,
//                                         height: 50,
//                                         justifyContent: "center"
//                                     }}>

//                                     <MaterialCommunityIcons
//                                         style={{ alignSelf: "center" }}
//                                         name="delete"
//                                         size={22}
//                                         color={theme.delete_icon_color}
//                                     ></MaterialCommunityIcons>
//                                 </TouchableOpacity >
//                             </View>

//                         </View>)
//                     } />


//                 {/* Seperator */}
//                 <View style={{
//                     borderStyle: 'dashed',
//                     borderWidth: 0.8,
//                     borderRadius: 1,
//                     flexDirection: 'row',
//                     width: "100%",
//                     marginTop: "3%",
//                     borderColor: theme.CartScreen_secondary_textColor
//                 }}>

//                 </View>


//                 {/* View For Total Price */}
//                 <View style={{
//                     ...headings.h3,
//                     flexDirection: 'row',
//                     width: "100%",
//                     justifyContent: 'space-between',
//                     alignItems: 'baseline',
//                     marginTop: "2%",
//                     paddingHorizontal: "8%"
//                 }}>

//                     {/* text for total */}
//                     <Text style={{
//                         ...headings.h3,
//                         fontSize: 25,
//                         fontWeight: 'bold',
//                         color: theme.CartScreen_secondary_textColor,

//                     }}> {language.Total} </Text>

//                     {/* text for Total price */}
//                     <Text style={{
//                         ...headings.h3,
//                         fontSize: 25,
//                         color: theme.CartScreen_primary_textColor,
//                         fontWeight: 'bold',
//                     }}>${totalPrice}</Text>

//                 </View>


//                 {/* Checkout Button */}
//                 <TouchableOpacity style={{
//                     flexDirection: 'row',
//                     height: "7%",
//                     width: "90%",
//                     borderRadius: 15,
//                     backgroundColor: theme.CartScreen_primary_buttonColor,
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     alignSelf: 'center',
//                     marginTop: "5%",
//                     marginBottom: "5%"
//                 }}
//                     onPress={() => {
//                         this.state.email ?
//                             (
//                                 this.state.redirectUrl.includes('https://houseoffashion.gtechsol.au/my-account/') &&
//                                 this.insertItemsController(),
//                                 this.setState({
//                                     isloading: true,
//                                 })
//                             ) :
//                             this.props.navigation.navigate("Login")
//                     }}

//                     activeOpacity={0.8}
//                 >
//                     <Text style={{
//                         ...headings.h2,
//                         fontSize: 20,
//                         color: theme.CartScreen_primary_buttonTextColor
//                     }}> {language.Checkout} </Text>

//                 </TouchableOpacity>
//                 {

//                     // !Reached_My_acocout_Link &&
//                     this.state.isloading &&
//                     <View style={{
//                         position: 'absolute',
//                         height: '100%',
//                         width: '100%',
//                         backgroundColor: 'rgba(0,0,0,0.5)',
//                         justifyContent: 'center',
//                         alignItems: 'center',

//                     }}>
//                         <ActivityIndicator
//                             color={'#fff'}
//                             size={'large'}
//                         />
//                         <Text style={[headings.h3, { textAlign: 'center', color: '#fff' }]}>
//                             {this.state.loading_msg}
//                         </Text>
//                     </View>
//                 }

//                 {this.state.email &&
//                     <View style={{
//                         height: this.state.redirectUrl.includes('https://houseoffashion.gtechsol.au/checkout-3/') ? '100%' : 0,
//                         width: this.state.redirectUrl.includes('https://houseoffashion.gtechsol.au/checkout-3/') ? '100%' : 0,
//                         position: 'absolute',
//                         paddingTop: hp(4)
//                     }}>
//                         <WebView
//                             userAgent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko"
//                             ref={(ref) => { this.webViewRef = ref; }}
//                             incognito={true}
//                             originWhitelist={['*']}
//                             style={{ flex: 1 }}
//                             source={{ uri: this.state.redirectUrl }}
//                             onNavigationStateChange={(state) => this.onNavigationStateChange(state)}
//                         />
//                     </View>
//                 }

//                 {
//                     this.state.redirectUrl.includes('https://houseoffashion.gtechsol.au/checkout-2/order-received/') &&
//                     <View style={{
//                         height: '100%',
//                         width: '100%',
//                         position: 'absolute',
//                         paddingTop: hp(4),
//                         backgroundColor: theme.backColor,
//                         alignItems: 'center'
//                     }}>
//                         <View
//                             style={{
//                                 width: '69%',
//                                 marginTop: '12%',
//                                 justifyContent: 'space-between',
//                                 alignItems: 'center'
//                             }}>
//                             <Image style={{
//                                 height: "10%",
//                                 // width: "60%",
//                             }}
//                                 resizeMode="center"
//                                 source={require("../../assets/Images/SplashText.png")}
//                             ></Image>
//                             <View
//                                 style={{
//                                     height: '60%',
//                                     alignItems: 'center',
//                                 }}>
//                                 <Image style={{
//                                     height: "80%",
//                                 }}
//                                     resizeMode="center"
//                                     source={require("../../assets/Images/thankyou.png")}
//                                 ></Image>
//                                 <Text
//                                     style={{
//                                         ...headings.h3,
//                                         textAlign: "center",
//                                         color: '#202129',
//                                     }}>Your Order Has been Received</Text>
//                             </View>
//                         </View>
//                     </View>
//                 }

//             </View>

//         )
//     }
// }


// export default connect(ReducersProps, ReducersActions)(CartScreen)





































import React, { Component, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, FlatList, BackHandler, ActivityIndicator } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Feather';
import PrefManager from '../../data/local/PrefManager';
import { headings } from '../../utils/Styles'
import Helper from '../../utils/Helper';
import { connect } from 'react-redux'
import ReducersProps from '../../data/local/reducers/ReducersProps';
import ReducersActions from '../../data/local/reducers/ReducersActions';
import Urls from '../../data/remote/Urls';
import WooCommerceAPI from 'react-native-wc-api';
import PreloadWebview from '../ReuseAbleComponents/PreloadWebview';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import WebView from 'react-native-webview';
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Urls from '../../data/remote/Urls';


const helper = new Helper()
const prefManager = new PrefManager()
class CartScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: false,
            quantity: 0,
            data: [],
            totalPrice: 0,
            isCheckOut: false,
            isloading: true,



            redirectUrl: '',
            email: '',
            mainUrl: 'https://houseoffashion.gtechsol.au/login/',
            password: '',

            PRELOAD_WEB: '',
            loading_msg: "",
        };
        this.webViewRef = React.createRef();
        // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    deleteItemFromCart(index) {
        let { theme } = this.props
        var tempCartArray = this.state.data
        var tempTotal = this.state.totalPrice
        var product = this.state.data

        if (product[index].p_sale_price == 0) {
            tempTotal = tempTotal - (product[index].p_actual_price * product[index].p_quantity)
        }
        else {
            tempTotal = tempTotal - (product[index].p_sale_price * product[index].p_quantity)
        }

        tempCartArray.splice(index, 1);

        this.setState({ data: tempCartArray, totalPrice: tempTotal })

        prefManager.saveCartData(tempCartArray)
        if (tempCartArray == "") {
            this.props.navigation.goBack();
        }
        helper.showToast("Item Removed From Cart", '#CD113B')
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
        // this.getUserEmailandUniqueId();
    }

    componentWillUnmount() {
        this._unsubscribe();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
    }

    handleBackButtonClick() {
        this.props.navigation.goBack();
        return true;
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            setTimeout(() => {
                this.loadData();
            }, 1000);
        });

        setTimeout(() => {
            this.loadData();
        }, 1000);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    loadData = () => {
        this.setState({ isloading: true }, () => {
            prefManager.getSaveCartData(data => {
                // console.log("///////", data)
                if (data && Array.isArray(data)) {
                    if (data.length > 0) {
                        // Only proceed if data is not empty
                        const totalPrice = this.calculateTotalPrice(data);
                        this.setState({
                            data, totalPrice,
                            // isloading: false
                        });
                        this.getUserEmailandUniqueId();
                    } else {
                        // Handle empty array case here
                        console.log("Info: Data array is empty.");
                        this.setState({
                            isloading: false,
                            data: [], // Handle as needed
                            totalPrice: 0 // Handle as needed
                        });
                        // Optionally call this.getUserEmailandUniqueId() or not, based on your needs
                    }
                } else {
                    // console.error("Error: Invalid data format received.");
                    this.setState({ isloading: false });
                    // Do not call this.getUserEmailandUniqueId() in this case
                }
            });
        });
    };

    calculateTotalPrice(data) {
        let tempTotal = 0;
        data.forEach(product => {
            const price = product.p_sale_price == 0 ? product.p_actual_price : product.p_sale_price;
            tempTotal += price * product.p_quantity;
        });
        return tempTotal;
    }

    getUserEmailandUniqueId = () => {
        prefManager.getSaveUserData(data => {
            if (data && data.length > 0) {
                this.setState({ email: data[0].email, password: data[0].password });
                // this.setState({ isloading: true })
                this.setState({ loading_msg: 'Please wait...!' })
                this.preloadWebView();
            } else {
                // console.error("No user data found.");
                this.setState({ isloading: false })
            }
        });
    };

    preloadWebView = async () => {
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds

        // Just before injecting JavaScript, set the state if necessary
        this.setState({ loading_msg: 'We are collecting your data', isloading: true });

        // Then, inject JavaScript to navigate to the desired URL
        if (this.webViewRef) {
            this.webViewRef.injectJavaScript(`
                window.location.href = 'https://houseoffashion.gtechsol.au/login/';
                true; // Note: It's a good practice to end your injected scripts with a true statement for compatibility reasons.
            `);
        }
    };

    handleLogin = () => {
        const { email, password } = this.state;
        if (!email || !password) {
            console.error("Email or password is empty.");
            return;
        }

        const loginScript = `
            document.getElementById('user_login').value = '${email}';
            document.getElementById('user_pass').value = '${password}';
            document.getElementById('wppb-submit').click();
        `;

        this.webViewRef && this.webViewRef.injectJavaScript(loginScript);
    };

    onNavigationStateChange = (navState) => {
        const redirectUrl = navState.url;
        console.log(".....", navState)

        this.setState({ redirectUrl });
        // console.log("...redirectUrl.....", redirectUrl)
        if (redirectUrl.includes('https://houseoffashion.gtechsol.au/login/?loginerror=')) {
            console.log("Login error occurred");
        } else if (redirectUrl.includes('https://houseoffashion.gtechsol.au/login/')) {
            if (navState.title == 'Login – House of Fashion') {
                this.handleLogin();
            }
            // this.handleLogin();
        } if (redirectUrl.includes('https://houseoffashion.gtechsol.au/my-account/')) {
            if (navState.title == 'My account – House of Fashion') {
                this.setState({ isloading: false });
            }
        }
        if (redirectUrl.includes("https://houseoffashion.gtechsol.au/checkout/order-received/")) {
            setTimeout(() => {
                prefManager.deleteCartData()
                axios.get('https://houseoffashion.gtechsol.au/my-account/customer-logout/?_wpnonce=d7c745644b', {})
                helper.resetAndGo(this.props.navigation, "HomeScreen")
            }, 1000);
        }
    };

    async insertItemsController() {
        const { data } = this.state;
        const users = [];
        this.setState({ loading_msg: 'Hold on....! Your order is Processing' })
        for (let index = -1; index < data.length; index++) {
            if (index === -1) {
                try {
                    const response = await fetch("https://houseoffashion.gtechsol.au?clear-cart", {
                        method: "POST"
                    });
                    console.log("XXXXXXXXXXXXXXXX", "https://houseoffashion.gtechsol.au?clear-cart");
                    users.push(response);
                } catch (error) {
                    console.error("Error emptying cart:", error);
                    // Handle the error as needed
                }
            } else {
                const currentItem = data[index];
                const isVariationIdValid = currentItem.p_weight_id !== undefined && currentItem.p_weight_id !== -1;

                let tempUrl;

                if (!isVariationIdValid) {
                    tempUrl = `https://houseoffashion.gtechsol.au/?add-to-cart=${currentItem.p_id}&quantity=${currentItem.p_quantity}`;
                } else {
                    tempUrl = `https://houseoffashion.gtechsol.au/?add-to-cart=${currentItem.p_id}&quantity=${currentItem.p_quantity}&variation_id=${currentItem.p_weight_id}`;
                }

                try {
                    const response = await fetch(tempUrl, {
                        method: "POST"
                    });

                    console.log("XXXXXXXXXXXXXXXX", tempUrl);
                    users.push(response);
                } catch (error) {
                    console.error("Error adding to cart:", error);
                    // Handle the error as needed
                }

                this.webViewRef.injectJavaScript(`
                window.location.href = 'https://houseoffashion.gtechsol.au/checkout-2/';
                true; // Note: It's a good practice to end your injected scripts with a true statement for compatibility reasons.
            `);
            }

        }


        // this.webViewRef.current.injectJavaScript(`
        //             window.location.href = 'https://houseoffashion.gtechsol.au/checkout-3/';
        //             this.setState({
        //                 isloading: false,
        //             });
        //     `);

        // this.setState({
        //     // mainUrl: "https://houseoffashion.gtechsol.au/checkout-3/",
        //     isloading: false,
        // });
        // console.log("=============================>>>>>>", users);
    }

    proceedTCheckoutCOntroller() {
        prefManager.getSaveUserData(cartData => {
            if (cartData) {
                console.log('Checking the user', cartData)
            }
            else {
                this.props.navigation.navigate("Login")
            }
        })
    }

    inc_dec_controller(type, index) {
        let { data } = this.state
        let tempArray = data

        if (type == "inc") {
            tempArray[index].p_quantity = tempArray[index].p_quantity + 1
            this.setState({ data: tempArray })
        }
        if (type == "dec") {
            tempArray[index].p_quantity = tempArray[index].p_quantity - 1
            this.setState({ data: tempArray })
        }

        prefManager.saveCartData(tempArray)
        var tempTotal = 0
        data.forEach((product, index) => {

            if (product.p_sale_price == 0) {
                tempTotal = tempTotal + (product.p_actual_price * product.p_quantity)
            }
            else {
                tempTotal = tempTotal + (product.p_sale_price * product.p_quantity)
            }
        })
        this.setState({ totalPrice: tempTotal })

    }

    render() {

        let { theme, language, } = this.props
        let { totalPrice, data, billingInfo, shippingInfo, lineItems } = this.state;
        return (
            <View style={{
                flex: 1,
                backgroundColor: theme.CartScreen_primary_backgroundColor,
            }}>

                <StatusBar translucent backgroundColor="transparent" />
                <View style={{
                    flexDirection: "row",
                    paddingVertical:'7%',
                    justifyContent:'space-evenly',
                    alignItems:'center'
                }}>

                    

                    {/* Cart Text */}
                    <Text style={{
                        ...headings.h2,
                        textAlign:'center',
                        color: theme.homeScreen_primary_textColor,
                    }}> {language.My_Cart} </Text>
                    {/* Back Button */}
                    <TouchableOpacity
                        style={{
                            position:'absolute',
                            left:10
                        }}
                        onPress={() => this.props.navigation.navigate("HomeScreen")}
                    >
                        <Icon name='arrow-left' size={28} color={theme.CartScreen_icon_arrowColor} />
                    </TouchableOpacity>
                </View>


                {/* Empty cart image */}
                {((this.state.data == "" || this.state.data == null) && !this.state.isloading) && <View style={{ height: "100%", width: "100%", }}>
                    <Image
                        style={{ height: "48%", width: "80%", marginTop: "25%", justifyContent: "center", alignSelf: "center" }}
                        resizeMode="contain"
                        source={require('../../assets/Images/EmptyCart.png')}
                    >
                    </Image>
                    <Text style={{ marginTop: "1%", textAlign: "center", ...headings.h2, fontWeight: "bold", color: theme.CartScreen_primary_textColor }}>Cart is Empty</Text>

                </View>}



                {/* Flat List For Cart Items */}
                <FlatList
                    nestedScrollEnabled={true}
                    data={this.state.data}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) => (

                        <View style={{
                            backgroundColor: "#364547",
                            paddingVertical: 2,
                            marginTop: "2%",
                            paddingLeft: 16,
                            paddingRight: 16,
                            flexDirection: 'row',
                            width: "100%",

                        }}>


                            {/* Image */}
                            <Image style={{
                                marginVertical: "0.1%",
                                width: "30%",
                                height: 100,
                                borderRadius: 10,
                                // borderWidth: 1,
                                // borderColor: theme.CartScreen_primary_buttonColor
                            }}
                                resizeMode="cover"
                                source={{ uri: item.p_image }} />


                            {/* Title */}
                            <Text style={{
                                color: theme.CartScreen_primary_textColor,
                                fontSize: 16,
                                width: "70%",
                                paddingTop: "3%",
                                marginLeft: 10,

                            }} numberOfLines={6} >{item.p_name} {'\n'}


                                {/* price */}
                                <Text style={{
                                    fontSize: 13,
                                    width: "10%",
                                    top: "15%"
                                }} numberOfLines={1} >Price:  ${item.p_sale_price == '' ? item.p_actual_price : item.p_sale_price
                                    }{'\n'}</Text>


                                {/* Qunatity */}
                                <Text style={{
                                    fontSize: 13,
                                    width: "10%",
                                }} numberOfLines={1} >Quantity:  {item.p_quantity + "\n"}</Text>

                                {/*Total  price */}
                                <Text style={{
                                    marginTop: "2%",
                                    fontSize: 13,
                                    width: "10%",

                                }}
                                    numberOfLines={1} >Total Price:  ${item.p_sale_price == 0 ? item.p_quantity * item.p_actual_price : item.p_quantity * item.p_sale_price}</Text>
                                {/* numberOfLines={1} >TotalPrice:${item.p_sale_price == 0 ? item.p_quantity * item.p_actual_price : item.p_sale_price == null ? item.p_quantity * item.p_actual_price : item.p_quantity * item.p_sale_price}</Text> */}
                            </Text>


                            <View style={{
                                flex: 0.5,
                                marginTop: "10%",
                                position: "absolute",
                                marginLeft: "97%"
                            }} >

                                <TouchableOpacity
                                    onPress={() => { this.deleteItemFromCart(index) }}
                                    style={{
                                        // backgroundColor: 'plum',
                                        width: 50,
                                        height: 50,
                                        justifyContent: "center"
                                    }}>

                                    <MaterialCommunityIcons
                                        style={{ alignSelf: "center" }}
                                        name="delete"
                                        size={22}
                                        color={theme.delete_icon_color}
                                    ></MaterialCommunityIcons>
                                </TouchableOpacity >
                            </View>

                        </View>)
                    } />


                {/* Seperator */}
                <View style={{
                    borderStyle: 'dashed',
                    borderWidth: 0.8,
                    borderRadius: 1,
                    flexDirection: 'row',
                    width: "100%",
                    marginTop: "3%",
                    borderColor: theme.CartScreen_secondary_textColor
                }}>

                </View>


                {/* View For Total Price */}
                <View style={{
                    ...headings.h3,
                    flexDirection: 'row',
                    width: "100%",
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginTop: "2%",
                    paddingHorizontal: "8%"
                }}>

                    {/* text for total */}
                    <Text style={{
                        ...headings.h3,
                        fontSize: 25,
                        fontWeight: 'bold',
                        color: theme.CartScreen_secondary_textColor,

                    }}> {language.Total} </Text>

                    {/* text for Total price */}
                    <Text style={{
                        ...headings.h3,
                        fontSize: 25,
                        color: theme.CartScreen_primary_textColor,
                        fontWeight: 'bold',
                    }}>${totalPrice}</Text>

                </View>


                {/* Checkout Button */}
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    height: "7%",
                    width: "90%",
                    borderRadius: 15,
                    backgroundColor: theme.CartScreen_primary_buttonColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: "5%",
                    marginBottom: "5%"
                }}
                    onPress={() => {
                        this.state.email ?
                            (
                                this.state.redirectUrl.includes('https://houseoffashion.gtechsol.au/my-account/') &&
                                this.insertItemsController(),
                                this.setState({
                                    isloading: true,
                                })
                            ) :
                            this.props.navigation.navigate("LoginScreen")
                    }}

                    activeOpacity={0.8}
                >
                    <Text style={{
                        ...headings.h2,
                        fontSize: 20,
                        color: theme.CartScreen_primary_buttonTextColor
                    }}> {language.Checkout} </Text>

                </TouchableOpacity>
                {

                    // !Reached_My_acocout_Link &&
                    this.state.isloading &&
                    <View style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}>
                        <ActivityIndicator
                            color={'#fff'}
                            size={'large'}
                        />
                        <Text style={[headings.h3, { textAlign: 'center', color: '#fff' }]}>
                            {this.state.loading_msg}
                        </Text>
                    </View>
                }

                {this.state.email &&
                    <View style={{
                        height: this.state.redirectUrl.includes('https://houseoffashion.gtechsol.au/checkout-2/') ? '100%' : 0,
                        width: this.state.redirectUrl.includes('https://houseoffashion.gtechsol.au/checkout-2/') ? '100%' : 0,
                        // height: '100%',
                        // width: '100%',
                        position: 'absolute',
                        paddingTop: hp(4)
                    }}>
                        <WebView
                            userAgent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko"
                            ref={(ref) => { this.webViewRef = ref; }}
                            incognito={true}
                            originWhitelist={['*']}
                            style={{ flex: 1 }}
                            source={{ uri: this.state.redirectUrl }}
                            onNavigationStateChange={(state) => this.onNavigationStateChange(state)}
                        />
                    </View>
                }

                {
                    this.state.redirectUrl.includes('https://houseoffashion.gtechsol.au/checkout/order-received/') &&
                    <View style={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        paddingTop: hp(4),
                        backgroundColor: theme.CartScreen_primary_backgroundColor,
                        alignItems: 'center'
                    }}>
                        <View
                            style={{
                                width: '69%',
                                marginTop: '12%',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                            <Image style={{
                                height: "10%",
                                // width: "60%",
                            }}
                                resizeMode="center"
                                source={require("../../assets/Images/SplashText.png")}
                            ></Image>
                            <View
                                style={{
                                    height: '60%',
                                    alignItems: 'center',
                                }}>
                                <Image style={{
                                    height: "80%",
                                }}
                                    resizeMode="center"
                                    source={require("../../assets/Images/thankyou.png")}
                                ></Image>
                                <Text
                                    style={{
                                        ...headings.h3,
                                        textAlign: "center",
                                        // color: '#202129',
                                        color: '#ffff',
                                    }}>Your Order Has been Received</Text>
                            </View>
                        </View>
                    </View>
                }


            </View >
        );
    }
}
export default connect(ReducersProps, ReducersActions)(CartScreen)




