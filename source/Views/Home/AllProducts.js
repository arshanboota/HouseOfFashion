import React, { Component } from 'react';
import { View, StatusBar, FlatList, TouchableOpacity, BackHandler, Dimensions, Text, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ReducersProps from '../../data/local/reducers/ReducersProps'
import ReducersActions from '../../data/local/reducers/ReducersActions'
import { connect } from 'react-redux'
import { headings } from '../../utils/Styles'
import PrefManager from '../../data/local/PrefManager'
import Urls from '../../data/remote/Urls'
import WooCommerceAPI from 'react-native-wc-api';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const prefManager = new PrefManager()
var tempCartList = []

const WooCommerce = new WooCommerceAPI({
  url: Urls.Domain,
  consumerKey: Urls.consumerKey,
  consumerSecret: Urls.consumerSecret,
  wpAPI: true,
  version: 'wc/v3',
  queryStringAuth: true,
});


class AllProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prod_id: this.props.route.params.prod_id,
      prod_name: this.props.route.params.prod_name,
      itemsInCart: '',
      categoryAvailable: [],
      categoryAvaialbeProduct: "",
      loading: true



    };
  }
  componentDidMount() {
    this.gettingCategoryWiseProducts()
    this.apiCaller()
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

  }

  handleBackButtonClick() {
    this.props.navigation.navigate("HomeScreen");
    return true;
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
  }
  apiCaller() {
    prefManager.getSaveCartData(data => {
      // console.log("---->>>>>>>>>>>>>", data.length   )

      if (data == null) {
      }
      else {
        tempCartList = data
        if (data.length > 0) {
          this.setState({ itemsInCart: data.length })
          console.log(this.state.itemsInCart)
        }
      }
    })
  }
  gettingCategoryWiseProducts() {
    let tempDataStore = []
    // WooCommerce.get('products/?category=' + this.state.prod_id, {
    //   per_page: '100',
    WooCommerce.get(`products?category=${this.state.prod_id}`, {
      per_page: '100',
      // category:this.state.prod_id
    }).then(response => {
      // console.log("\x1b[33m", '=aaaaaaaaaaaaaaaaaaaaaaaa=================products response================================', JSON.stringify(response.data));
      tempDataStore = response.data
      this.setState({
        categoryAvaialbeProduct: tempDataStore,
        loading: false
      }, () => {
        // console.log("XXxxxxxxxxxxxxxSatate category products", this.state.categoryAvaialbeProduct)
        // console.log("===========================>>>>>>>>>>>>>>>>>>", tempDataStore)
      })
    }).catch(error => {
      this.setState({
        loading: false
      })
      console.log("\x1b[33m", '==================products Error================================', error);
    });
  }





  render() {
    let { theme, language, } = this.props

    return (
      <View style={{ flex: 1 }}>
        {console.log(this.state.prod_id)}
        {console.log(this.state.prod_name)}
        <View style={{
          height: "10%",
          backgroundColor: "#393E46",
          flexDirection: "row",
          paddingBottom: "5%",
          justifyContent: "space-between",
          paddingHorizontal: "3%",
        }}>
          <StatusBar backgroundColor={"transparent"} translucent />
          {/* Back Button */}
          <TouchableOpacity
            style={{
              height: "50%",
              marginTop: "11%",
            }}
            onPress={() => this.props.navigation.goBack()}
          >
            <Icon name='arrow-left' size={28} color={theme.AllProduct_icon_color} />
          </TouchableOpacity>

          {/*  Text */}
          <Text style={{
            ...headings.h2,
            height: "60%",
            marginTop: "10%",
            color: "#79B4B7",
            fontWeight: "bold"
          }}>{this.state.prod_name}</Text>


          {/* Cart Button */}
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('CartScreen')}
            style={{
              top: "8%",
              borderRadius: 100,
            }}>

            <Text
              style={{
                color: "white",
                fontSize: 10,
                top: 1,
                fontWeight: "bold",
                bottom: 0,
                textAlign: 'center',
              }}
            >{this.state.itemsInCart}</Text>
            <Entypo name='shopping-cart' size={22} color={theme.AllProduct_icon_color} />
          </TouchableOpacity>
        </View>

        {
          !this.state.loading &&
          <View style={{
            // height: windowHeight < 660 ? 572 : 680,
            flex: 1,
            marginTop: 3
          }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              numColumns={2}
              data={this.state.categoryAvaialbeProduct}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => {
                return item.stock_status == "instock" ? <TouchableOpacity style={{
                  width: wp(48),
                  height: hp(37),
                  marginHorizontal: hp(0.5),
                  alignSelf: "center",
                  marginBottom: hp(1),
                  backgroundColor: "#737473",
                  borderRadius: 5
                  // backgroundColor: "#421244",
                }}
                  onPress={() => {
                    this.props.navigation.navigate("ProductScreen", { productData: item })
                  }}
                >
                  {(item.images.length > 0) &&
                    <Image

                      source={{
                        uri: item.images[0].src.replace(" ", '')
                      }}
                      style={{
                        width: "99%",
                        height: "70%",
                        borderRadius: 5,
                        alignSelf: "center",
                        marginTop: "0.5%"
                      }}
                      resizeMode="cover"
                    />}
                  <View style={{ height: hp(12), borderRadius: 10, marginHorizontal: "2%" }}>
                    <Text style={{

                      ...headings.h2,
                      fontSize: 15,
                      color: theme.product_title_color,
                      textAlign: "left",
                      height: "60%",
                      paddingHorizontal: "6%"
                    }} numberOfLines={2} >{item.name}</Text>

                    {item.sale_price != "" &&
                      <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        height: "30%",

                      }}>
                        <Text style={{
                          ...headings.h2,
                          fontSize: 15,
                          color: theme.sale_price_color,
                          textAlign: "left",
                          textAlignVertical: "center",
                          fontWeight: "600",
                          paddingLeft: "6%",
                          textDecorationLine: 'line-through',
                          textDecorationStyle: 'solid'
                        }} >${item.regular_price}</Text>

                        <Text style={{
                          ...headings.h2,
                          fontSize: 15,
                          color: theme.product_price_color,
                          textAlign: "left",
                          fontWeight: "600",
                          paddingLeft: "6%"
                        }} >${item.sale_price}</Text>
                      </View>}

                    {item.sale_price == "" &&
                      <Text style={{
                        height: "30%",
                        ...headings.h3,
                        fontSize: 15,
                        color: theme.product_price_color,
                        textAlign: "left",
                        fontWeight: "600",
                        paddingLeft: "6%"
                      }} >${item.price}</Text>
                    }
                  </View>
                </TouchableOpacity>
                  :
                  <View></View>
              }} />
          </View>
        }

        {
          this.state.loading &&
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center'
          }}>
            <ActivityIndicator
              size={'large'}
              color={'#fff'}
            />

          </View>
        }


      </View>
    );
  }
}
export default connect(ReducersProps, ReducersActions)(AllProducts)