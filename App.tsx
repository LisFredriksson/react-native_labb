// In App.js in a new project

import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import  UserForm  from './src/screens/UserForm/userForm';
import  UserList  from './src/screens/UserList/userList';
import  UserInfo  from './src/screens/UserInfo/UserInfo';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, useSelector } from 'react-redux';
import { store } from './src/stores/store';
import { ToastProvider } from 'react-native-toast-notifications'
import Icon from 'react-native-vector-icons/FontAwesome'

const Tab = createBottomTabNavigator();
const userListStack = createNativeStackNavigator()

const UserListStackScreen = () => {
  return (
    <userListStack.Navigator>
      <userListStack.Screen name="UserList" component={UserList}/>
      <userListStack.Screen name="UserInfo" component={UserInfo}/>
    </userListStack.Navigator>
  )
}

const NaviagtionWrapper = () => {
      const loggedInAs = useSelector((state: any) => state.auth.loggedInAs)
      return (
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="UserForm" component={UserForm} options={{ title: 'Lägg till', tabBarIcon:() => (<Icon name="plus" size={30} color="#000"/>), }}/>
          <Tab.Screen name="UserListStackScreen" component={UserListStackScreen} options={{ title: 'Användare', tabBarIcon:() => (<Icon name="users" size={30} color="#000"/>), }}/>
          {loggedInAs && <Tab.Screen name="UserInfo" component={UserInfo} options={{ title: `${loggedInAs.firstName}`, tabBarIcon:() => (<Icon name="user" size={30} color="#000"/>),}}/>}
        </Tab.Navigator>
      </NavigationContainer>
      )
}

export default function App() {
  return (
    <ToastProvider>
      <Provider store={store}>
        <NaviagtionWrapper />
      </Provider>
    </ToastProvider>
  );
}
