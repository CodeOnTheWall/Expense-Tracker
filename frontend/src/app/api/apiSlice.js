import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { setCredentials } from "../../features/auth/authSlice";

// By creating this baseQuery object, we are able to provide a default
// configuration for all network requests made by the createApi function,
// including the base URL and the authentication token header.
const baseQuery = fetchBaseQuery({
  // base url for all req made by createApi
  baseUrl: "http://localhost:3000",

  // this property specifies whether cookies should be sent with the request.
  credentials: "include",

  // allows you to modify the headers of every request made by the createApi
  // first checks current state of store using getState
  prepareHeaders: (headers, { getState }) => {
    // looking at current state, then auth state and getting current token and assigning that token
    const token = getState().auth.token;

    // if token, set headers
    if (token) {
      // specific format expected is 'Bearer token' - this sets authorization header
      headers.set("authorization", `Bearer ${token}`);
    }
    // now this is applied to every req sent
    return headers;
  },
});

// query wrapper
// args (req url, method, and body), createApi object, extraOptions
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // await original req
  let result = await baseQuery(args, api, extraOptions);

  // trying original aT (if any) - if error, have to send a rT to get a new aT
  if (result?.error?.status === 403) {
    console.log("sending refresh token");

    // send rT to get new aT
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    // data should hold access token
    if (refreshResult?.data) {
      // store the new token by spreading in the access token and set that token in redux state
      api.dispatch(setCredentials({ ...refreshResult.data }));

      // essentially trying original aT, then send rT, and gives us new access token, with setCredentials
      // after setting credentials, retry original query (args) with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // else we also dont have a rT
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = "Your login has expired.";
      }
      return refreshResult;
    }
  }

  return result;
};

// baseQueryWithReauth is being passed as a param to createApi
// default config for all network req
export const apiSlice = createApi({
  // using baseQueryWithReauth as default for baseQuery
  baseQuery: baseQueryWithReauth,
  // for invalidating cached data
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
});
