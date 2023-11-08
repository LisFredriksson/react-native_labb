import { createApi } from '@reduxjs/toolkit/query/react';
import { db } from '../../../firebase-config';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
	switch (method) {
		case 'GET':
			const snapshot = await getDocs(collection(db, url));
			const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			return { data };

		case 'POST':
			const docRef = await addDoc(collection(db, url), body);
			return { data: { id: docRef.id, ...body } };

        case 'PUT':
            const docRefs = doc(db, url, body.id);
            try {
                await updateDoc(docRefs, body);
                return { data: `User with ID ${docRefs.id} updated successfully` };
            } catch (error) {
                throw new Error(`Failed to update user with ID ${docRefs.id}: ${error.message}`);
			}
        case 'DELETE':
            try {
                await deleteDoc(doc(db, url, body.id));
                return { data: `User with ID ${body.id} deleted successfully` };
            } catch (error) {
                throw new Error(`Failed to delete user: ${error.message}`);
            }

		default:
			throw new Error(`Unhandled method ${method}`);
	}
};

export const usersApi = createApi({
  reducerPath: 'usersApi',
	baseQuery: firebaseBaseQuery,
	tagTypes: ['users'],
	endpoints: (builder) => ({
		createUser: builder.mutation({
			query: ({ user }) => ({
				baseUrl: '',
				url: 'users',
				method: 'POST', // PUT = modifiera data - DELETE = ta bort data
				body: user
			}),
			invalidatesTags: ['users']
		}),
        deleteUser: builder.mutation({
			query: ({ user }) => ({
				baseUrl: '',
				url: 'users',
				method: 'DELETE', // PUT = modifiera data - DELETE = ta bort data
				body: user
			}),
		}),
        updateUser: builder.mutation({
			query: ({ user }) => ({
				baseUrl: '',
				url: 'users',
				method: 'PUT', // PUT = modifiera data - DELETE = ta bort data
				body: user
			}),
		}),
        getUsers: builder.query({
            query: () => ({
              baseUrl: '',
              url: 'users',
              method: 'GET',
              body: ''
            }),
			providesTags: ['users']
          }),
	}),
});

export const { useCreateUserMutation, useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } = usersApi;
