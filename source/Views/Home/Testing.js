import React, { Component } from 'react';
import { View, Text } from 'react-native';
import WooCommerceAPI from 'react-native-wc-api';
import Urls from '../../data/remote/Urls'
const WooCommerce = new WooCommerceAPI({
    url: Urls.Domain ,
    consumerKey: Urls.consumerKey,
    consumerSecret:Urls.consumerSecret,
    // consumerKey: 'ck_75b3f83c480dc5a5126b512df472c4febbadc823',
    // consumerSecret: 'cs_be4e7ce4df0195f0c07bc3c5aac5a9d58b8653fb',
    wpAPI: true,
    version: 'wc/v3',
    queryStringAuth: true,    
});
export default class Testing extends Component {
  constructor(props) {
    super(props);
    this.state = {

      productData: this.props.route.params?.productData ?? '',
     id :176
    };
  }
  componentDidMount(){

    this.apiCallForAllCategory()
  }

  apiCallForAllCategory() {

       //var url= 'products/176/variations'
       var url = "products/" + this.state.productData.id + "/variations"
       //  var url = "products/" + this.state.productData.id + "/variations"
         console.log("------------------ok",url)
        
 
         WooCommerce.get(url, {
              
         }).then(response => {
 
              console.log("\x1b[33m", '==================products variation================================', JSON.stringify(response.data))
         } )

  }


  render() {
    return (
      <View>
        <Text> Testing </Text>
      </View>
    );
  }
}
