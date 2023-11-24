// In App.js in a new project

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ToastProvider } from "react-native-toast-notifications";
import Icon from "react-native-vector-icons/FontAwesome";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import PostForm from "./src/screens/PostForm/postForm";
import PostList from "./src/screens/PostList/postList";
import UserForm from "./src/screens/UserForm/userForm";
import UserInfo from "./src/screens/UserInfo/UserInfo";
import UserList from "./src/screens/UserList/userList";
import UpdateForm from "./src/screens/updateForm/updateForm";
import { store, persistor } from "./src/stores/store";

const UserListStack = createNativeStackNavigator();

const UserListStackScreen = () => {
  return (
    <UserListStack.Navigator>
      <UserListStack.Screen
        name="UserList"
        component={UserList}
        options={{ title: "Användare" }}
      />
      <UserListStack.Screen
        name="UserInfo"
        component={UserInfo}
        options={{ title: "Användarkonto" }}
      />
      <UserListStack.Screen
        name="UpdateForm"
        component={UpdateForm}
        options={{ title: "Uppdatera" }}
      />
    </UserListStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const NavigationWrapper = () => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        {!loggedInAs && (
          <Tab.Screen
            name="UserListStack"
            component={UserListStackScreen}
            options={{
              headerShown: false,
              tabBarIcon: () => <Icon name="users" size={30} color="#000" />,
            }}
          />
        )}
        {!loggedInAs && (
          <Tab.Screen
            name="UserForm"
            component={UserForm}
            options={{
              title: "Ny användare",
              tabBarIcon: () => <Icon name="plus" size={30} color="#000" />,
            }}
          />
        )}
        {loggedInAs && (
          <Tab.Screen
            name="UserInfo"
            component={UserInfo}
            options={{
              title: `${loggedInAs.firstName} ${loggedInAs.lastName}`,
              tabBarIcon: () => <Icon name="user" size={30} color="#000" />,
            }}
          />
        )}
        {loggedInAs && (
          <Tab.Screen
            name="PostForm"
            component={PostForm}
            options={{
              title: `Add Post`,
              tabBarIcon: () => <Icon name="plus" size={30} color="#000" />,
            }}
          />
        )}
        {loggedInAs && (
          <Tab.Screen
            name="PostList"
            component={PostList}
            options={{
              title: `All Posts`,
              tabBarIcon: () => <Icon name="heart" size={30} color="#000" />,
            }}
          />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationWrapper />
        </PersistGate>
      </Provider>
    </ToastProvider>
  );
}
