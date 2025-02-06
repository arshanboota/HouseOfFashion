import React, { Component } from 'react'
import { Text, View, StatusBar, Image, BackHandler, FlatList, TouchableOpacity, ScrollView, RefreshControl, ImageBackground, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { headings } from '../../utils/Styles'
import ReducersProps from '../../data/local/reducers/ReducersProps'
import ReducersActions from '../../data/local/reducers/ReducersActions'
import SimpleStyleButton from '../ReuseAbleComponents/SimpleStyleBUtton'
import Helper from '../../utils/Helper';
import { SliderBox } from "react-native-image-slider-box";
import SimpleFLatList from '../ReuseAbleComponents/SimpleFLatList';
import WooCommerceAPI from 'react-native-wc-api';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PrefManager from '../../data/local/PrefManager'
import Urls from '../../data/remote/Urls'
import axios from 'axios';


// working area >>>>>>>>>>>>>>>>>>>>>

const WooCommerce = new WooCommerceAPI({
    url: Urls.Domain,
    consumerKey: Urls.consumerKey,
    consumerSecret: Urls.consumerSecret,
    wpAPI: true,
    version: 'wc/v3',
    queryStringAuth: true,
});


const prefManager = new PrefManager()
const helper = new Helper()
class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryAvailable: [],
            categoryAvailableProducts: "",
            refreshing: false,
            loadingBody: true,
            isLoading: true,
            nodata: false,
            LogoutData: '',
            images: [
                "http://houseoffashion.gtechweb.au/Mobile_Headers/header1.jpg" + '?random_number=' + new Date().getTime(),
                "http://houseoffashion.gtechweb.au/Mobile_Headers/header2.jpg" + '?random_number=' + new Date().getTime(),
                "http://houseoffashion.gtechweb.au/Mobile_Headers/header3.jpg" + '?random_number=' + new Date().getTime(),
                "http://houseoffashion.gtechweb.au/Mobile_Headers/header4.jpg" + '?random_number=' + new Date().getTime(),
                "http://houseoffashion.gtechweb.au/Mobile_Headers/header5.jpg" + '?random_number=' + new Date().getTime(),
                "http://houseoffashion.gtechweb.au/Mobile_Headers/header6.jpg" + '?random_number=' + new Date().getTime(),
                "http://houseoffashion.gtechweb.au/Mobile_Headers/header7.jpg" + '?random_number=' + new Date().getTime(),
                "http://houseoffashion.gtechweb.au/Mobile_Headers/header8.jpg" + '?random_number=' + new Date().getTime(),
            ],
        };
    }
    componentDidMount() {
        this.apiCallForAllCategory()
        // this.fetchProductCategories()
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        // prefManager.getSaveUserData(data=>{
        //     this.setState({
        //         LogoutData:data
        //     },()=>{
        //         console.log('Logout data',this.state.LogoutData)
        //     })
        //   })

        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({
                submenu: false

            })
        });
    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
    }
    componentWillUnmount() {
        this._unsubscribe();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
    }
    handleBackButtonClick() {
        BackHandler.exitApp()
        return true;
    }

    apiCallForAllCategory() {

        this.setState({
            categoryAvailable: [],
            categoryAvailableProducts: "",
        })
        let tempDataStore = []

        // NEWLY ADDED
        WooCommerce.get('products/categories', {
            perpage: 100,
        }).then(response => {
            // console.log("...........", response)
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




                    WooCommerce.get(`products?category=${response.data[index].id}`, {
                        // per_page: 100,
                      }).then(response => {
                        // console.log("\x1b[33m", '==================products response================================', JSON.stringify(response.data));
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



        // WooCommerce.get('products/categories', {
        //     perpage: 100,
        // }).then(response => {
        //     console.log('response of categories', response)
        //     if (response.data == null && response.data == undefined) {
        //         // this.Nodata()
        //         this.setState({ nodata: true })
        //     }

        //     else {
        //         this.setState({ categoryAvailable: response.data }, () => {
        //             // console.log('--------------------getting available category------------------', this.state.categoryAvailable)
        //         })
        //         for (let index = 0; index < response.data.length; index++) {
        //             // console.log( response.data[index].id)
        //             // var id=response.data[index].id
        //             WooCommerce.get('products/', {
        //                 per_page: '100',
        //                 category: response.data[index].id
        //             }).then(response => {
        //                 //   console.log("\x1b[33m", '==================products response================================', JSON.stringify(response.data));
        //                 //   console.log("\x1b[33m", '==================products response================================',response.data);
        //                 tempDataStore[index] = response.data
        //                 this.setState({
        //                     categoryAvailableProducts: tempDataStore,

        //                 }, () => {
        //                     this.state.isLoading = false
        //                     // console.log("\x1b[33m ------------CATEGORY PRODUCTS -------->>>>>", this.state.categoryAvailableProducts.length)
        //                     console.log("===========================>>>>>>>>>>>>>>>>>>", tempDataStore)
        //                 })
        //             }).catch(error => {
        //                 console.log("\x1b[33m", '==================products Error================================', error);
        //             });
        //         }
        //         this.setState({ loadingBody: false, refreshing: false })
        //     }
        //     // WooCommerce.get('products/', {
        //     //     per_page: '100',
        //     //     category: response.data[index].id
        //     // }).then(response => {
        //     //     //   console.log("\x1b[33m", '==================products response================================', JSON.stringify(response.data));
        //     //     //   console.log("\x1b[33m", '==================products response================================',response.data);
        //     //     tempDataStore[index] = response.data
        //     //     this.setState({
        //     //         categoryAvailableProducts: tempDataStore,

        //     //     }, () => {
        //     //         this.state.isLoading = false
        //     //         // console.log("\x1b[33m ------------CATEGORY PRODUCTS -------->>>>>", this.state.categoryAvailableProducts.length)
        //     //         console.log("===========================>>>>>>>>>>>>>>>>>>", tempDataStore)
        //     //     })
        //     // }).catch(error => {
        //     //     console.log("\x1b[33m", '==================products Error================================', error);
        //     // });

        // }).catch(error => {
        //     console.log("\x1b[33m", '==================cat Error================================', error);
        // });
    }



    Nodata = () => {
        let { theme, } = this.props
        return (

            <View style={{ position: "absolute", height: "100%", width: "100%", justifyContent: "center" }}>
                <Image style={{ height: "60%", width: "100%" }} resizeMode="center"

                    source={require("../../assets/Images/404.png")}
                >

                </Image>
                {/* <Text style={{marginTop:"40%", color: "white" }}> umair</Text>\ */}
            </View>
        )
    }
    _onRefresh = () => {

        this.setState({
            refreshing: true,
            loadingBody: true
        });
        this.setState({
            categoryAvailableProducts: ""
        }, () => {
            this.apiCallForAllCategory()
        })
    }
    headingTitle(title) {
        let { theme, language } = this.props
        return (
            <View style={{
                height: "11%",
                marginVertical: 2,
                paddingLeft: "4%",
                flexDirection: "row",
                alignItems: "center",
                // backgroundColor:"pink"
            }}>
                <View style={{
                    backgroundColor: theme.sidebar_color,
                    width: "1%",
                    marginTop: "0.5%",
                    borderRadius: 20,
                    height: "85%"
                }} />

                <Text style={{
                    height: "100%",
                    width: "50%",
                    ...headings.h2,
                    color: theme.homeScreen_primary_textColor,
                    textAlign: "left",
                }} > {title}</Text>


            </View>
        )
    }
    sliderDesigns(data) {
        let { theme, } = this.props
        return (
            <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return item.stock_status == "instock" ? <TouchableOpacity style={{
                        width: wp(45),
                        height: hp(35),
                        marginHorizontal: hp(0.8),
                        alignSelf: "center",
                        borderRadius: 10,
                        backgroundColor: "#737473",
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
                                paddingTop: "2%",
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
        )
    }


    render() {
        let { theme, language, } = this.props
        return (
            <View style={{
                alignItems: 'center',
            }}>

                <StatusBar backgroundColor={"transparent"} translucent />

                {/* View For Home Screen */}
                <View style={{
                    backgroundColor: theme.homeScreen_primary_backgroundColor,
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                }}>

                    {/* Header Text */}
                    <Text style={{
                        ...headings.h2,
                        height: "6%",
                        color: theme.homeScreen_primary_textColor,
                        marginTop: "10%",
                        textAlign: 'center',
                        fontWeight: "bold"
                    }}> {language.Fashion_Store} </Text>


                    {/*logout button  */}
                    {/* {this.state.LogoutData !=""  &&this.state.LogoutData !=undefined&& 
                    <TouchableOpacity style={{
                        position: "absolute",
                        right: 7,
                        top: 35,
                        padding: 4,
                    }}
                        onPress={() => {
                            prefManager.deleteUsertData()
                            helper.resetAndGo(this.props.navigation, "LoginScreen")

                        }}>
                        <MaterialIcons name="logout" size={24} color={theme.home_icon_color} />
                    </TouchableOpacity>

                } */}




                    {/*  drawer  button  */}
                    <TouchableOpacity style={{
                        position: "absolute",
                        left: 10,
                        top: 36,
                        padding: 4,
                        borderRadius: 100
                    }}
                        onPress={() => {
                            this.props.navigation.toggleDrawer();

                        }}>
                        <MaterialIcons name="menu" size={25} color={theme.home_icon_color} />
                    </TouchableOpacity>

                    {this.state.categoryAvailable.length != this.state.categoryAvailableProducts.length &&
                        <ActivityIndicator
                            size="large"
                            color={theme.CartScreen_primary_buttonColor}
                            style={{
                                marginTop: '80%',
                                alignSelf: "center",
                            }}
                        />}

                    {this.state.categoryAvailable == "" &&
                        <ActivityIndicator
                            size="large"
                            color={theme.CartScreen_primary_buttonColor}
                            style={{
                                marginTop: '80%',
                                alignSelf: "center",
                            }}
                        />}

                    {/* {(!this.state.loadingBody && this.state.categoryAvailable.length == this.state.categoryAvailableProducts.length) && */}
                    {this.state.categoryAvailableProducts !== "" &&
                        <ScrollView style={{
                            marginTop: 2,
                            width: wp(100),
                            height: hp(80),
                            marginBottom: 2,
                        }}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh}
                                />
                            }>

                            {/* Image Slider View */}
                            <View style={{
                                width: "96%",
                                alignSelf: 'center',
                                borderRadius: 10,
                                overflow: 'hidden',

                            }}>

                                {/* image Slider */}
                                <SliderBox
                                    images={this.state.images}
                                    sliderBoxHeight={165}
                                    dotColor={theme.homeScreen_slider_dotColor}
                                    autoplay={true}
                                    borderRadius={20}
                                    autoplayInterval={9000}
                                    circleLoop={true}
                                    // imageLoadingColor="#79B4B7"
                                    imageLoadingColor={theme.homeScreen_slider_indicatorColor}
                                    dotStyle={{ marginLeft: -10 }}
                                />
                            </View>

                            {this.state.categoryAvailable.map((data, index) => {
                                if (index < this.state.categoryAvailable.length) {
                                    return (
                                        <View style={{
                                            width: "100%", height: 310,
                                        }}>
                                            {this.headingTitle(data.name)}
                                            {this.state.categoryAvailableProducts[index] != undefined &&
                                                this.sliderDesigns(this.state.categoryAvailableProducts[index])}
                                        </View>
                                    )
                                }
                            })}


                        </ScrollView>}

                    {/* </ScrollView>  */}
                </View>
                {this.state.nodata == true &&
                    this.Nodata()
                }


            </View>

        )
    }
}


export default connect(ReducersProps, ReducersActions)(HomeScreen)