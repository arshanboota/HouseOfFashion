import React, { Component } from 'react'
import { FlatList, TouchableOpacity, Image, View, Text, } from 'react-native'
import { connect } from 'react-redux'
import { container, headings } from '../../utils/Styles'
import ReducersProps from '../../data/local/reducers/ReducersProps'
import ReducersActions from '../../data/local/reducers/ReducersActions'



class SimpleInputFields extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }




    render() {
        let { theme, } = this.props
        return (
            <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                // numColumns={2}
                data={this.props.data}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                    // Touchable Box in flat list
                    <TouchableOpacity style={{
                        // height: "100%",
                        // width: "40%",
                        fontSize: 30,
                        padding: 8,
                        marginLeft: 10,
                    }}
                        activeOpacity={0.9}
                        // onPress={() => this.props.navigation.navigate('ProductScreen', { data: this.state.data[index] })}
                        // onPress={() => { this.props.navigation.navigate('ProductScreen', { data: item })}}
                        onPress={(index) => this.props.onAction(index)}
                    >
                        {/* View For FlatList */}
                        <View style={{
                            // flex:1,
                            backgroundColor: 'red',
                            width:200,
                            height:150
                        }} >

                            <Text style={{ paddingTop: 2, fontWeight: 'bold', color: '#fff', textAlign: "center", fontSize: 14, }} numberOfLines={1}> {item.name}</Text>
                        <Text style={{ textAlign: "center", color: theme.product_secondary_color, fontSize: 10, width: "100%" }} numberOfLines={1}>{item.price}</Text> 

                             {/* <Image style={{ width: 120, height: 120, alignSelf: 'center', borderRadius: 10 }} source={item.Image} /> */}
                           
                        </View>
                    </TouchableOpacity>
                )
                } />
        )
    }
}


export default connect(ReducersProps, ReducersActions)(SimpleInputFields)