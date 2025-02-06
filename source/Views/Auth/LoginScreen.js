import React, { Component } from 'react'
import { View, Text, TextInput, SafeAreaView, BackHandler, TouchableOpacity, Image, Dimensions, StatusBar, ActivityIndicator, Linking } from 'react-native'
import { connect } from 'react-redux'
import { headings } from '../../../source/utils/Styles'
import ReducersProps from '../../data/local/reducers/ReducersProps'
import ReducersActions from '../../data/local/reducers/ReducersActions'
import Helper from '../../utils/Helper';
import PrefManager from '../../data/local/PrefManager';
import SimpleInputFields from '../ReuseAbleComponents/SimpleInputFields'
import SimpleStyleButton from '../ReuseAbleComponents/SimpleStyleBUtton'
import Entypo from 'react-native-vector-icons/Entypo';
import auth from '@react-native-firebase/auth';
import ThemedDialog from 'react-native-elements/dist/dialog/Dialog'
import axios from "axios"

global.Buffer = require('buffer').Buffer;
const apiUrl = 'https://houseoffashion.gtechsol.au/wp-json/custom/v1/login';
const username = '';
const password = '';

const helper = new Helper()
const prefManager = new PrefManager()

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginEmail: '',
            loginPass: '',
            showPassword: true,
            checkBox: false,
            isLoading: false
        };
    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    handleBackButton = () => {
        // if (screen == 'Login') {
        BackHandler.exitApp();
        return true;
    };
    LoginController() {
        let { theme } = this.props
        let { loginEmail, loginPass, } = this.state



        if (loginEmail == "") {
            helper.showToast("Please Enter Your Email", theme.error_alert)
            return
        }
        // if (helper.isValidEmail(loginEmail)) {
        //     helper.showToast("Please Enter Your Email Correctly", theme.error_alert)
        //     return
        // }
        if (loginPass == "") {
            helper.showToast("Please Enter Your Full Password", theme.error_alert)
            return
        }
        console.log(loginEmail)
        console.log(loginPass)
        this.setState({ isLoading: true })

        // auth()
        //     .signInWithEmailAndPassword(loginEmail, loginPass)
        //     .then(() => {
        //         this.setState({ isLoading: false })
        //         helper.showToast("User Account Signed in!", theme.loginScreen_buttonColor)
        //         var TempData = []
        //         TempData.push({
        //             "email": loginEmail,
        //             "password": loginPass
        //         })
        //         prefManager.saveUserData(TempData, this.state.checkBox)
        //         helper.resetAndGo(this.props.navigation, "HomeScreen")


        //     })
        //     .catch(error => {
        //         this.setState({ isLoading: false })
        //         if (error.code === 'auth/network-request-failed') {
        //             helper.showToast("Please Check Your Internet Connection & Try Again", theme.error_alert)
        //         }
        //         if (error.code === 'auth/user-not-found') {
        //             helper.showToast("User Not Found , Please SignUp First", theme.error_alert)
        //         }
        //         if (error.code === 'auth/wrong-password') {
        //             helper.showToast(" Password is Not Correct,Please Type Correct Password", theme.error_alert)
        //         }
        //     });

        let authdata = Buffer.from(`${username}:${password}`).toString('base64')
        let authHeader = `Basic ${authdata}`


        this.loginApiCall()
    }


    loginApiCall = () => {
        let { loginEmail, loginPass, } = this.state
        let { theme, headings } = this.props

        axios.post(apiUrl, {
            "username": loginEmail,
            "password": loginPass,
        }, {
            headers: { 'Content-Type': 'application/json' }
        }).then((resp) => {
            this.setState({ isLoading: false })
            console.log("resp===b===>", resp)

            console.log("Response===b===>", JSON.stringify(resp.data.message))
            let Toasterror = JSON.stringify(resp.data.message)

            if (resp.data.status == 'failed') {
                Toasterror = Toasterror.replace(/^"(.*)"$/, '$1');
                helper.showToast(Toasterror, theme.loginScreen_buttonColor)
            }
            else {
                console.log("Response======>", JSON.stringify(resp.data.data.ID))
                helper.showToast("User Account Signed in!", theme.loginScreen_buttonColor)
                helper.resetAndGo(this.props.navigation, "HomeScreen")
                var TempData = []
                TempData.push({
                    "email": loginEmail,
                    "password": loginPass,
                    "customer_id": resp.data.data.ID
                })
                prefManager.saveUserData(TempData)
            }

        }).catch((error) => {
            this.setState({ isLoading: false })
            // let Toasterror=JSON.stringify(error.response?.data?.message.split('<a')[0])

            //     Toasterror = Toasterror.replace(/^"(.*)"$/, '$1');
            //     helper.showToast(Toasterror, theme.loginScreen_buttonColor)
            console.log("Error=======>", error)
        })
    }


    render() {
        let { theme, language, languageReducer, themeReducer } = this.props
        return (
            // ____________________Parent View
            <SafeAreaView style={{
                // flex: 1,
                height: "110%",
                width: "100%",
                backgroundColor: theme.loginScreen_primary_backgroundColor,
                alignItems: 'center',
            }}>

                <StatusBar backgroundColor={"transparent"} translucent />

                {/* Background Image */}
                <Image style={{

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
                    marginTop: "30%",
                    fontSize: 30,
                }}> {language.welcome} </Text>

                <Text style={{
                    ...headings.h4,
                    color: theme.loginScreen_primary_light_textColor,
                    fontSize: 13,
                }}> {language.Please_sign_in_to_your_account} </Text>

                {/* VIew for Input Text Fields for Email And Password */}
                <View style={{
                    width: "100%",
                    height: 700,
                    marginTop: "4%",

                }}>

                    <TextInput
                        style={{
                            height: "8%",
                            width: "78%",
                            paddingHorizontal: '6.8%',
                            alignSelf: 'center',
                            color: theme.loginScreen_primary_textColor,
                            backgroundColor: theme.loginScreen_TextInputColor,
                            borderRadius: 20,
                            fontSize: 18,
                            top: "7%",
                            marginTop: "5%"
                        }}
                        onChangeText={(value) => this.setState({ loginEmail: value })}
                        value={this.state.loginEmail}

                        keyboardType="email-address"
                        placeholder="Email Address"
                        placeholderTextColor={theme.loginScreen_primary_light_textColor}
                    />
                    <TextInput
                        style={{
                            height: "8%",
                            width: "78%",
                            paddingLeft: '6.8%',
                            paddingRight: '12%',
                            alignSelf: 'center',
                            color: theme.loginScreen_primary_textColor,
                            backgroundColor: theme.loginScreen_TextInputColor,
                            borderRadius: 20,
                            fontSize: 18,
                            top: "7%",
                            marginTop: "5%"
                        }}
                        onChangeText={(value) => this.setState({ loginPass: value })}
                        value={this.state.loginPass}
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
                            top: '23%'
                        }}>

                        <Entypo name={this.state.showPassword ? 'eye-with-line' : 'eye'} size={20} color={'#EEE'} ></Entypo>
                    </TouchableOpacity>
                    {/* Forget Password Button */}
                    <TouchableOpacity style={{
                        marginTop: "15%",
                    }}
                        onPress={() => {
                            Linking.openURL('https://houseoffashion.gtechsol.au/my-account/lost-password/')
                            // this.props.navigation.navigate("ForgetPassword") 
                        }}
                        activeOpacity={0.7} >

                        <Text style={{
                            ...headings.h4,
                            color: theme.loginScreen_primary_light_textColor,
                            textAlign: 'right',
                            paddingRight: "9%",
                        }}> {language.Forget_Password} </Text>
                    </TouchableOpacity>

                    {/* Sign In Button */}


                    {this.state.isLoading &&
                        <ActivityIndicator
                            size="large"
                            color={theme.loginScreen_buttonColor}
                            style={{ marginTop: "27%", }}
                        />}
                    {!this.state.isLoading &&
                        <>
                            <SimpleStyleButton
                                title={language.log_in_button_loginScreen}
                                height='7%'
                                width='75%'
                                marginTop='24%'
                                bodyBackground={theme.loginScreen_buttonColor}
                                textColor={theme.loginScreen_primary_textColor}
                                // onPress={() => { this.LoginController() }}
                                onAction={() => { this.LoginController() }}
                            />


                            {/* Asking for sign up */}
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
                                }}> {language.Dont_have_an_account} </Text>

                                {/* Sign up button */}
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("SignupScreen")}
                                >
                                    <Text style={{
                                        color: theme.loginScreen_buttonColor,
                                    }}> {language.Sign_up} </Text>
                                </TouchableOpacity>
                            </View>
                        </>}
                </View>

            </SafeAreaView>
        )
    }
}


export default connect(ReducersProps, ReducersActions)(LoginScreen)