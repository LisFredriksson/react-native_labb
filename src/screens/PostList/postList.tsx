import { ListItem, Button } from "@rneui/base";
import { FlatList, Text, View, RefreshControl, StyleSheet } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";

import {
  useCreateLikeMutation,
  useDeleteLikeMutation
} from "../../stores/api/likesApi";
import {
  useGetPostQuery,
  useDeletePostMutation,
} from "../../stores/api/postsApi";

const PostList = ({ navigation }) => {
  const [deletePost] = useDeletePostMutation();
  const toast = useToast();
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const [createLike] = useCreateLikeMutation();
  const deleteHandler = async (post) => {
    try {
      const response = await deletePost({ post: { id: post.id } });
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
  const likeHandler = async (post) => {
    try {
      await createLike({
        like: {
          postId: post.id,
          userId: post.userId,
        },
      });
    } catch (error) {
      console.error("Error creating like:", error);
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
              (item.private === false && (
              <ListItem>
                <ListItem.Content>
                  <ListItem.Title>
                    {`${item.createdBy}: ${item.text}`}
                  </ListItem.Title>
                  <ListItem.Title>{`${item.createdDate}`}</ListItem.Title>
                </ListItem.Content>
                {loggedInAs.id === item.userId && (
                  <Button onPress={() => deleteHandler(item)}>Delete</Button>
                )}
                <Icon onPress={() => likeHandler(item)} name="heart-o" size={30} color="#000" />
              </ListItem>
              ))
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
