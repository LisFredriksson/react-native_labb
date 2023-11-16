import { ListItem, Button } from "@rneui/base";
import { FlatList, Text, View, RefreshControl, StyleSheet } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useDispatch, useSelector } from "react-redux";

import {
  useGetPostQuery,
  useDeletePostMutation,
} from "../../stores/api/postsApi";

const PostList = ({ navigation }) => {
  const [deletePost] = useDeletePostMutation();
  const toast = useToast();
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const deleteHandler = async (post) => {
    try {
      const response = await deletePost({ post: { id: post.id } });

      // Check if the response is an error or not
      if ("error" in response) {
        console.error("Delete error:", response.error);
      } else {
        toast.show(`${post.createdBy} post raderad!`, {
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
  const { data, isLoading, refetch } = useGetPostQuery({});
  return (
    <View style={styles.mainContainer}>
      {isLoading ? (
        <Text> ...Loading </Text>
      ) : (
        <View>
          <FlatList
            data={data}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
            renderItem={({ item }) => (
              <ListItem>
                <ListItem.Content>
                  <ListItem.Title>
                    {`${item.createdBy}: ${item.text}`}
                  </ListItem.Title>
                  <ListItem.Title>
                    {`${item.createdDate}`}
                  </ListItem.Title>
                </ListItem.Content>
                {loggedInAs.id === item.userId && (
                <Button onPress={() => deleteHandler(item)}>Delete</Button>
               )}
              </ListItem>
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
    backgroundColor: "white",
    paddingBottom: 50,
  },
});

export default PostList;
