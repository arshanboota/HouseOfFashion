import React, { Component } from 'react';
import { Text, View, StatusBar, Image, BackHandler, FlatList, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { headings } from '../../utils/Styles'
import ReducersProps from '../../data/local/reducers/ReducersProps'
import ReducersActions from '../../data/local/reducers/ReducersActions'
import Helper from '../../utils/Helper';
import WooCommerceAPI from 'react-native-wc-api';
import PrefManager from '../../data/local/PrefManager'

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Urls from '../../data/remote/Urls'

const prefManager = new PrefManager()
const helper = new Helper()


const WooCommerce = new WooCommerceAPI({
    url: Urls.Domain,
    consumerKey: Urls.consumerKey,
    consumerSecret: Urls.consumerSecret,
    wpAPI: true,
    version: 'wc/v3',
    queryStringAuth: true,     // sending secure https request
});
class orderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.route.params?.id ?? ``,
            name: "",
            phone: '',
            email: '',
            address: '',
            date: '',
            order_status: '',
            total: '',
            payment_method: '',
            customer_note: '',
            shipping_deatil: '',
            currency_symbol: "",
            products: [
                {
                    id: '1',
                    title: 'Write product name here, write product name here.',
                    quantity: "Qty: 1",
                    price: '$2000.00',
                },
            ]
        };
    }

    componentDidMount() {
        this.getOrderDetails()
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick.bind(this));
    }
    handleBackButtonClick() {
        this.props.navigation.goBack();
        return true;
    }
    getOrderDetails() {
        console.log(this.state.id)
        WooCommerce.get('orders/', {
            id: this.state.id,
        }).then(response => {
            console.log("\x1b[33m", '==================products response================================', JSON.stringify(response.data[0]));

            this.setState({
                name: response.data[0].billing.first_name + " " + response.data[0].billing.last_name,
                phone: response.data[0].billing.phone,
                email: response.data[0].billing.email,
                address: response.data[0].billing.address_1 + " , " + response.data[0].billing.address_2 + " , " + response.data[0].billing.city,
                date: response.data[0].date_created.split('T')[0],
                order_status: response.data[0].status,
                total: response.data[0].total.split('.')[0],
                payment_method: response.data[0].payment_method_title,

                customer_note: response.data[0].customer_note,

                shipping_deatil: parseInt(response.data[0].shipping_total) + parseInt(response.data[0].shipping_tax),
                currency_symbol: response.data[0].currency_symbol,
                products: response.data[0].line_items
            })


        }).catch(error => {
            console.log("\x1b[33m", '==================products Eroor================================',
                error);
        });
    }

    render() {

        let { theme, } = this.props
        let { name, phone, email, address, date, order_status, total, payment_method, customer_note, shipping_deatil, currency_symbol } = this.state
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: theme.SignupScreen_primary_backgroundColor,
            }}>

                <StatusBar translucent backgroundColor="transparent" />

                {/* ActivityIndicator */}
                {date == "" &&
                    <View style={{
                        backgroundColor: theme.SignupScreen_primary_backgroundColor,
                        width: "100%", height: "100%",
                        //  flex:1,
                        position: "absolute",
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        justifyContent: 'center'
                    }}>
                        <ActivityIndicator
                            size="large"
                            color={theme.productScreen_primary_buttonColor}
                            style={{ alignSelf: 'center', }}
                        />
                    </View>}

                {/* __________________________View for header____________________________ */}
                <View style={{
                    flexDirection: 'row',
                    // width: "100%",
                    // height: "10%",
                    backgroundColor: theme.welcomeScreen_primary_light_textColor,
                    alignItems: 'center',
                    // marginTop: "3%",
                    paddingVertical:'8%',
                    justifyContent:'center'

                }} >
                    {/* Back Button */}
                    <TouchableOpacity
                        style={{
                            position:'absolute',
                            left:10
                            // marginLeft: "2%",
                            // width: "9%",
                            // height: "55%",
                            // backgroundColor:"red",
                            // marginTop: "3%"
                        }}
                        onPress={() => { this.props.navigation.goBack(); }}
                    >
                        <AntDesign
                            name="left"
                            size={22}
                            color={'#fff'}
                        ></AntDesign>
                    </TouchableOpacity>


                    {/*Text for Order no*/}
                    <Text style={{
                        ...headings.h3,
                        // marginTop: '3%',
                        fontSize: 20,
                        // marginLeft: "23%",
                        color: theme.productScreen_secondary_textColor,
                    }} >Order #{this.state.id}</Text>
                </View>

                {date != "" &&
                    <>

                        {/* __________________________View for Status ( Completed/Pending )____________________________ */}
                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: theme.background_Color,
                            height: "5%",
                            width: "100%",
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>

                            {/* Icon for completed */}
                            <FontAwesome5 name='bullhorn' size={20} color={theme.Icon_Primary_Color}
                            />

                            {/* Text */}
                            <Text style={{
                                ...headings.h3,
                                paddingLeft: "2%",
                                fontSize: 17,
                                color: theme.Orderlist_primary_textColor,
                            }}>{order_status}</Text>

                        </View>

                        {/* =========================== Scrollable screen =============================== */}
                        <ScrollView style={{
                            height: "100%",
                            width: "100%",
                            marginTop: "0.5%",
                            marginBottom: "6%",
                            paddingLeft: 16,
                            paddingRight: 16,
                        }} >
                            <View style={{
                                backgroundColor: theme.background_Color,
                                padding: 20,
                                marginTop: "2%",
                                borderRadius: 5,

                            }}>

                                {/* ___Child-View for Name and date___ */}
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: 'space-between',

                                }}>
                                    {/* Name */}
                                    <Text style={{
                                        ...headings.h3,
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        width: "65%",
                                        color: theme.Orderlist_primary_textColor,
                                    }} numberOfLines={1} >{name}</Text>

                                    {/* Date */}
                                    <Text style={{
                                        ...headings.h3,
                                        color: theme.Orderlist_primary_textColor,
                                        width: "30%",
                                        fontSize: 15,
                                        paddingTop: 5,
                                        textAlign: "right"
                                    }} numberOfLines={1}>{date}</Text>
                                </View>


                                {/* ___Child-View for Address___ */}
                                <View style={{
                                    flexDirection: "column",
                                    paddingTop: 10

                                }}>

                                    {/* Number Text */}
                                    <Text style={{
                                        ...headings.h3,
                                        fontSize: 13,
                                        color: theme.Orderlist_primary_textColor, paddingTop: 3, width: "95%"
                                    }} numberOfLines={1}>
                                        <Entypo name='phone' size={15} color={theme.Icon_Primary_Color} />
                                        {'  '}{phone}</Text>

                                    {/* Email Text */}
                                    <Text style={{
                                        ...headings.h3,
                                        fontSize: 13,
                                        color: theme.Orderlist_primary_textColor, paddingTop: 3, width: "95%"
                                    }} numberOfLines={1}>
                                        <Ionicons name='mail' size={15} color={theme.Icon_Primary_Color} />
                                        {'  '}{email}</Text>

                                    {/* Address text */}
                                    <Text style={{
                                        ...headings.h3,
                                        fontSize: 13,
                                        color: theme.Orderlist_primary_textColor, paddingTop: 5, width: "95%"
                                    }} numberOfLines={1}>
                                        <Entypo name='location-pin' size={15} color={theme.Icon_Primary_Color} />
                                        {'  '}{address}</Text>
                                </View>
                            </View>
                            {/* __________________________View for Total payment____________________________ */}
                            <View style={{
                                backgroundColor: theme.background_Color,
                                padding: 20,
                                marginTop: "3%",
                                borderRadius: 5,

                            }}>

                                {/* ___ Child View for payment ___ */}
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',

                                }}>
                                    {/* Text for payment */}
                                    <Text style={{
                                        ...headings.h3,
                                        color: theme.Orderlist_primary_textColor,
                                        fontSize: 18,
                                        // color: theme.primary_text_color,
                                        width: "45%"
                                    }} numberOfLines={1}>Total Payment
                                    </Text>

                                    <Text style={{
                                        ...headings.h3,
                                        //  color: theme.secondary_text_dark_color,
                                        fontSize: 18,
                                        color: theme.Orderlist_primary_textColor,
                                        paddingTop: "1%",
                                        width: "35%",
                                        textAlign: "right"
                                    }}
                                        numberOfLines={1}>{currency_symbol}{total}
                                    </Text>

                                </View>
                            </View>


                            {/* __________________________View for Payment Method____________________________ */}
                            <View style={{
                                backgroundColor: theme.background_Color,
                                padding: 20,
                                borderRadius: 5,
                                marginTop: "3%",
                            }}>

                                {/* ___ Child View for payment ___ */}
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>

                                    {/* Text for payment */}
                                    <Text style={{
                                        ...headings.h3,
                                        color: theme.Orderlist_primary_textColor,
                                        fontSize: 18,
                                        // color: theme.primary_text_color,
                                        width: "40%"
                                    }} numberOfLines={1}>
                                        <FontAwesome name='credit-card' size={18} color={theme.Icon_Primary_Color} />
                                        {' '}Payment</Text>

                                    <Text style={{
                                        ...headings.h3,
                                        //  color: theme.secondary_text_dark_color,
                                        fontSize: 15,
                                        paddingTop: "1%",
                                        color: theme.Orderlist_primary_textColor,
                                        width: "60%",
                                        textAlign: "right"
                                    }} numberOfLines={1}>{payment_method}</Text>

                                </View>
                            </View>

                            {/* __________________________View for Shipping method____________________________ */}
                            <View style={{
                                backgroundColor: theme.background_Color,
                                padding: 20,
                                borderRadius: 5,
                                marginTop: "3%"
                            }}>

                                {/* ___ Child View for shipping ___ */}
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                    {/* Text for shipping */}
                                    <Text style={{
                                        ...headings.h3,
                                        color: theme.Orderlist_primary_textColor,
                                        fontSize: 18,
                                        // color: theme.primary_text_color,
                                        width: "40%",
                                    }} numberOfLines={1}>
                                        <FontAwesome5 name='truck' size={18} color={theme.Icon_Primary_Color} />
                                        {' '}Shipping </Text>

                                    <Text style={{
                                        ...headings.h3,
                                        //  color: theme.secondary_text_dark_color,
                                        fontSize: 15,
                                        paddingTop: "1%",
                                        textAlign: "right",
                                        color: theme.Orderlist_primary_textColor,
                                        width: "60%"
                                    }} numberOfLines={1}>{currency_symbol}{shipping_deatil == 0 ? "Free Shipping" : shipping_deatil}</Text>

                                </View>
                            </View>
                            {/* __________________________View for Order Note____________________________ */}
                            <View style={{
                                backgroundColor: theme.background_Color,
                                padding: 20,
                                borderRadius: 5,
                                marginTop: "3%"
                            }}>

                                {/* ___ Child View for orderNote ___ */}

                                {/* Text for orderNote */}
                                <Text style={{
                                    ...headings.h3,
                                    color: theme.Orderlist_primary_textColor,
                                    fontSize: 18,
                                    // color: theme.primary_text_color,
                                    width: "50%"
                                }} numberOfLines={1}>
                                    <MaterialCommunityIcons name='notebook-multiple' size={18} color={theme.Icon_Primary_Color} />
                                    {' '}Order Note </Text>

                                <Text style={{
                                    ...headings.h3,
                                    //  color: theme.secondary_text_dark_color,
                                    fontSize: 13,
                                    color: theme.Orderlist_primary_textColor,
                                    textAlign: 'justify',
                                    paddingTop: "4%",
                                    width: "100%"
                                }} numberOfLines={4}>
                                    {customer_note == "" ? "No Special Instructions Found" : customer_note}</Text>
                            </View>


                            {/* FLat List heading */}
                            <Text style={{
                                paddingLeft: "5%",
                                backgroundColor: theme.background_Color,
                                borderTopLeftRadius: 5,
                                borderTopRightRadius: 5,
                                ...headings.h3,
                                marginTop: "3%",
                                paddingVertical: "2%",
                                fontSize: 22,
                                fontWeight: 'bold',
                                color: theme.Orderlist_primary_textColor
                            }} >
                                <Feather name='box' size={24} color={theme.Icon_Primary_Color} />
                                {' '}Product List:</Text>

                            {/* Flat List For orders */}
                            <FlatList
                                nestedScrollEnabled={true}
                                data={this.state.products}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => (

                                    <View style={{
                                        backgroundColor: theme.background_Color,
                                        padding: 20,
                                        // borderRadius: 5,
                                        marginTop: "0.2%",
                                        paddingLeft: 16,
                                        paddingRight: 16,
                                    }}>
                                        <View style={{
                                            flexDirection: 'row',
                                        }}>
                                            {/* Title */}
                                            <Text style={{
                                                ...headings.h3,
                                                color: theme.Orderlist_primary_textColor,
                                                fontSize: 15,
                                                paddingBottom: 2,
                                                width: "40%",
                                                textAlign: "left"
                                            }} numberOfLines={1} >Product Name:</Text>

                                            <Text style={{
                                                ...headings.h3,
                                                color: theme.Orderlist_primary_textColor,
                                                fontSize: 14,
                                                paddingBottom: 2,
                                                fontWeight: "bold",
                                                width: "60%",
                                                textAlign: "left"
                                            }} numberOfLines={2} >{item.name}</Text>
                                        </View>

                                        {/* Quantity */}
                                        <View style={{
                                            flexDirection: 'row',
                                        }}>
                                            <Text style={{
                                                ...headings.h3,
                                                color: theme.Orderlist_primary_textColor,
                                                fontSize: 15,
                                                paddingBottom: 2,
                                                width: "37%",
                                                textAlign: "left"
                                            }} numberOfLines={1} >Quantity:</Text>

                                            <Text style={{

                                                ...headings.h3,
                                                color: theme.Orderlist_primary_textColor,
                                                fontSize: 16,
                                                fontWeight: "bold",
                                                width: "60%",
                                                paddingBottom: 2,
                                            }} numberOfLines={1} >  {item.quantity}</Text>
                                        </View>


                                        {/*Unit Price */}
                                        <View style={{
                                            flexDirection: 'row',
                                        }}>
                                            <Text style={{
                                                ...headings.h3,
                                                color: theme.Orderlist_primary_textColor,
                                                fontSize: 15,
                                                paddingBottom: 2,
                                                width: "37%",
                                                textAlign: "left"
                                            }} numberOfLines={1} >Unit Price:</Text>
                                            <Text style={{
                                                ...headings.h3,
                                                color: theme.Orderlist_primary_textColor,
                                                fontSize: 15,
                                                width: "60%",
                                                fontWeight: "bold",
                                                color: theme.primary_text_color,
                                                //  textAlign: 'center',
                                                alignSelf: 'flex-end',
                                                marginBottom: 7
                                            }} numberOfLines={1} >  {currency_symbol}{item.price}</Text>
                                        </View>

                                        {/*Total Price */}
                                        <View style={{
                                            flexDirection: 'row',
                                        }}>

                                            <Text style={{

                                                ...headings.h3,
                                                color: theme.Orderlist_primary_textColor,
                                                fontSize: 15,
                                                paddingBottom: 2,
                                                width: "37%",
                                                textAlign: "left"
                                            }} numberOfLines={1} >Total Price:</Text>

                                            <Text style={{
                                                ...headings.h3,
                                                color: theme.Orderlist_primary_textColor,
                                                fontSize: 15,
                                                color: theme.primary_text_color,
                                                width: "60%",
                                                fontWeight: "bold",
                                                alignSelf: 'flex-end',
                                                marginBottom: 7
                                            }} numberOfLines={1} >  {currency_symbol}{item.price * item.quantity}</Text>
                                        </View>
                                    </View>
                                )
                                }
                            />
                        </ScrollView>
                    </>}
            </View>
        );
    }
}
export default connect(ReducersProps, ReducersActions)(orderDetail)
