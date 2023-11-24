import { ListItem, Button } from "@rneui/base";
import { FlatList, Text, View, RefreshControl, StyleSheet } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";

import {
  useCreateLikeMutation,
  useDeleteLikeMutation,
  useGetLikesQuery,
} from "../../stores/api/likesApi";
import {
  useGetPostQuery,
  useDeletePostMutation,
} from "../../stores/api/postsApi";
import LikeItem from "../likeItem/likeItem";

const PostList = ({ navigation }) => {
  const [deletePost] = useDeletePostMutation();
  const [deleteLike] = useDeleteLikeMutation();
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
  const deleteLikeHandler = async (likeData) => {
    try {
      const response = await deleteLike({ like: { id: likeData.id } });
      if ("error" in response) {
        console.error("Delete error:", response.error);
      } else {
        toast.show("unliked", {
          type: "warning",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
        refetchLikes();
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
          userId: loggedInAs.id,
        },
      });
    } catch (error) {
      console.error("Error creating like:", error);
    }
  };
  const { data, isLoading, refetch } = useGetPostQuery({});
  const {
    data: like,
    isLoading: likesLoading,
    refetch: refetchLikes,
  } = useGetLikesQuery({});

  return (
    <View style={styles.mainContainer}>
      {isLoading ? (
        <Text> ...Loading </Text>
      ) : (
        <View>
          <FlatList
            data={data}
            refreshControl={
              <RefreshControl
                refreshing={isLoading && likesLoading}
                onRefresh={() => {
                  refetch();
                  refetchLikes();
                }}
              />
            }
            renderItem={({ item }) => {
              const isLiked =
                like &&
                like.some(
                  (likeItem) =>
                    item.id === likeItem.postId &&
                    loggedInAs.id === likeItem.userId,
                );
              return (
                item.private === false ? (
                  <ListItem key={item.id}>
                    <ListItem.Content>
                      <ListItem.Title>
                        {`${item.createdBy}: ${item.text}`}
                      </ListItem.Title>
                      <ListItem.Title>{`${item.createdDate}`}</ListItem.Title>
                    </ListItem.Content>
                    {loggedInAs.id === item.userId && (
                      <Button onPress={() => deleteHandler(item)}>
                        Delete
                      </Button>
                    )}
                    <LikeItem
                      post={item}
                      isLiked={isLiked}
                      onDeleteLike={() =>
                        deleteLikeHandler(
                          like.find(
                            (likeItem) => likeItem.postId === item.id,
                          ) || {},
                        )
                      }
                      onLike={() => likeHandler(item)}
                    />
                  </ListItem>
                ) : item.private === true && loggedInAs.id === item.userId ? (
                  <ListItem key={item.id}>
                    <ListItem.Content>
                      <ListItem.Title>
                        {`${item.createdBy}: ${item.text}`}
                      </ListItem.Title>
                      <ListItem.Title>{`${item.createdDate}`}</ListItem.Title>
                    </ListItem.Content>
                    {loggedInAs.id === item.userId && (
                      <Button onPress={() => deleteHandler(item)}>
                        Delete
                      </Button>
                    )}
                    <LikeItem
                      post={item}
                      isLiked={isLiked}
                      onDeleteLike={() =>
                        deleteLikeHandler(
                          like.find(
                            (likeItem) => likeItem.postId === item.id,
                          ) || {},
                        )
                      }
                      onLike={() => likeHandler(item)}
                    />
                  </ListItem>
                ) : null
              );
            }}
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
