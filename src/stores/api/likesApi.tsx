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
    case "GET": {
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
        return { data: `Like with ID ${docRefs.id} updated successfully` };
      } catch (error) {
        throw new Error(
          `Failed to update like with ID ${docRefs.id}: ${error.message}`,
        );
      }
    }
    case "DELETE":
      try {
        await deleteDoc(doc(db, url, body.id));
        return { data: `Like with ID ${body.id} deleted successfully` };
      } catch (error) {
        throw new Error(`Failed to delete like: ${error.message}`);
      }

    default:
      throw new Error(`Unhandled method ${method}`);
  }
};

export const likesApi = createApi({
  reducerPath: "likesApi",
  baseQuery: firebaseBaseQuery,
  tagTypes: ["likes"],
  endpoints: (builder) => ({
    createLike: builder.mutation({
      query: ({ like }) => ({
        baseUrl: "",
        url: "likes",
        method: "POST", // PUT = modifiera data - DELETE = ta bort data
        body: like,
      }),
      invalidatesTags: ["likes"],
    }),
    deleteLike: builder.mutation({
      query: ({ like }) => ({
        baseUrl: "",
        url: "likes",
        method: "DELETE", // PUT = modifiera data - DELETE = ta bort data
        body: like,
      }),
    }),
    updateLike: builder.mutation({
      query: ({ like }) => ({
        baseUrl: "",
        url: "likes",
        method: "PUT", // PUT = modifiera data - DELETE = ta bort data
        body: like,
      }),
    }),
    getLikes: builder.query({
      query: () => ({
        baseUrl: "",
        url: "likes",
        method: "GET",
        body: "",
      }),
      providesTags: ["likes"],
    }),
  }),
});

export const {
  useCreateLikeMutation,
  useDeleteLikeMutation,
  useGetLikesQuery,
  useUpdateLikeMutation,
} = likesApi;
