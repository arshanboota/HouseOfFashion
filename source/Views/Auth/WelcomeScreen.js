import React, { Component } from 'react'
import { Text, View, StatusBar, Image, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { headings } from '../../utils/Styles'
import ReducersProps from '../../data/local/reducers/ReducersProps'
import ReducersActions from '../../data/local/reducers/ReducersActions'
import SimpleStyleButton from '../ReuseAbleComponents/SimpleStyleBUtton'
import Helper from '../../utils/Helper';

const helper = new Helper();
const BLUR_IMG = "https://papers.co/wallpaper/papers.co-sa52-blurred-white-blur-wallpaper-35-3840x2160-4k-wallpaper.jpg";


class WelcomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            promotionalText:"50% Off on \n EveryThing \n \n ",
            promotionDescription:"Offer will be valid when you spend $75 \n or more"
        };
    }
    render() {
                let { theme, language, } = this.props
                let {promotionalText,promotionDescription}=this.state
                return (
                    // ________Parent View
                    <View style={{
                        flex: 1,
                        backgroundColor: theme.welcomeScreen_primary_backgroundColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
        
                        <StatusBar backgroundColor={"transparent"} translucent />
        
                        {/* Background Image */}
                        <Image style={{
                            width: "100%",
                            height: "100%",
                            position: 'absolute',
                            opacity: 0.7,
                        }}   source={require("../../assets/Images/background.jpg")}/>
        
        
                        {/* View FOr Blur Box */}
                        <View style={{
                            width: "75%",
                            height: "25%",
                            marginTop: "100%",
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {/* Circle Image */}
                            <View style={{
                                width: "100%",
                                height: "100%",
                                opacity: 0.55,
                                 backgroundColor: theme.welcomeScreen_secondary_backgroundColor,
                                borderRadius: 50,
                             }} blurRadius={100} 
                             />
        
                            {/* Text for blur box */}
                            <Text style={{
                                ...headings.h3,
                                position: 'absolute',
                                fontSize: 25,
                                fontWeight: 'bold',
                                textAlign: 'center',
        
                                color: theme.welcomeScreen_primary_light_textColor,
                            }}> {promotionalText}
        
                                <Text style={{
                                    ...headings.h4,
                                    position: 'absolute',
                                    fontSize: 14,
                                    fontWeight: 'bold',
        
                                    color: theme.welcomeScreen_primary_light_textColor,
                                }}> {promotionDescription} </Text>
                            </Text>
        
                        </View>
        
                        {/* Login Button */}
                        <SimpleStyleButton
                            title={language.log_in_button}
                            height='7%'
                            width='75%'
                            marginTop="5%"
                            bodyBackground={theme.welcomeScreen_loginButton_color}
                            textColor={theme.welcomeScreen_buttonText_color}
                            onAction={() => { this.props.navigation.navigate("LoginScreen") }}
                        />
        
                        {/* SignUp Button */}
                        <SimpleStyleButton
                            title={language.Sign_up_button}
                            height='7%'
                            width='75%'
                            marginTop="5%"
                            bodyBackground={theme.welcomeScreen_signUpButton_color}
                            textColor={theme.welcomeScreen_signUpbuttonText_color}
                            onAction={() => { this.props.navigation.navigate("SignupScreen") }}
                        />
        
                    </View>
                )
            }
    }
export default connect(ReducersProps, ReducersActions)(WelcomeScreen)