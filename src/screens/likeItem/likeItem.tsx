import { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { useGetLikesQuery } from "../../stores/api/likesApi";

const LikeItem = ({ post, isLiked, onDeleteLike, onLike }) => {
  const [likeCount, setLikeCount] = useState(0);
  const { data } = useGetLikesQuery({});

  useEffect(() => {
    let count = 0;
    data?.forEach((like) => {
      if (post.id === like.postId) {
        count += 1;
      }
    });
    setLikeCount(count);
  }, [data, post.id]);

  return (
    <>
      <Text style={styles.likeCount}>{likeCount || ""}</Text>
      <Icon
        onPress={() => (isLiked ? onDeleteLike() : onLike())}
        name={isLiked ? "heart" : "heart-o"}
        size={30}
        color="#000"
      />
    </>
  );
};

const styles = StyleSheet.create({
  likeCount: {
    padding: 10,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default LikeItem;
