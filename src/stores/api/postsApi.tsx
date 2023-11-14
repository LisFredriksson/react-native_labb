import { createApi } from "@reduxjs/toolkit/query/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../firebase-config";

const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
  switch (method) {
    case "GET":{
      const snapshot = await getDocs(collection(db, url));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return { data };
    }

    case "POST": {
      const docRef = await addDoc(collection(db, url), body);
      return { data: { id: docRef.id, ...body } };
    }
    case "PUT": {
      const docRefs = doc(db, url, body.id);
      try {
        await updateDoc(docRefs, body);
        return { data: `Post with ID ${docRefs.id} updated successfully` };
      } catch (error) {
        throw new Error(
          `Failed to update post with ID ${docRefs.id}: ${error.message}`,
        );
      }
    }
    case "DELETE":
      try {
        await deleteDoc(doc(db, url, body.id));
        return { data: `post with ID ${body.id} deleted successfully` };
      } catch (error) {
        throw new Error(`Failed to delete post: ${error.message}`);
      }

    default:
      throw new Error(`Unhandled method ${method}`);
  }
};

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: firebaseBaseQuery,
  tagTypes: ["posts"],
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: ({ post }) => ({
        baseUrl: "",
        url: "posts",
        method: "POST", // PUT = modifiera data - DELETE = ta bort data
        body: post,
      }),
      invalidatesTags: ["posts"],
    }),
    deletePost: builder.mutation({
      query: ({ post }) => ({
        baseUrl: "",
        url: "posts",
        method: "DELETE", // PUT = modifiera data - DELETE = ta bort data
        body: post,
      }),
    }),
    updatePost: builder.mutation({
      query: ({ post }) => ({
        baseUrl: "",
        url: "posts",
        method: "PUT", // PUT = modifiera data - DELETE = ta bort data
        body: post,
      }),
    }),
    getPost: builder.query({
      query: () => ({
        baseUrl: "",
        url: "posts",
        method: "GET",
        body: "",
      }),
      providesTags: ["posts"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetPostQuery,
  useUpdatePostMutation,
} = postsApi;
