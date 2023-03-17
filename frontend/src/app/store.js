import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    // rtkq required
    // all apiSlices in their respective files inject endpoints into apiSlice (that interact with api)
    // other slices for regular store, are added below that dont interact with api
    // such as authReducer
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,

  // This middleware intercepts all dispatched actions that are defined as an RTK
  // Query endpoint (in the endpoints property of createApi) and handles them. The
  // middleware will use the baseQuery object you passed to createApi as the default
  // configuration for all network requests made by the RTK Query endpoints.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  // to be able to use redux devTools
  devTools: true,
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);
