import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "./store";

export interface Project {
  name: string;
  _id: string;
  title: string;
  client: string;
  category: "electrical" | "plumbing" | "hvac" | "mixed";
  location: string;
  completedDate: string;
  duration: string;
  budget: number;
  teamSize: number;
  status: "completed" | "featured";
  description: string;
  images: string[];
  videoUrl?: string;
  services: string[];
  awards?: string[];
  testimonial?: {
    text: string;
    author: string;
    position: string;
  };
  features: string[];
  stats: {
    area: string;
    systems: number;
    efficiency: string;
  };
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

// Thunk to fetch projects
export const fetchProjects = createAsyncThunk("portfolio/fetchProjects", async () => {
  const response = await axios.get("http://localhost:5001/api/portfolio/projects");
  return response.data as Project[];
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
export const selectLoading = (state: RootState) => state.portfolio.loading;

export default portfolioSlice.reducer;
