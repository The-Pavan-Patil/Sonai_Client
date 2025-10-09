import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./store";
import API_CONFIG from "../config/api";



export interface Project {
  projectId: string;
  title: string;
  description: string;
  client: string;
  location: string;
  projectType: "electrical" | "plumbing" | "hvac" | "firefighting" | "automation" | "mixed";
  status: "completed" | "ongoing" | "upcoming";
  startDate: string;
  endDate?: string;
  projectValue: number;
  duration: string;
  scope: string[];
  features: string[];
  technologies: string[];
  images: {
    url: string;
    caption: string;
    isPrimary: boolean;
  }[];
  teamSize: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PortfolioState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  projects: [],
  loading: false,
  error: null,
};

const API_BASE_URL = API_CONFIG.baseURL + 'api';


// Thunk to fetch projects
export const fetchProjects = createAsyncThunk( ``, async () => {
  const response = await axios.get(`${API_BASE_URL}/portfolio`);
  return response.data.projects as Project[];
});


const portfolioSlice = createSlice({

  name: "portfolio",
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch projects";
      });
  },
});

export const selectProjects = (state: RootState) => state.portfolio.projects;
export const selectLoading =  (state: RootState) => state.portfolio.loading;

export default portfolioSlice.reducer;
