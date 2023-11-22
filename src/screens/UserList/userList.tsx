import { Button } from "@rneui/base";
import { useMemo, useState } from "react";
import { FlatList, Text, View, RefreshControl, StyleSheet } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from "react-redux";

import {
  useGetPostQuery,
  useDeletePostMutation,
} from "../../stores/api/postsApi";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../stores/api/usersApi";
import { logOut } from "../../stores/slices/authSlice";
import UserItem from "../UserItem/userItem";

const UserList = ({ navigation }) => {
  const [deleteUser] = useDeleteUserMutation();
  const [deletePost] = useDeletePostMutation();
  const dispatch = useDispatch();
  const { data: postData } = useGetPostQuery({});
  const toast = useToast();
  const { data, isLoading, refetch } = useGetUsersQuery({});
  const [selectedItems, setSelectedItems] = useState([]);
  const sortedUsers = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const lastNameA = a.lastName.toUpperCase();
      const lastNameB = b.lastName.toUpperCase();
      if (lastNameA < lastNameB) return -1;
      if (lastNameA > lastNameB) return 1;
      return 0;
    });
  }, [data]);

  const deleteHandler = async (user) => {
    try {
      const response = await deleteUser({ user: { id: user.id } });
      if ("error" in response) {
        console.error("Delete error:", response.error);
      } else {
        const userPosts = postData.filter((post) => post.userId === user.id);
        userPosts.forEach(async (post) => {
          await deletePost({ post: { id: post.id } });
        });
        dispatch(logOut());
        toast.show(`${user.firstName} ${user.lastName} raderad!`, {
          type: "warning",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
      }
    } catch (error) {
      console.error("API call error:", error);
    }
  };

  const handleChange = (itemId, isSelected) => {
    if (isSelected) {
      setSelectedItems((oldArray) => [...oldArray, itemId]);
    } else {
      setSelectedItems((oldArray) =>
        oldArray.filter((item) => item !== itemId),
      );
    }
  };

  const bulkDeleteHandler = () => {
    selectedItems.forEach(item => {
      deleteUser({ user: { id: item } });
      setSelectedItems([]);
    });
  };

  return (
    <View style={styles.mainContainer}>
      {isLoading ? (
        <Text> ...Loading </Text>
      ) : (
        <View>
          <Text style={styles.mainHeader}>Användare</Text>
          {selectedItems.length > 1 ? (<Button onPress={bulkDeleteHandler}>Bulk delete</Button>) : ('')}

          <FlatList
            data={sortedUsers}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
            renderItem={({ item }) => (
              <UserItem
                key={item.id}
                item={item}
                navigation={navigation}
                onDelete={deleteHandler}
                onCheckboxChange={handleChange}
            />
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainHeader: {
    color: "black",
    fontSize: 50,
    fontWeight: "400",
    padding: 20,
  },
  mainContainer: {
    paddingBottom: 300,
    backgroundColor: "white",
  },
});

export default UserList;
