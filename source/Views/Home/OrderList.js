import React, { Component } from 'react'
import { Text, View, StatusBar, Image, Dimensions, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList, BackHandler, AppRegistry, } from 'react-native'
import { connect } from 'react-redux'
import { headings } from '../../utils/Styles'
import ReducersProps from '../../data/local/reducers/ReducersProps'
import ReducersActions from '../../data/local/reducers/ReducersActions'
import Helper from '../../utils/Helper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import PrefManager from '../../data/local/PrefManager'
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Feather';
import WooCommerceAPI from 'react-native-wc-api';
import Urls from '../../data/remote/Urls'
import moment from 'moment'

const helper = new Helper()
const prefManager = new PrefManager()
const { width: screenWidth } = Dimensions.get('window')


const WooCommerce = new WooCommerceAPI({
    url: Urls.Domain,
    consumerKey: Urls.consumerKey,
    consumerSecret: Urls.consumerSecret,
    wpAPI: true,
    version: 'wc/v3',
    queryStringAuth: true
});

class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryData: [],
            loading: true,
        }
    }
    componentDidMount() {
        // prefManager.getSaveUserData(data => {
        this.FetchingOrderList()
        //     this.graborderListFromFb(data[0].email.toLowerCase())
        // })
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
    }
    handleBackButtonClick() {
        this.props.navigation.navigate("HomeScreen");
        return true;
    }
    sortTheOrdersList(data) {
        return (data.sort(function (a, b) { return a.order_number - b.order_number }).reverse())
    }

    // graborderListFromFb = async (text) => {
    //     firestore()
    //         .collection(text)
    //         .onSnapshot(querySnapshot => {
    //             this.setState({ loading: true })
    //             const documents = querySnapshot.docs.map(doc => doc.data())
    //             // console.log("======================>>>>",this.sortTheOrdersList(documents))

    //             this.setState({ categoryData: this.sortTheOrdersList(documents), loading: false })
    //         })
    // }

    FetchingOrderList() {
        prefManager.getSaveUserData((data) => {
            if (data) {

                console.log("\x1b[33m", '==================order1=============', data[0].customer_id);
                let id = data[0].customer_id

                console.log("\x1b[33m", '==================order1=============', id);

                WooCommerce.get('orders?customer=' + id, {
                }).then(response => {
                    console.log("\x1b[33m", '==================orders=============', response.data);
                    var TempData = []
                    if (response.data != "" && response.data != undefined) {
                        for (let i = 0; i < response.data.length; i++) {
                            TempData.push({
                                "date": moment(response?.data[i]?.date_created).format("DD-MM-YYYY"),
                                "email": response?.data[i]?.billing.email,
                                "order_number": response?.data[i]?.number,
                                "payment_method": response?.data[i]?.payment_method_title,
                                "total_price": "$" + response?.data[i]?.total,
                            })
                            i == response.data.length - 1 &&
                                this.setState({
                                    documents: TempData,
                                    categoryData: this.sortTheOrdersList(TempData),
                                    loading: false
                                })
                        }
                        // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",this.state.categoryData)
                    }
                    else {
                        this.setState({
                            categoryData: "",
                            loading: false
                        })
                    }
                }).catch(error => {
                    console.log("\x1b[33m", '==================products Eroor111111================================', error);
                });
                return
            }
            this.setState({
                loading: false
            })

        })
    }

    headingTitle(title) {
        let { theme, language } = this.props
        return (
            <View style={{
                marginTop: '3%',
                paddingVertical: '7%',
                flexDirection: "row",
                justifyContent: 'center',
                alignItems:'center'
            }}>
                <StatusBar backgroundColor={"transparent"} translucent />
                {/* Back Button */}




                {/* orderlist Text */}
                <Text style={{
                    ...headings.h2,
                    fontWeight: 'bold',
                    color: theme.homeScreen_primary_textColor,
                }}> {language.Orderlist} </Text>


                <TouchableOpacity
                    style={{
                        position:'absolute',
                        left:10
                    }}
                    onPress={() => this.props.navigation.navigate("HomeScreen")}
                >
                    <Icon name='arrow-left' size={30} color={theme.CartScreen_icon_arrowColor} />
                </TouchableOpacity>
            </View>
        )
    }

    sliderDesigns(data) {
        let { theme, } = this.props
        return (
            // <View style={{
            //     height: "270%"
            // }}>
            <>
                <FlatList
                    showsVerticalScrollIndicator={false}

                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return <TouchableOpacity style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginVertical: 25,
                            flexDirection: 'column',
                        }}
                            onPress={() => {
                                BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
                                this.props.navigation.navigate("orderDetail", { id: item.order_number })
                            }}
                        >
                            <Image style={{
                                width: "88%",
                                height: "115%",
                                position: 'absolute',


                                tintColor: theme.order_slip_background,
                            }} source={require('../../assets/Images/slipDesign.png')} />
                            {/* _____________________View for order Number______________________-*/}
                            {this.orderListSubDesign("Order_Number", item.order_number)}
                            {/* _____________________View for email______________________- */}
                            {this.orderListSubDesign("Email", item.email)}
                            {/* ______________________View For date____________________ */}
                            {this.orderListSubDesign("Date", item.date)}
                            {/* _____________________View for Payment Method______________________-*/}
                            {this.orderListSubDesign("Method", item.payment_method)}
                            {/* _____________________Total price______________________- */}
                            {this.orderListSubDesign("Total_Price", item.total_price)}
                        </TouchableOpacity>
                    }} />
            </>
        )
    }

    orderListSubDesign(title, value) {
        let { theme, } = this.props
        return (
            <View style={{
                flexDirection: 'row',
                width: "82%",
                padding: "2.5%",
                borderTopWidth: title != "Order_Number" ? 0.85 : 0,
            }}>
                {/* Icon  */}
                {title == "Order_Number" ?
                    <Octicons name="list-ordered" size={20} color={theme.icon_colors} /> :
                    title == "Email" ?
                        <Fontisto name="email" size={20} color={theme.icon_colors} /> :
                        title == "Date" ?
                            <Fontisto name="date" size={20} color={theme.icon_colors} /> :
                            title == "Method" ?
                                <FontAwesome name="money" size={20} color={theme.icon_colors} /> :
                                <Ionicons name="pricetag-outline" size={20} color={theme.icon_colors} />}
                {/* Text  */}
                <Text style={{
                    ...headings.h3,
                    fontSize: 14,
                    color: theme.order_slip_text,
                    textAlign: "left",
                    marginLeft: "5%"
                }} numberOfLines={1}
                >{title} : <Text style={{ fontSize: 13, fontWeight: "bold", }}>{value}</Text></Text>
            </View>
        )
    }

    render() {
        let { theme, language, languageReducer, themeReducer } = this.props
        let { loading, categoryData } = this.state
        return (
            <View style={{
                flex: 1, backgroundColor: theme.main_background,
                // paddingTop: "10%", 
            }}>
                <StatusBar translucent backgroundColor="transparent" />


                {this.headingTitle("Orders List")}
                {!this.state.loading && this.state.categoryData.length > 0 &&
                    // <View style={{ width: "100%", height: "33.5%",backgroundColor:'yellow'}}>
                    <View style={{ width: "100%", flex: 1 }}>
                        {this.sliderDesigns(this.state.categoryData)}
                    </View>
                }
                {/* Empty cart image */}
                {categoryData == "" && !this.state.loading &&
                    <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                        <View style={{ flex: 0.5, justifyContent: 'space-evenly' }}>
                            <Image
                                style={{ height: "78%", width: "80%", justifyContent: "center", alignSelf: "center" }}
                                resizeMode="contain"
                                source={require('../../assets/Images/Emptylist.png')}
                            >
                            </Image>
                            <Text style={{ marginTop: "-16%", textAlign: "center", ...headings.h2, fontWeight: "bold", color: theme.CartScreen_primary_textColor }}>Orders List is Empty</Text>
                        </View>
                    </View>
                }

                {this.state.loading &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator
                            size={'large'}
                            color={theme.productScreen_primary_buttonColor}
                        />
                        <Text style={{ textAlign: "center", ...headings.h3, fontWeight: "bold", color: theme.CartScreen_primary_textColor }}>Loading...</Text>

                    </View>
                }


            </View>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        width: screenWidth - 60,
        height: screenWidth - 60,
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderRadius: 8,
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
})


export default connect(ReducersProps, ReducersActions)(OrderList)








