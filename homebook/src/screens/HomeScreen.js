import React, { Component } from 'react';
import { ImageBackground, ScrollView, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { getReference, getUser, getFriend } from "../store/actions/index";

class HomeScreen extends Component {
    state = {
        refresh: false,
        friendNameArray: []
    };

    ReferenceHandler = placeName => {
        this.props.onGetReference(placeName);
    };

    openSideMenu = () => Navigation.mergeOptions(this.props.componentId, {
        sideMenu: {
            left: { visible: true }
        }
    });

    pushUserProfile = () => {
        Navigation.push(this.props.componentId, {
            component: {
                name: 'UserProfile'
            }
        });
    }

    pushFriendProfile = () => Navigation.push(this.props.componentId, {
        component: {
            name: 'FriendProfile'
        }
    });

    pushAddUser = () => Navigation.push(this.props.componentId, {
        component: {
            name: 'AddUser'
        }
    });

    pushSearchUserPage = () => Navigation.push(this.props.componentId, {
        component: {
            name: 'SearchUser'
        }
    });

    componentDidMount() {
        this.setState({
            friendNameArray: this.props.user.friendNameArray
        });
    }
    componentWillReceiveProps(prevProps) {
        if (prevProps.loaded != this.props.loaded) {
            this.setState({
                refresh: !this.state.refresh,
                friendNameArray: this.props.user.friendNameArray
            });
        }
    }



    friendHandler = val => {
        //alert(this.state.referenceArray[val])
        this.props.onGetFriend(this.props.user.docId, this.props.user.referenceArray[val])
        //alert(this.props.refpoint);
        this.pushFriendProfile();
    };

    renderWhiteLine = val => {
        if (val >= 1) {
            return (
                <View
                    style={{
                        borderBottomColor: 'white',
                        borderBottomWidth: 2,
                    }}
                />
            );
        }
    }

    render() {

        return (
            <ImageBackground source={require('../screens/Background.png')} style={{ width: '100%', height: '100%' }}>
                <View style={styles.container}>
                    <View style={styles.icons}>
                        <TouchableOpacity
                            onPress={this.openSideMenu}>
                            <Icon size={30} name='ios-menu' color='white' />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.pushSearchUserPage}>
                            <Icon size={30} name='ios-send' color='white' />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={this.pushUserProfile} style={{ width: '85%' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            <Icon size={35} name='ios-contact' color='white' />
                            <Text style={styles.mainText}>   {this.props.user.firstN} {this.props.user.lastN}</Text>
                        </View>
                    </TouchableOpacity>
                    <ScrollView style={{ width: '100%' }} indicatorStyle='white'>
                        <View style={styles.alignment}>
                            <FlatList
                                style={styles.list}
                                data={this.state.friendNameArray}
                                extraData={this.state}

                                renderItem={({ item, index }) =>
                                    <View>
                                        <View>{this.renderWhiteLine(index)}</View>

                                        <TouchableOpacity
                                            onPress={() => this.friendHandler(index)}
                                        >
                                            <Text style={styles.bodyText}>{item}</Text>
                                        </TouchableOpacity>
                                    </View>
                                }

                                keyExtractor={(item,index) => index.toString()}
                            />
                        </View>
                    </ScrollView>
                    <View style={{ position: 'absolute', bottom: 20, right: '7.5%' }}>
                        <TouchableOpacity
                            onPress={this.pushAddUser}>
                            <Icon size={65} name='ios-add-circle' color='white' />
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    icons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
        width: '85%'
    },
    alignment: {
        left: '7.5%',
        width: '85%'
    },
    mainText: {
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 25,
        color: 'white'
    },
    list: {
        marginTop: 20
    },
    bodyText: {
        color: 'white',
        marginTop: 15,
        marginBottom: 15,
        fontSize: 20
    }
});
const mapStateToProps = state => {
    return {
        user: state.reference.user,
        loaded: state.reference.loaded

    };
};


const mapDispatchToProps = dispatch => {
    return {
        onGetReference: name => dispatch(getReference(name)),
        onGetUser: () => dispatch(getUser()),
        onGetFriend: (userId, ref) => dispatch(getFriend(userId, ref)),

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);