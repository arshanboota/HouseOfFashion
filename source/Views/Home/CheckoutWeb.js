import React, { Component } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux'
import { headings } from '../../utils/Styles'
import ReducersProps from '../../data/local/reducers/ReducersProps'
import ReducersActions from '../../data/local/reducers/ReducersActions'
import PrefManager from '../../data/local/PrefManager'
import Helper from '../../utils/Helper';
import { WebView } from 'react-native-webview';
import axios from "axios"
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ThemeConsumer } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';

const date = new Date()
const prefManager = new PrefManager()
const helper = new Helper()
class CheckoutWeb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productData: props.route.params?.productData ?? ``,
      mainUrl: "",
      redirectUrl: "",
      orderInfo: "",
      uniqueId: "",
      email: "",

    };
  }
  componentDidMount() {
    this.insertItemsCOntroller()
    // console.log('----------Products data---------', this.state.productData)
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.getUserEmailandUniqueId()
  }
  async insertItemsCOntroller() {

    let { productData } = this.state
    let users = [];
    for (let index = -1; index < productData.length; index++) {

      if (index == -1) {
        const response = await axios.post("https://houseoffashion.gtechsol.au/?empty-cart")
        users.push(response);
        // console.log("XXXXXXXXXXXXXXXX", "https://houseoffashion.gtechwebb.com/?empty-cart")
      }
      else {

        if (productData[index].p_varition_id == -1) {
          var tempUrl = "https://houseoffashion.gtechsol.au/?add-to-cart=" + productData[index].p_id + "&quantity=" + productData[index].p_quantity
          const response = await axios.post(tempUrl)
          // console.log("XXXXXXXXXXXXXXXX", tempUrl)
          users.push(response);
        }
        else {
          var tempUrl = "https://houseoffashion.gtechsol.au/?add-to-cart=" + productData[index].p_id + "&quantity=" + productData[index].p_quantity + "&variation_id=" + productData[index].p_varition_id
          const response = await axios.post(tempUrl)
          // console.log("XXXXXXXXXXXXXXXX", tempUrl)
          users.push(response);
        }
      }


    }

    this.setState({ mainUrl: "https://houseoffashion.gtechsol.au/checkout-2/" })
    // console.log("=============================>>>>>>", users);
  }
  getUserEmailandUniqueId() {
    prefManager.getSaveUserData(data => {
      this.setState({ email: data[0].email })
      console.log('______________Data____________', data)
      console.log('______________Data Email ____________', data[0].email)
    })


    // unique id for firebase store data entery 
    var date = new Date()
    var tempId = date.getDate() + "" + date.getMonth() + "" + date.getFullYear() + "" +
      date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + "" + date.getMilliseconds()
    this.setState({ uniqueId: tempId })
    // console.log('______Temp Id__________',tempId)
  }




  ActivityIndicatorElement = () => {
    let { theme } = this.props
    let { mainUrl } = this.state
    return (
      <View style={{
        backgroundColor: theme.mainBackground,
        width: "100%",
        height: mainUrl == "" ? "89.7%" : "100%",
      }}>


        {/* Indicator */}
        <ActivityIndicator
          size="large"
          color={theme.CartScreen_primary_buttonColor}
          style={{ alignSelf: 'center', marginTop: "80%" }}
        />

      </View>
    );
  };
  injectjs() {
    let jsCode = `var priceEls = document.getElementsByClassName("woocommerce-order-overview woocommerce-thankyou-order-details order_details");
    
    for (var i = 0; i < priceEls.length; i++) {
  var price = priceEls[i].innerText;
window.ReactNativeWebView.postMessage(price);    
}`;
    return jsCode;
  }

  orderDetailWritingToFB() {
    var tempData = this.state.orderInfo.split("\n")
    console.log(tempData)
    firestore()
      .collection(this.state.email.toLowerCase())
      .doc(this.state.uniqueId)
      .set({
        order_number: tempData[1] == null || tempData[1] == undefined ? " Not Available " : tempData[1],
        date: tempData[3] == null || tempData[3] == undefined ? " Not Available " : tempData[3],
        total_price: tempData[5] == null || tempData[5] == undefined ? " Not Available " : tempData[5],
        payment_method: tempData[7] == null || tempData[7] == undefined ? " Not Available " : tempData[7],
        email: this.state.email.toLowerCase(),


        // order_number: tempData[1]==null||tempData[1]==undefined ? " Not Available " :  tempData[1],
        // date: tempData[3]==null||tempData[3]==undefined ? " Not Available " :  tempData[3],
        // total_price: tempData[7]==null||tempData[7]==undefined ? " Not Available " :  tempData[7],
        // payment_method: tempData[9]==null||tempData[9]==undefined ? " Not Available " :  tempData[9],
        // email: tempData[5]==null||tempData[5]==undefined ? this.state.email.toLowerCase() :  tempData[5] ,
      })
      .then(() => {
        console.log('Order Info Added Into Firebase');
      });
  }
  render() {
    let { theme, language, languageReducer, themeReducer } = this.props
    let { redirectUrl, htmlContent, headerTitle, isLoading } = this.state
    return (
      <View style={{ flex: 1, alignItems: "center", backgroundColor: theme.mainBackground_cart }}>


        <View
          style={{
            width: "100%",
            height: redirectUrl.includes("https://houseoffashion.gtechsol.au/order-received") ? "94%" : "100%",
            position: "absolute",
          }}>


          {/* header  */}
          <View style={{
            // height: "9.5%",
            height: 75,
            paddingTop: "4%",
            flexDirection: 'row',
            alignItems: "center",
            paddingHorizontal: "3%",
            marginBottom: "2%",
            backgroundColor: theme.Checkout_backgroundColor


          }}>
            <TouchableOpacity
              style={{
                marginLeft: "-1%",
                marginTop: '7%',
                width: "9%",
                height: "40%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                if (redirectUrl.includes("https://houseoffashion.gtechsol.au/checkout/order-received")) {
                  helper.resetAndGo(this.props.navigation, "HomeScreen")

                }
                else {
                  helper.showToast("Order is not placed", theme.loginScreen_buttonColor)
                }
              }}
            >
              <AntDesign
                style={{}}
                name="left"
                size={25}
                color={theme.Header_Icon_color}
              ></AntDesign>
            </TouchableOpacity>

            <Text style={{
              ...headings.h2,
              textAlign: "left",
              color: theme.productScreen_secondary_textColor,
              marginTop: '7%',
              marginLeft: '25%',
            }}>CheckOut</Text>

          </View>



          {this.state.mainUrl != "" &&
            <WebView
              showsVerticalScrollIndicator={false}
              // onLoad={() => this.hideSpinner()}
              style={{
                opacity: 0.99,
              }}
              ref='_webView'
              renderLoading={this.ActivityIndicatorElement}
              startInLoadingState={true}
              source={{ uri: this.state.mainUrl }}
              onShouldStartLoadWithRequest={event => !event.url.includes("https://houseoffashion.gtechsol.au/product")}
              onNavigationStateChange={(state) => {
                console.log("===>===>===>===>===>===>===>", state.url)
                this.setState({ redirectUrl: state.url })
              }}
              injectedJavaScript={redirectUrl.includes("https://houseoffashion.gtechsol.au/checkout/order-received") ? this.injectjs() : null}
              onMessage={(event) => this.setState({ orderInfo: event.nativeEvent.data }, () => {
                this.orderDetailWritingToFB()
                prefManager.deleteCartData()
                console.log('____________Order Info_____________', this.state.orderInfo)
              })

              }

            />
          }

          {redirectUrl.includes("http://houseoffashion.gtechweb.au/checkout/order-received/") &&
            <TouchableOpacity style={{
              backgroundColor: theme.productScreen_secondary_textColor,
              alignSelf: 'center',
              justifyContent: "center",
              // position: 'absolute',
              bottom: 5,
              width: "70%",
              height: "5%",
              // top: "100%",
              marginTop: "5%",
              borderTopRightRadius: 50,
              borderBottomRightRadius: 50,
              borderBottomLeftRadius: 50,
            }}
              onPress={() => {
                prefManager.deleteCartData()
                helper.resetAndGo(this.props.navigation, "HomeScreen")
              }}>
              <Text style={{
                ...headings.h2,
                fontSize: 20,
                color: theme.mainBackground_ProductDetail,
                textAlign: "center",
              }}>Continue Shopping</Text>

            </TouchableOpacity>}

          {this.state.mainUrl == "" &&
            this.ActivityIndicatorElement()
          }

        </View>

      </View>
    );
  }
}
export default connect(ReducersProps, ReducersActions)(CheckoutWeb)