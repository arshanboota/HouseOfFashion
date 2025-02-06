import React, { Component } from 'react'
import { View, Text, TextInput, SafeAreaView, TouchableOpacity, Image, Dimensions, StatusBar, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { headings } from '../../../source/utils/Styles'
import ReducersProps from '../../data/local/reducers/ReducersProps'
import ReducersActions from '../../data/local/reducers/ReducersActions'
import Helper from '../../utils/Helper';
import PrefManager from '../../data/local/PrefManager';
import Entypo from 'react-native-vector-icons/Entypo';
import WooCommerceAPI from 'react-native-wc-api';
import SimpleInputFields from '../ReuseAbleComponents/SimpleInputFields'
import SimpleStyleButton from '../ReuseAbleComponents/SimpleStyleBUtton'
import auth from '@react-native-firebase/auth';
import Urls from '../../data/remote/Urls';
import axios from 'axios'

apiUrl = "https://houseoffashion.gtechweb.au/wp-json/wc/v3/customers"
const username = "ck_5a2fd6adb0b76ce3a97349e5686c2b89004fed1c"
const password1 = "cs_6155b079e45c2a7111c4b360d41f4cbb578a0153"

const WooCommerce = new WooCommerceAPI({
    url: Urls.Domain,
    consumerKey: Urls.consumerKey,
    consumerSecret: Urls.consumerSecret,
    wpAPI: true,
    version: 'wc/v3',
    queryStringAuth: true,
  });

const helper = new Helper()
const prefManager = new PrefManager()

class SignupScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            checkBox: false,
            showPassword: true,
            isLoading: false
        };
    }

    // signUpController() {
    //     let { theme } = this.props
    //     let { name, email, password } = this.state

    //     if (name == "") {
    //         helper.showToast("Please Enter Your Full Name", theme.error_alert)
    //         return
    //     }
    //     if (email == "") {
    //         helper.showToast("Please Enter Your Email", theme.error_alert)
    //         return
    //     }
    //     if (!helper.isValidEmail(email)) {
    //         helper.showToast("Please Enter Your Email Correctly", theme.error_alert)
    //         return
    //     }
    //     if (password == "") {
    //         helper.showToast("Please Enter Your Full Password", theme.error_alert)
    //         return
    //     }
    //     console.log('==========Name', name)
    //     console.log('==========Email', email)
    //     console.log('==========Name', password)
    //     this.setState({ isLoading: true })

    //     let authdata = Buffer.from(`${username}:${password1}`).toString('base64')
    //     let authHeader = `Basic ${authdata}`

    //     const apiUrl = 'http://houseoffashion.gtechweb.au/wp-json/wc/v3/customers';

    //     const api = axios.get(apiUrl, {
    //         "username": name,
    //         "email": email,
    //         "password": password
    //     },
    //         {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 "Authorization": authHeader
    //             }
    //         })
    //         .then(response => {
    //             this.setState({ isLoading: false })
    //             helper.showToast("User account created & signed in!", theme.loginScreen_buttonColor)
    //             // console.log('Response////////////:', response.data.id);
    //             helper.resetAndGo(this.props.navigation, "HomeScreen")
    //             var TempData = []
    //             TempData.push({
    //                 "email": email,
    //                 "password": password,
    //                 "customer_id": response.data.id
    //             })
    //             prefManager.saveUserData(TempData, this.state.checkBox)
    //         })
    //         .catch(error => {
    //             this.setState({ isLoading: false })
    //             console.log("\x1b[33m", "==XXXXXXXXXXXXS", JSON.stringify(error.response.data));
    //             let Toasterror = JSON.stringify(error.response?.data?.message.split('<a')[0])

    //             Toasterror = Toasterror.replace(/^"(.*)"$/, '$1');
    //             helper.showToast(Toasterror, theme.loginScreen_buttonColor)
    //             // console.error('Error:', error);
    //         });
    // }

    signUpController() {
        let { theme } = this.props
        let { name, email, password } = this.state

        if (name == "") {
            helper.showToast("Please Enter Your Full Name", theme.error_alert)
            return
        }
        if (email == "") {
            helper.showToast("Please Enter Your Email", theme.error_alert)
            return
        }
        if (!helper.isValidEmail(email)) {
            helper.showToast("Please Enter Your Email Correctly", theme.error_alert)
            return
        }
        if (password == "") {
            helper.showToast("Please Enter Your Full Password", theme.error_alert)
            return
        }

        this.setState({ isLoading: true })
        let authdata = Buffer.from(`${username}:${password1}`).toString('base64')
        let authHeader = `Basic ${authdata}`

        const apiUrl = 'https://houseoffashion.gtechsol.au/wp-json/wc/v3/customers';

        const api = axios.post(apiUrl, {
            "username": name,
            "email": email,
            "password": password
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": authHeader
                }
            })
            .then(response => {
                this.setState({ isLoading: false })
                helper.showToast("User account created & signed in!", theme.loginScreen_buttonColor)
                // console.log('Response////////////:', response.data.id);
                helper.resetAndGo(this.props.navigation, "HomeScreen")
                var TempData = []
                TempData.push({
                    "email": email,
                    "password": password,
                    "customer_id": response.data.id
                })
                prefManager.saveUserData(TempData, this.state.checkBox)
            })
            .catch(error => {
                this.setState({ isLoading: false })
                console.log("\x1b[33m", "==XXXXXXXXXXXXS", JSON.stringify(error.response.data));
                let Toasterror = JSON.stringify(error.response?.data?.message.split('<a')[0])

                Toasterror = Toasterror.replace(/^"(.*)"$/, '$1');
                helper.showToast(Toasterror, theme.loginScreen_buttonColor)
                // console.error('Error:', error);
            });
    }

    LoginController() {
        let { theme } = this.props
        let { email, password, } = this.state

        if (email == "") {
            helper.showToast("Please Enter Your Email", theme.error_alert)
            return
        }
        // if (helper.isValidEmail(loginEmail)) {
        //     helper.showToast("Please Enter Your Email Correctly", theme.error_alert)
        //     return
        // }
        if (password == "") {
            helper.showToast("Please Enter Your Full Password", theme.error_alert)
            return
        }
        console.log(email)
        console.log(password)
        this.setState({ isLoading: true })

        auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ isLoading: false })
                helper.showToast("User Account Signed in!", theme.loginScreen_buttonColor)
                helper.resetAndGo(this.props.navigation, "HomeScreen")
                var TempData = []
                TempData.push({
                    "email": email,
                    "password": password
                })
                prefManager.saveUserData(TempData, this.state.checkBox)

            })
            .catch(error => {
                this.setState({ isLoading: false })
                if (error.code === 'auth/network-request-failed') {
                    helper.showToast("Please Check Your Internet Connection & Try Again", theme.error_alert)
                }
                if (error.code === 'auth/user-not-found') {
                    helper.showToast("User Not Found , Please SignUp First", theme.error_alert)
                }
                if (error.code === 'auth/wrong-password') {
                    helper.showToast(" Password is Not Correct,Please Type Correct Password", theme.error_alert)
                }
            });

    }

    render() {
        let { theme, language, languageReducer, themeReducer } = this.props
        return (
            // ____________________Parent View
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: theme.loginScreen_primary_backgroundColor,
                alignItems: 'center',
            }}>

                <StatusBar backgroundColor={"transparent"} translucent />

                {/* Background Image */}
                <Image style={{
                    width: "100%",
                    height: "100%",
                    position: 'absolute',
                    opacity: 0.3,
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height + 50,
                }}
                    blurRadius={9}
                    source={require("../../assets/Images/background.jpg")} />

                {/* Heading Text  */}
                <Text style={{
                    ...headings.h1,
                    color: theme.loginScreen_primary_textColor,
                    marginTop: "20%",
                    fontSize: 25,
                }}> {language.Create_New_Account} </Text>

                <Text style={{
                    ...headings.h4,
                    color: theme.loginScreen_primary_light_textColor,
                    fontSize: 13,
                }}> {language.Please_fill_in_the_form_to_continue} </Text>

                {/* VIew for Imput Text Fields for Email And Password */}
                <View style={{
                    width: "100%",
                    height: 700,

                }}>


                    {/* Full Name Text Input */}
                    <TextInput
                        style={{
                            height: "8%",
                            width: "78%",
                            paddingHorizontal: '7%',
                            alignSelf: 'center',
                            color: theme.loginScreen_primary_textColor,
                            backgroundColor: theme.loginScreen_TextInputColor,
                            borderRadius: 20,
                            fontSize: 18,
                            top: "7%",
                            marginTop: "5%"
                        }}
                        onChangeText={(value) => this.setState({ name: value })}
                        value={this.state.name}


                        placeholder="Name"
                        placeholderTextColor={theme.loginScreen_primary_light_textColor}
                    />

                    {/* Email Text Input */}
                    <TextInput
                        style={{
                            height: "8%",
                            width: "78%",
                            paddingHorizontal: '7%',
                            alignSelf: 'center',

                            color: theme.loginScreen_primary_textColor,
                            backgroundColor: theme.loginScreen_TextInputColor,
                            borderRadius: 20,
                            fontSize: 18,
                            top: "7%",
                            marginTop: "5%"
                        }}
                        onChangeText={(value) => this.setState({ email: value })}
                        value={this.state.email}
                        keyboardType="email-address"
                        placeholder="Email Address"
                        placeholderTextColor={theme.loginScreen_primary_light_textColor}
                    />


                    {/* Password Text Input */}
                    <TextInput
                        style={{
                            height: "8%",
                            width: "78%",
                            alignSelf: 'center',
                            paddingLeft: '7%',
                            paddingRight: '12%',
                            color: theme.loginScreen_primary_textColor,
                            backgroundColor: theme.loginScreen_TextInputColor,
                            borderRadius: 20,
                            fontSize: 18,
                            top: "7%",
                            marginTop: "5%"
                        }}
                        onChangeText={(value) => this.setState({ password: value })}
                        value={this.state.password}
                        secureTextEntry={this.state.showPassword}

                        placeholder="Password"
                        placeholderTextColor={theme.loginScreen_primary_light_textColor}
                    />

                    <TouchableOpacity
                        onPress={() => this.setState({
                            showPassword: !this.state.showPassword
                        })}
                        value={!this.state.showPassword}
                        style={{
                            width: 20,
                            left: '81%',
                            position: 'absolute',
                            top: '33.2%'
                        }}>

                        <Entypo name={this.state.showPassword ? 'eye-with-line' : 'eye'} size={20} color={'#EEE'} ></Entypo>
                    </TouchableOpacity>



                    {/* Sign Up Button */}
                    {this.state.isLoading &&
                        <ActivityIndicator
                            size="large"
                            color={theme.loginScreen_buttonColor}
                            style={{ marginTop: "48%", }}
                        />}
                    {!this.state.isLoading &&
                        <>

                            <SimpleStyleButton
                                title={language.Sign_up_button_SignupScreen}
                                height='7%'
                                width='75%'
                                marginTop='25%'
                                bodyBackground={theme.SignupScreen_buttonColor}
                                textColor={theme.SignupScreen_primary_textColor}
                                onAction={() => this.signUpController()}
                            />


                            {/* Asking for sign In */}
                            <View style={{
                                flexDirection: 'row',
                                alignSelf: 'center',
                                top: "8%",
                            }}>

                                {/* text */}
                                <Text style={{
                                    ...headings.h4,
                                    color: theme.loginScreen_primary_textColor,
                                    alignSelf: 'center',
                                    // fontSize: 12,
                                    paddingBottom: 94
                                }}> {language.Have_an_account} </Text>

                                {/* Sign In button */}
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("LoginScreen")}
                                >
                                    <Text style={{
                                        color: theme.loginScreen_buttonColor,
                                    }}> {language.Login} </Text>
                                </TouchableOpacity>
                            </View>
                        </>}
                </View>

            </SafeAreaView>
        )
    }
}


export default connect(ReducersProps, ReducersActions)(SignupScreen)