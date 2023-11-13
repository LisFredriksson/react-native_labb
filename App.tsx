// In App.js in a new project

import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import  UserForm  from './src/screens/UserForm/userForm';
import  UserList  from './src/screens/UserList/userList';
import  UpdateForm  from './src/screens/updateForm/updateForm';
import  UserInfo  from './src/screens/UserInfo/UserInfo';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, useSelector } from 'react-redux';
import { store } from './src/stores/store';
import { ToastProvider } from 'react-native-toast-notifications'
import Icon from 'react-native-vector-icons/FontAwesome'

const UserListStack = createNativeStackNavigator()

const UserListStackScreen = () => {
  return (
    <UserListStack.Navigator>
      <UserListStack.Screen name="UserList" component={UserList} options={{ title: 'Användare' }}/>
      <UserListStack.Screen name="UserInfo" component={UserInfo} options={{ title: 'Användarkonto'}}/>
    </UserListStack.Navigator>
  )
}

const Tab = createBottomTabNavigator();

const NavigationWrapper = () => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs)

  return (
    <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="UserListStack" component={UserListStackScreen} options={{ headerShown: false, tabBarIcon:() => (<Icon name="users" size={30} color="#000"/>) }} />
          <Tab.Screen name="UserForm" component={UserForm} options={{ title: 'Ny användare' , tabBarIcon:() => (<Icon name="plus" size={30} color="#000"/>) }} />
          {loggedInAs && (
            <Tab.Screen name="UserInfo" component={UserInfo} options={{ title: `${loggedInAs.firstName} ${loggedInAs.lastName}` , tabBarIcon:() => (<Icon name="user" size={30} color="#000"/>) }} />
          )}
          <Tab.Screen name="UpdateForm" component={UpdateForm} options={{ title: 'Uppdatera' , tabBarIcon:() => (<Icon name="arrows" size={30} color="#000"/>) }} />
        </Tab.Navigator>
      </NavigationContainer>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Provider store={store}>
        <NavigationWrapper />
      </Provider>
    </ToastProvider>

  );
}
