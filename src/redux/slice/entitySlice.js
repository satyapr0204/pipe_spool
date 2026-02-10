// store/entitySlice.js
import { createSlice } from "@reduxjs/toolkit";
import * as api from "../api";
import { toast } from "react-toastify";
import { createAsyncThunk } from "@reduxjs/toolkit";


 export const getAllEntity = createAsyncThunk(
  "user/getAllEntity",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.getAllEntity(formData);
      console.log("response", response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

 export const selectEntity = createAsyncThunk(
  "user/selectEntity",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.selectEntity(formData);
      console.log("response", response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

 export const getNotification = createAsyncThunk(
  "user/getNotification",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.getNotification(formData);
      console.log("response", response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

 export const readNotification = createAsyncThunk(
  "user/readNotification",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.readNotification(formData);
      console.log("response", response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

        
const entitySlice = createSlice({
  name: "entity",
  initialState: {
    list: [],
    selected: null,
    project: [],
    notifications:[],
    theme: null,
    primaryColor: null,
    selectedLogo: null,
    loading: false,
    error: null
  },
  reducers: {
    setEntity: (state, action) => {
      state.selected = action.payload;
      localStorage.setItem("selectedEntity", JSON.stringify(action.payload));
    },
    resetEntityState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEntity.fulfilled, (state, action) => {
        const entities = action?.payload?.data || [];
        state.list = entities;
        state.selected = entities[0];
        state.loading = false;

        const savedEntity = JSON.parse(localStorage.getItem("selectedEntity"));
        console.log(savedEntity)
        if (savedEntity) {
          // restore saved entity if it exists
          const entity = entities.find(e => e.id === savedEntity.id) || entities[0];
          state.selected = entity;
        } else if (!state.selected && entities.length > 0) {
          state.selected = entities[0]
        }
        // toast.success(action?.payload?.message)
      })
      .addCase(getAllEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        // toast.error(action?.payload?.message)
      })


      .addCase(selectEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectEntity.fulfilled, (state, action) => {
        const projects = action.payload.data || [];
        state.project = projects;
        const primary = projects?.[0]?.entity?.entity_primary_color;
        const secondary = projects?.[0]?.entity?.entity_secondary_color;
        state.primaryColor = secondary;
        state.selectedLogo = projects?.[0]?.entity?.logo;
        state.theme = primary && secondary
          ? `linear-gradient(135deg, ${primary}, ${secondary})`
          : "";

        if (projects?.[0]?.entity) {
          state.selected = projects[0].entity;
          localStorage.setItem("selectedEntity", JSON.stringify(projects[0].entity));
        }

        state.loading = false;
        // toast.success(action?.payload?.message)
      })
      .addCase(selectEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        // toast.error(action?.payload?.message)
      
      })

      builder.addCase(getNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotification.fulfilled, (state, action) => {   
        console.log("action",action?.payload?.data?.notifications)                       
        state.notifications = action?.payload?.data || [];
        state.loading = false;
      })
      .addCase(getNotification.rejected, (state, action) => {     
        state.loading = false; // ✅ FIX
        state.error = action.payload || action.error.message;
        toast.error(action?.payload?.message || "Failed to fetch notifications");
      })

      // .addCase(readNotification.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(readNotification.fulfilled, (state, action) => {                          
      //   // state.notifications = action?.payload?.data || [];
      //   state.loading = false;
      // })
      // .addCase(readNotification.rejected, (state, action) => {     
      //   state.loading = false; // ✅ FIX
      //   state.error = action.payload || action.error.message;
      //   toast.error(action?.payload?.message || "Failed to fetch notifications");
      // })

    }
});

export const { setEntity,resetEntityState } = entitySlice.actions;
export default entitySlice.reducer;
