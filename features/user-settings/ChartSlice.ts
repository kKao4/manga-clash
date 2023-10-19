import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { MangaType } from "@/models/manga";

export const initialChartState: {
  mangas: MangaType[];
  length: number;
  name: string;
  time: string;
  page: number;
} = {
  mangas: [],
  length: 0,
  name: "",
  time: "oneWeek",
  page: 1,
};

export const chartSlice = createSlice({
  name: "chart",
  initialState: initialChartState,
  reducers: {
    setMangasChart: (
      state,
      action: PayloadAction<Pick<typeof initialChartState, "mangas" | "length">>
    ) => {
      const { mangas, length } = action.payload;
      Object.assign(state, {
        mangas,
        length,
      });
    },
    setTimeChart: (
      state,
      action: PayloadAction<(typeof initialChartState)["time"]>
    ) => {
      state.time = action.payload;
    },
    setSearchName: (
      state,
      action: PayloadAction<(typeof initialChartState)["name"]>
    ) => {
      state.name = action.payload;
    },
    setPageChart: (
      state,
      action: PayloadAction<(typeof initialChartState)["page"]>
    ) => {
      state.page = action.payload;
    },
  },
});

export const { setMangasChart, setTimeChart, setSearchName, setPageChart } =
  chartSlice.actions;

export const selectChartState = (state: RootState) => state.chart;

export default chartSlice.reducer;
