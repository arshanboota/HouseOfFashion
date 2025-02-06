import React, { Component } from 'react'
import { View, Text, TextInput, ActivityIndicator, SafeAreaView, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { container, headings } from '../../../source/utils/Styles'
import ReducersProps from '../../../source/data/local/reducers/ReducersProps'
import ReducersActions from '../../../source/data/local/reducers/ReducersActions'
import Helper from '../../utils/Helper'
import auth from '@react-native-firebase/auth';

const helper = new Helper()


class ForgetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginEmail: '',
            isLoading: false
        }
    }


    componentDidMount() { }

    forgetController() {
        let { theme } = this.props
        let { loginEmail } = this.state

        if (loginEmail == "") {
            helper.showToast("Please Enter Your Email", theme.error_alert)
            return
        }
        if (!helper.isValidEmail(loginEmail)) {
            helper.showToast("Please Enter Your Email Correctly", theme.error_alert)
            return
        }

        this.setState({ isLoading: true })

        auth()
            .sendPasswordResetEmail(loginEmail)
            .then((res) => {
                console.log(res)
                this.setState({ isLoading: false })
                helper.showToast("We Sent You a Email With Reset Password Link Please Update Your Password", theme.loginScreen_buttonColor)
                //   helper.resetAndGo(this.props.navigation, "HomePage")
            })
            .catch(error => {
                console.log("=>", error)
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
            <View style={{
                flex: 1,
                alignItems: 'center',
                backgroundColor: theme.loginScreen_primary_backgroundColor
            }}>
                <StatusBar translucent backgroundColor="transparent" />

                {/* Background Image */}
                <Image style={{
                    paddingTop: "5%",
                    position: 'absolute',
                    opacity: 0.5,
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height + 40,
                }}
                    blurRadius={1}
                    source={require("../../assets/Images/background.jpg")} />

                {/* Heading Text  */}
                <Text style={{
                    color: theme.loginScreen_primary_textColor,
                    fontSize: 30,
                    fontWeight: 'bold',
                    marginTop: "30%",
                    ...headings.h1,
                }}>Welcome Back!</Text>


                <Text style={{
                    ...headings.h3,
                    color: theme.loginScreen_primary_light_textColor,
                    fontSize: 12,
                    textAlign: "center",
                    marginTop: "2%"
                }}>Please Enter Your Email To {"\n"}  RESET Your Password</Text>



                {/* VIew for Imput Text Fields for Email */}
                <View style={{
                    width: "100%",
                    height: 700,
                    marginTop: "10%",
                }}>
                    {/* Email Text Input */}
                    <TextInput
                        style={{
                            height: "10%",
                            width: "85%",
                            alignSelf: 'center',
                            color: theme.loginScreen_primary_textColor,
                            backgroundColor: theme.loginScreen_TextInputColor,
                            borderRadius: 20,
                            paddingRight: 20,
                            fontSize: 18,
                            top: "9%",
                        }}
                        onChangeText={(value) => this.setState({ loginEmail: value })}
                        value={this.state.loginEmail}
                        paddingLeft='7%'
                        placeholder="Email Address"
                        placeholderTextColor={theme.loginScreen_primary_light_textColor}
                    />

                    {/* ActivityIndicator */}
                    {this.state.isLoading &&
                        <ActivityIndicator
                            size="large"
                            color={theme.loginScreen_buttonColor}
                            style={{ marginTop: "63%", }}
                        />}


                    {!this.state.isLoading &&
                        <>
                            {/* Sign In Button */}
                            <TouchableOpacity style={{
                                height: "8%",
                                width: "85%",
                                alignSelf: 'center',
                                color: theme.loginScreen_primary_textColor,
                                backgroundColor: theme.loginScreen_buttonColor,
                                borderRadius: 20,
                                marginTop: "54%",
                                justifyContent: 'center',
                            }}
                                activeOpacity={0.7}
                                onPress={() => { this.forgetController(), this.props.navigation.navigate("LoginScreen") }}
                            >
                                <Text style={{
                                    ...headings.h3,
                                    // fontSize: 15,
                                    color: theme.loginScreen_primary_textColor,
                                    textAlign: 'center',
                                }}>Send Email</Text>
                            </TouchableOpacity>




                            {/* Asking for sign up */}
                            <View style={{
                                flexDirection: 'row',
                                alignSelf: 'center',
                                top: "10%",
                            }}>
                                {/* text */}
                                <Text style={{
                                    color: theme.loginScreen_primary_textColor,
                                    alignSelf: 'center',
                                    fontSize: 12,
                                    paddingBottom: 94
                                }}>Don't have an account?</Text>

                                {/* Sign up button */}
                                <TouchableOpacity
                                    onPress={() => { this.props.navigation.navigate("SignupScreen") }}>
                                    <Text style={{
                                        ...headings.h3,
                                        alignSelf: 'center',
                                        fontSize: 14,
                                        top: -2,
                                        color: theme.loginScreen_buttonColor,
                                    }}>  Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </>}
                </View>

            </View>

        )
    }
}



export default connect(ReducersProps, ReducersActions)(ForgetPassword)


