// injecting endpoints into our api to interact with backend api
import { apiSlice } from "../../app/api/apiSlice";

// non api slice (not communicating with back end) that handles frontend state via reducer functions/action handlers
import { logOut, setCredentials } from "./authSlice";

// requests to be sent to back end api which receive as responses
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      // credentials is username and password that is sent with query
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        // object expected to be received by the backend, spreading out the credentials into the object
        body: { ...credentials },
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // onQueryStarted is an rtkq function to call inside an endpoint, needs an arg at the beg, its required even if not used
      // queryFulfilled to see if that finished
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // queryFulfilled waits for the req to be successfull (req to /auth/logout)
          // its a promise that resolves when the req is successfull and res comes back
          // if error and not resolves, catch error
          await queryFulfilled;
          // sets token to null in local state
          dispatch(logOut());
          // to get rid of subscription and 'clear' apiSlice as well, to clear out cache and query subscription
          setTimeout(() => {
            // util is a property of apiSlice that has utility functions, such as below to clear cache
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),
    // sending a get req with a cookie with rT, to get a new aT
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          // data should be the aT
          const { data } = await queryFulfilled;
          // destructure
          const { accessToken } = data;
          // setting redux state with aT
          dispatch(setCredentials({ accessToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

// use and Mutation are auto added
export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
  authApiSlice;
