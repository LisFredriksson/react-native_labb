import { ListItem } from "@rneui/base";
import { Button, Text } from "@rneui/themed";
import { StyleSheet, View, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { useGetPostQuery } from "../../stores/api/postsApi";
import { logIn, logOut } from "../../stores/slices/authSlice";
import { maxHeaderSize } from "http";
import { $CombinedState } from "@reduxjs/toolkit";

export const UserInfo = ({ route, navigation }) => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const user = route?.params?.user || loggedInAs;
  const { data: postData } = useGetPostQuery({});
  const dispatch = useDispatch();
  const userPosts = postData
    ? postData.filter((post) => post.userId === user.id)
    : [];
  return (
    <View style={styles.container}>
      <Text style={styles.nameHeader}>{`${user.firstName} ${user.lastName}`}</Text>
       {loggedInAs?.id === user.id && (
      <View style={styles.infoContainer}>
        <Text style={styles.header}>My Posts</Text>
        <FlatList
          data={userPosts}
          renderItem={({ item }) => (
            <ListItem key={item.id}>
              <ListItem.Content>
                <ListItem.Title>
                  {`${item.createdDate}: ${item.text}`}
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
          )}
        />
      </View>
      )}
      <View style={styles.actionsContainer}>
        {loggedInAs?.id === user.id ? (
          <Button
            onPress={() => dispatch(logOut())}
            title="Logga ut"
            color="error"
          />
        ) : (
          <>
            <Button onPress={() => dispatch(logIn(user))} title="Logga in" />
          </>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    margin: 24,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 36,
  },
  infoContainer: {
    margin: 24,
  },
  actionsContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    paddingLeft: 15,
    marginBottom: 16,
  },
  nameHeader: {
    fontSize: 30,
    alignSelf: "center",
    marginBottom: 16,
  }
});

export default UserInfo;
