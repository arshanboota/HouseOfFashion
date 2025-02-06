import React, { Component } from 'react'
import { Text, View, StatusBar, Image, TouchableOpacity, BackHandler, TextInput, FlatList, ScrollView, AppRegistry, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { headings } from '../../utils/Styles'
import ReducersProps from '../../data/local/reducers/ReducersProps'
import ReducersActions from '../../data/local/reducers/ReducersActions'
import SimpleStyleButton from '../ReuseAbleComponents/SimpleStyleBUtton'
import Helper from '../../utils/Helper';
import Swiper from 'react-native-swiper'
import { ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import WooCommerceAPI from 'react-native-wc-api';
import PrefManager from '../../data/local/PrefManager'
import Urls from '../../data/remote/Urls'
import { ImageBackground } from 'react-native'

const WooCommerce = new WooCommerceAPI({
    url: Urls.Domain,
    consumerKey: Urls.consumerKey,
    consumerSecret: Urls.consumerSecret,
    wpAPI: true,
    version: 'wc/v3',
    queryStringAuth: true,     // sending secure https request
});
const prefManager = new PrefManager()

const helper = new Helper()
var tempCartList = []
const SHADOW_iMG = "https://www.transparentpng.com/thumb/shadow/ZbeG1p-download-shadow-png-picture-free-transparent-png-images.png";


class ProductScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productData: props.route.params?.productData ?? '',
            idxActive: 0,
            images: [
                "https://images.pexels.com/photos/4110074/pexels-photo-4110074.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260", // Network image
                "https://images.pexels.com/photos/3598015/pexels-photo-3598015.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
                "https://images.pexels.com/photos/4068669/pexels-photo-4068669.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",

            ],

            // Variants
            variantsImages: [],
            mainImage: props.route.params?.productData.images[0].src ?? '',

            // For counter
            show: true,
            countActive: false,

            // for Group Button
            dualvariationIndex: true,
            selectColorButtons: [],
            selectedColor: "",
            selectedSize: "",
            selectedId: '',
            quantity: 1,
            selectedVariation: "",
            selectedVariationId: -1,
            selectedVariationIndex: 0,
            variationIds: [],
            itemsInCart: '',
            variationExists: true,
            tempColors: '',
            tempSizes: '',
            variationName: ''

        };

    }
    componentDidMount() {

        console.log("Data From Previuos Screen", this.state.productData)


        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({
                productData: this.props.route.params?.productData ?? '',
                selectColorButtons: [],
                selectedId: '',
                selectedColor: "",
                selectedSize: "",
                itemsInCart: ""

            })
            tempCartList = []
            this.apiCaller()
        });

        this.apiCaller()
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)

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
                // tempCartList = []
            }
            else {
                tempCartList = data
                if (data.length > 0) {
                    this.setState({ itemsInCart: data.length })
                }
            }

            if (this.state.productData.variations != "") {
                this.getProductVariations()
            }
            else {
                this.checkIfProductExistUpdatetheQuantity_Controller("simple")
            }
        })
    }
    IncrementValue = () => {
        this.setState({ quantity: this.state.quantity + 1 });

    }
    DecrementValue = () => {
        if (this.state.quantity > 1) {
            this.setState({
                quantity: this.state.quantity - 1
            });
        }
    }

    checkIfProductExistUpdatetheQuantity_Controller() {
        let { productData, selectedColor, selectedSize, selectedId, quantity } = this.state
        var quantityUpdate = false

        if (tempCartList != "") {
            // console.log("-------here1")
            tempCartList.forEach((product, index) => {
                // console.log("-------here1", product)


                // check the existing product id in tempCartList 
                if (product.p_id == productData.id) {

                    //  check if it is simple prduct
                    if (product.p_selected_color == "" && product.p_selected_size == "") {
                        this.setState({
                            quantity: product.p_quantity
                        })
                        // console.log(" simple product")

                    }

                    //  check if it is single variation product
                    if (product.p_selected_color == "" || product.p_selected_size == "") {
                        if (product.p_selected_color != "") {
                            this.setState({
                                selectedColor: product.p_selected_color,
                                selectedId: product.p_varition_id,
                                quantity: product.p_quantity
                            })
                            // console.log(" xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxproduct colour added",selectedColor,selectedId,quantity)
                        }

                        if (product.p_selected_size != "") {
                            this.setState({
                                selectedSize: product.p_selected_size,
                                selectedId: product.p_varition_id,
                                quantity: product.p_quantity
                            })
                            //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx product size added",selectedSize,quantity,selectedId)
                        }
                    }
                    //  check if it is dual variation product
                    if (product.p_selected_color != "" && product.p_selected_size != "") {
                        this.setState({
                            selectedSize: product.p_selected_size,
                            selectedColor: product.p_selected_color,
                            selectedId: product.p_varition_id,
                            quantity: product.p_quantity
                        })

                        //console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx product size/ color added")
                    }



                }
            })
        }

    }


    onPressActiveButton = (index) => {
        this.refs._swiper.scrollBy(index - this.state.idxActive, true);
        // this.refs._swiper.scrollBy(0, true);
        // console.log('-------11111------', index)
        //console.log('-------22222------', this.state.idxActive)

        // alert(index - this.state.idxActive)
    }
    onIndexChanged(index) {
        //  console.log('>>>>>>>>>>>>>>>>>', index)
        this.setState({
            idxActive: index
        });
    }



    getProductVariations() {
        var url = "products/" + this.state.productData.id + "/variations"
        // console.log(this.state.productData.id )
        let sizeArray = []

        WooCommerce.get(url, {

        }).then(response => {
            // console.log("\x1b[33m", '==================products variation================================', response.data)

            // console.log("\x1b[33m", '==================products variation================================', JSON.stringify(response.data))

            response.data.forEach(element => {
                this.setState({
                    variationName: element.attributes[0].name
                })
                // console.log("\x1b[33m", '==================products Specific Variation================================',this.state.variationName)


            });


            response.data.forEach(element => {
                //  console.log('-----------Printing element------',element.attributes[1])
                if (element.attributes[1] == null || element.attributes[1] == undefined) {
                    this.setState({
                        dualvariationIndex: false
                    })
                    sizeArray.push({
                        "id": element.id,
                        "name": element.attributes[0].option

                    })
                }

                else {
                    this.setState({
                        dualvariationIndex: true
                    })
                    sizeArray.push({

                        "id": element.id,
                        "name": element.attributes[0].option,
                        "color": element.attributes[1].option

                    })
                }
            });
            this.state.selectColorButtons.forEach(element => {
                this.setState({
                    tempColors: element.color,
                    tempSizes: element.name
                })
                // console.log('index of size  ', this.state.tempSizes[0])
                // console.log('index of  colors', this.state.tempColors)
            });
            this.setState({
                selectColorButtons: sizeArray,
                selectedColor: [...new Set(sizeArray.map(item => item.color))][0]
            }, () => {
                this.checkIfProductExistUpdatetheQuantity_Controller("variant")
            })

            // console.log('colors array*******************', this.state.selectColorButtons)

        }).catch(error => {
            // console.log("\x1b[33m", '==================products Eroor================================', error);
        });


    }
    componentWillUnmount() {
        this._unsubscribe();
        // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    cartListItem_Controller() {
        var { quantity, selectColorButtons, selectedVariation, selectedVariationId, productData, selectedId, selectedColor, selectedSize } = this.state
        let { theme, } = this.props
        var p_id, p_name, p_quantity, p_sale_price, p_actual_price, p_weight, p_image, p_weight_id, p_varition_id, p_selected_color, p_selected_size
        var existingProductUpdate = false


        console.log("=====================================================================")
        console.log("=====================================================================")
        console.log("=====================================================================")
        console.log("=====================================================================")


        if (quantity == 0) {
            return helper.showToast("Add Some Quantity To Cart", theme.disc_text_color_productDetail)
        }

        if (this.state.productData.variations != '') {

            if (selectedId == '') {
                return helper.showToast("Select the Product Variation", theme.disc_text_color_productDetail)
            }

        }


        // console.log("id======>", productData.id)
        p_id = productData.id

        // console.log("name======>", productData.name)
        p_name = productData.name

        // console.log("quantity======>", quantity)
        p_quantity = quantity

        // console.log("Varaition id======>", selectedId)
        p_varition_id = selectedId
        // console.log("selected Color======>", selectedColor)
        p_selected_color = selectedColor == undefined ? '' : selectedColor
        // console.log("selected Size======>", selectedSize)

        p_selected_size = selectedSize == undefined ? '' : selectedSize

        // console.log("image======>", productData.images[0].src)
        p_image = productData.images[0].src


        //simple products
        if (productData.variations == "") {

            if (productData.sale_price == "" || productData.sale_price == undefined) {
                // console.log("Price======>", productData.price)
                // console.log("Discount Price======>", productData.sale_price == "" ? 0 : "")

                p_actual_price = productData.price
                p_sale_price = productData.sale_price == "" ? 0 : ""



            }

            // simple product with sale 
            if (productData.sale_price != "") {
                // console.log("Price======>", productData.regular_price)
                // console.log("Discount Price======>", productData.price)

                p_sale_price = productData.price
                p_actual_price = productData.regular_price

            }


        }


        // variation proudcts prices 
        if (productData.variations != "" && selectColorButtons != "") {
            if (productData.sale_price == '' || productData.sale_price == undefined && productData.regular_price == '') {
                p_actual_price = productData.price
                p_sale_price = productData.price

            }
        }


        if (tempCartList == "") {

            tempCartList.push(
                {
                    "p_id": p_id,
                    "p_name": p_name,
                    "p_quantity": p_quantity,
                    "p_sale_price": p_sale_price,
                    "p_varition_id": p_varition_id,
                    "p_selected_color": p_selected_color,
                    "p_selected_size": p_selected_size,
                    "p_actual_price": p_actual_price,
                    "p_image": p_image
                }
            );
        }

        if (tempCartList != "") {

            tempCartList.forEach((product, index) => {
                if (product.p_id == p_id && product.p_actual_price == p_actual_price) {
                    product.p_quantity = p_quantity,
                        existingProductUpdate = true
                }
            })

        }
        if (tempCartList != "" && !existingProductUpdate) {
            tempCartList.push(
                {
                    "p_id": p_id,
                    "p_name": p_name,
                    "p_quantity": p_quantity,
                    "p_sale_price": p_sale_price,
                    "p_varition_id": p_varition_id,
                    "p_selected_color": p_selected_color,
                    "p_selected_size": p_selected_size,
                    "p_actual_price": p_actual_price,
                    "p_image": p_image
                }

            );
            console.log("existing product")
        }

        prefManager.saveCartData(tempCartList)
        if (tempCartList.length > 0) {
            this.setState({ itemsInCart: tempCartList.length })
        }

        // console.log("===>", tempCartList)
        console.log('----------------', this.state.itemsInCart)
        helper.showToast("Item Added Into Cart", theme.secondaryBackground)

    }
    render() {
        let { theme, language, } = this.props
        let { productData, } = this.state
        // Const for state variable
        const { mainImage, selectedIndexColor, selectedIndexSize } = this.state;

        return (

            // ______________Parent View
            <View style={{
                flex: 1,
                backgroundColor: theme.productScreen_primary_backgroundColor,
                alignItems: 'center',
            }}>

                <StatusBar backgroundColor={"transparent"} translucent />
                <View style={{
                    backgroundColor: theme.productScreen_primary_backgroundColor,
                    width: "100%",
                    height: "85%",

                }}>

                    {/* // View For Product Screen */}
                    <View style={{
                        backgroundColor: theme.productScreen_primary_viewColor,
                        width: "100%",
                        height: "100%",
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,

                    }}>


                        {/* Swiper For Prodct Main Image */}
                        <Swiper style={{
                            backgroundColor: theme.productScreen_primary_backgroundColor,
                        }}
                            horizontal={false}
                            showsPagination={false}
                            loop={false}
                            ref="_swiper"
                            onIndexChanged={this.onIndexChanged.bind(this)}
                        >
                            <View style={{
                                width: "100%",
                                height: "100%",
                                alignItems: 'center',
                                backgroundColor: theme.productScreen_primary_backgroundColor,
                                backgroundColor: '#fff',
                                justifyContent: 'center',
                                // borderBottomLeftRadius: 30,
                                //     borderBottomRightRadius: 30,
                            }} >

                                <Image style={{
                                    width: "100%",
                                    height: "70%",
                                    // backgroundColor: 'pink',
                                    // padding:'10%',
                                    borderBottomLeftRadius: 30,
                                    borderBottomRightRadius: 30,
                                    alignSelf: "center",
                                }} resizeMode='center'
                                    source={{ uri: mainImage }}
                                />

                                {/* Swipe up view */}
                                <View style={{
                                    width: "100%",
                                    height: "10%",
                                    position: 'absolute',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    bottom: 0,

                                }}>
                                    {/*  Shadow Image */}
                                    <Image style={{
                                        width: "100%",
                                        height: "100%",
                                        position: 'absolute',
                                        tintColor: theme.productScreen_primary_backgroundColor
                                    }} source={{ uri: SHADOW_iMG }} />

                                    {/* Icon */}
                                    <FontAwesome name="angle-double-up" size={20} color={theme.productScreen_secondry_textColor} />

                                    {/* Text */}
                                    <Text style={{
                                        ...headings.h4,
                                        // color: theme.productScreen_primary_textColor
                                        color: theme.productScreen_secondry_textColor
                                    }}>{language.Swipe_Up_For_Variations}</Text>

                                </View>
                            </View>


                            {/* View for Main Product Details */}
                            <View style={{
                                backgroundColor: theme.productScreen_productDetailsView_backgroundColor,
                                width: "100%",
                                height: "100%",
                                borderBottomLeftRadius: 30,
                                borderBottomRightRadius: 30,
                                overflow: "hidden",
                                alignItems: 'center',
                            }}>
                                {/* Text for product Details */}
                                <Text style={{
                                    ...headings.h2,
                                    paddingTop: "12%",
                                    fontSize: 22,
                                    fontWeight: '900',
                                    color: theme.productScreen_primary_textColor,

                                }}>{language.Product_Details}</Text>


                                {this.state.productData.variations == '' && this.state.selectColorButtons != '' &&
                                    <ActivityIndicator
                                        size="large"
                                        color={theme.loginScreen_buttonColor}
                                        style={{ alignSelf: 'center', marginTop: "10%" }}
                                    />}

                                {this.state.variationName != 'Size' && this.state.variationName != '' &&

                                    <Text style={{ marginTop: 10, color: theme.productScreen_primary_textColor, fontsize: 17 }}> Product Available Colors</Text>}
                                {this.state.dualvariationIndex == true && this.state.selectedColor != '' &&
                                    <View
                                        style={{
                                            width: "100%",
                                            height: "11%",
                                            alignItems: "center",
                                            flexDirection: "row",
                                        }}>


                                        <FlatList
                                            showsHorizontalScrollIndicator={false}
                                            horizontal
                                            data={[...new Set(this.state.selectColorButtons.map(item => item.color))]}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => {
                                                return <TouchableOpacity
                                                    style={{
                                                        backgroundColor: this.state.selectedColor == item ? theme.productScreen_primary_buttonColor : "grey",
                                                        marginTop: "7%",
                                                        borderRadius: 18,
                                                        width: 100,
                                                        height: 40,
                                                        marginHorizontal: 8,
                                                        justifyContent: "center",
                                                    }}
                                                    onPress={() => {
                                                        this.setState({ selectedColor: item, selectedSize: "" },
                                                            () => { this.checkIfProductExistUpdatetheQuantity_Controller("variant") }
                                                        )
                                                    }}
                                                >
                                                    <Text style={{
                                                        ...headings.h2,
                                                        fontSize: 16,
                                                        textAlign: "center",
                                                        color: theme.productScreen_primary_textColor
                                                        // color: selectedVariation == item.attributes[0].option ? theme.mainBackground_ProductDetail : theme.desc_text_color
                                                    }}>{item}</Text>

                                                </TouchableOpacity>
                                            }} />
                                    </View>}

                                {this.state.variationName == '' &&
                                    <View >
                                        <Text style={{
                                            marginTop: "3%",
                                            ...headings.h3
                                        }}>No Size and Color Range available</Text>
                                    </View>}


                                {this.state.variationName == 'Size' && this.state.variationName != '' &&

                                    <Text style={{ marginTop: 12, color: theme.productScreen_primary_textColor, fontsize: 17 }}>Product Available Sizes</Text>}
                                {(this.state.dualvariationIndex == false || this.state.selectColorButtons != '') &&
                                    <View
                                        style={{
                                            width: "100%",
                                            height: "11%",
                                            // marginTop: "5%",
                                            alignItems: "center",
                                            flexDirection: "row",
                                        }}>

                                        <FlatList
                                            // showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={false}
                                            horizontal
                                            data={this.state.selectColorButtons}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => {
                                                return item.color == this.state.selectedColor ?
                                                    <TouchableOpacity
                                                        style={{
                                                            backgroundColor: item.name == this.state.selectedSize ? theme.productScreen_primary_buttonColor : "grey",
                                                            borderRadius: 18,
                                                            width: 100,
                                                            height: 40,
                                                            marginHorizontal: 8,
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                        }}
                                                        onPress={() => {
                                                            this.setState({
                                                                selectedSize: item.name, selectedVariationIndex: index,
                                                                selectedId: item.id
                                                            }, () => {
                                                                this.checkIfProductExistUpdatetheQuantity_Controller("variant")
                                                                // console.log('______Selected Index______', this.state.selectedVariationIndex)
                                                            })
                                                        }}
                                                    >
                                                        <Text style={{
                                                            ...headings.h2,
                                                            fontSize: 16,
                                                            textAlign: "center",
                                                            color: theme.productScreen_primary_textColor
                                                        }}>{item.name}</Text>

                                                    </TouchableOpacity>
                                                    : null
                                            }} />
                                    </View>}

                                {/* View For Description */}
                                <View style={{
                                    width: "65%",
                                    height: "42%",
                                    marginTop: '40%',
                                    alignSelf: 'flex-start',
                                    bottom: "15%",
                                    marginLeft: "5%",
                                    padding: "5%"
                                }}>

                                    {/* Description Text */}
                                    <Text style={{
                                        ...headings.h3,
                                        color: theme.productScreen_primary_textColor,
                                        fontSize: 18,

                                    }}> {language.Description_for_details} </Text>

                                    {/* Text */}
                                    <Text style={{
                                        color: theme.description_Text_Color,
                                        textAlign: 'left',
                                        top: "4%",
                                    }}
                                        numberOfLines={4}>
                                        {productData.description == "" ?
                                            productData.short_description.replace(new RegExp('<[^>]*>', 'g'), '')
                                            : productData.description.replace(new RegExp('<[^>]*>', 'g'), '')}

                                    </Text>
                                </View>

                                {/* Swipe down view */}
                                <View style={{
                                    width: "100%",
                                    height: "10%",
                                    position: 'absolute',
                                    alignSelf: 'center',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    bottom: 0,

                                }}>
                                    {/*  Shadow Image */}
                                    <Image style={{
                                        width: "100%",
                                        height: "100%",
                                        position: 'absolute',
                                        tintColor: theme.productScreen_primary_backgroundColor
                                    }} source={{ uri: SHADOW_iMG }} />

                                    {/* Icon */}
                                    <FontAwesome name="angle-double-down" size={20} color={theme.productScreen_primary_textColor} />

                                    {/* Text */}
                                    <Text style={{
                                        ...headings.h4,
                                        color: theme.productScreen_primary_textColor
                                    }}>{language.Swipe_down}</Text>

                                </View>
                            </View>
                        </Swiper>


                        {/* Back Button */}
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            style={{
                                height: "3%",
                                width: "5%",
                                position: 'absolute',
                                marginLeft: "5%",
                                marginTop: "12%",
                            }}>
                            <Icon name='arrow-left' size={35} color={theme.productScreen_icon_arrowColor} />
                        </TouchableOpacity>

                        {/* Heart Button */}
                        <TouchableOpacity

                            onPress={() => {
                                if (tempCartList == "") {
                                    helper.showToast("Your Cart Is Empty Please Add Some Items First", theme.disc_text_color_productDetail)
                                }
                                else {
                                    this.props.navigation.navigate("CartScreen")
                                }
                            }
                            }
                            style={{
                                position: 'absolute',
                                alignItems: "center",
                                top: "6%",
                                right: "5%",
                                backgroundColor: theme.productScreen_icon_minusButtonBorder,
                                borderRadius: 100,
                                paddingHorizontal: 12,
                                paddingVertical: 3
                            }}  >

                            <Text
                                style={{
                                    color: "black",
                                    fontSize: 13,
                                    top: 1,
                                    fontWeight: "bold",
                                    bottom: 0,
                                    textAlign: 'center',
                                }}
                            >{this.state.itemsInCart}</Text>
                            <Entypo name='shopping-cart' size={22} style={{ top: -3 }} color={theme.productScreen_primary_backgroundColor} />
                        </TouchableOpacity>





                        {/*____________ View for product Varient___________ */}

                        <View
                            style={{
                                height: "41%",
                                width: "24%",
                                position: 'absolute',
                                flexDirection: 'column',
                                backgroundColor: theme.productScreen_primary_viewColor,
                                alignSelf: 'flex-end',
                                top: "47%",
                                right: "2%",
                                borderRadius: 15,
                                padding: 8,
                                alignItems: 'center',
                            }}
                        >
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={this.state.productData.images}
                                keyExtractor={item => item.id}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity style={{
                                        height: 70,
                                        marginBottom: '20%'
                                    }}

                                        activeOpacity={0.7}
                                        onPress={() => {
                                            this.setState({
                                                mainImage: item.src,

                                            }),
                                                this.onPressActiveButton()
                                        }}
                                    >
                                        <Image style={{
                                            height: 80,
                                            width: 70,
                                            borderRadius: 15,
                                            // marginTop: "17%",
                                        }}
                                            // resizeMode={'cover'}
                                            source={{
                                                uri: item.src

                                            }} />

                                    </TouchableOpacity>
                                )}>

                            </FlatList>

                            <TouchableOpacity style={{
                                // backgroundColor:'plum',
                                whidth: '80%',
                                height: "8%",
                                // position: 'absolute',
                                // alignSelf: 'flex-end',
                                // top: "90%",
                                // right: "10%",
                            }}>
                                <Entypo name='chevron-up' size={26} color={theme.productScreen_icon_upArrowColor} />
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>


                {/* View for price and button */}
                <View style={{
                    height: "11%",
                    width: "95%",
                    flexDirection: 'row',
                    paddingLeft: "4%",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: "3%",
                }}>

                    {/* Text for Price */}
                    <Text style={{
                        ...headings.h3,
                        color: theme.productScreen_secondary_textColor,
                        width: "40%"
                    }}
                        numberOfLines={2} >
                        {language.Price_for_product} {'\n'}
                        <Text style={{
                            ...headings.h3,
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: theme.productScreen_primary_textColor,
                        }}
                            numberOfLines={1}
                        >$ {productData.sale_price == '' ? productData.price : productData.sale_price} </Text>
                    </Text>



                    {/* Add to cart */}
                    {this.state.countActive == false &&
                        // {/* Button for Add to cart */}
                        <TouchableOpacity style={{
                            width: "40%",
                            backgroundColor: theme.productScreen_primary_buttonColor,
                            marginRight: "4%",
                            borderRadius: 10,
                            alignItems: 'center',
                        }}
                            activeOpacity={0.7}
                            // onPress={ ()=> this.props.navigation.navigate('cartScreen')}
                            onPress={() => {
                                this.setState({ countActive: true })
                            }}
                        >
                            <Text style={{
                                ...headings.h3,
                                padding: 8,
                                color: theme.productScreen_primary_textColor
                            }}> {language.Add_to_Cart} </Text>
                        </TouchableOpacity>
                    }

                    {/* Counter */}
                    {this.state.countActive == true &&
                        //  {/* Counter */}
                        <View style={{
                            width: "38%",
                            height: "50%",
                            flexDirection: 'row',
                            right: "2%",
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                            {/* Minus Button */}
                            <TouchableOpacity style={{
                                width: 25,
                                height: "65%",

                            }} onPress={this.DecrementValue} >
                                <Feather name='minus-circle' size={25} color={theme.productScreen_icon_minusButtonBorder}></Feather>

                            </TouchableOpacity>


                            <Text style={{
                                fontSize: 22,
                                width: 40,
                                marginBottom: '3%',
                                textAlign: 'center',
                                color: theme.productScreen_primary_textColor,
                            }}
                                numberOfLines={1}
                            > {this.state.quantity}</Text>

                            {/* Plus Button */}
                            <TouchableOpacity style={{
                                width: 25,
                                height: "65%",

                            }} onPress={this.IncrementValue} >
                                <Feather name='plus-circle' size={25} color={theme.productScreen_icon_minusButtonBorder}></Feather>
                            </TouchableOpacity>
                        </View>
                    }


                    {/* Done Button */}
                    {this.state.countActive == true &&
                        <TouchableOpacity style={{
                            marginRight: '3%'
                        }}
                            onPress={() => { this.cartListItem_Controller(); this.setState({ countActive: false }) }}
                        >
                            <AntDesign name="checkcircle" size={30} color="white"
                            />
                        </TouchableOpacity>}

                </View>
            </View>

        )
    }
}


export default connect(ReducersProps, ReducersActions)(ProductScreen)