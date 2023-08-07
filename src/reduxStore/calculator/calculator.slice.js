import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import {
  getIngredients,
  extendElementByUid,
  collapseElementByUid,
  collapseElementsById,
  getRecipeCategory,
  getAllUids,
  switchMachines,
  switchMachine,
  bumpProdModules,
} from "../../utils/helperFunctions";

const initialState = {
  output: {},
  machines: {
    crafting: {
      id: "assembling-machine-1",
      craftingSpeed: 0.5,
      modules: [],
      beacons: {
        affecting: 0,
        additional: 0,
        constant: 0,
        modules: ["", ""],
      },
    },
    "basic-crafting": {
      id: "assembling-machine-1",
      craftingSpeed: 0.5,
      modules: [],
      beacons: {
        affecting: 0,
        additional: 0,
        constant: 0,
        modules: ["", ""],
      },
    },
    "advanced-crafting": {
      id: "assembling-machine-1",
      craftingSpeed: 0.5,
      modules: [],
      beacons: {
        affecting: 0,
        additional: 0,
        constant: 0,
        modules: ["", ""],
      },
    },
    "crafting-with-fluid": {
      id: "assembling-machine-2",
      craftingSpeed: 0.75,
      modules: ["", ""],
      beacons: {
        affecting: 0,
        additional: 0,
        constant: 0,
        modules: ["", ""],
      },
    },
    smelting: {
      id: "stone-furnace",
      craftingSpeed: 1,
      modules: [],
      beacons: {
        affecting: 0,
        additional: 0,
        constant: 0,
        modules: ["", ""],
      },
    },
    "oil-processing": {
      id: "oil-refinery",
      craftingSpeed: 1,
      modules: ["", "", ""],
      beacons: {
        affecting: 0,
        additional: 0,
        constant: 0,
        modules: ["", ""],
      },
    },
    chemistry: {
      id: "chemical-plant",
      craftingSpeed: 1,
      modules: ["", "", ""],
      beacons: {
        affecting: 0,
        additional: 0,
        constant: 0,
        modules: ["", ""],
      },
    },
    centrifuging: {
      id: "centrifuge",
      craftingSpeed: 1,
      modules: ["", ""],
      beacons: {
        affecting: 0,
        additional: 0,
        constant: 0,
        modules: ["", ""],
      },
    },
    "rocket-building": {
      id: "rocket-silo",
      craftingSpeed: 1,
      modules: ["", "", "", ""],
      beacons: {
        affecting: 0,
        additional: 0,
        constant: 0,
        modules: ["", ""],
      },
    },
  },
};

export const calculatorSlice = createSlice({
  name: "calculator",
  initialState,
  reducers: {
    addToOutput: (state, { payload }) => {
      const { id, amount, recipe } = payload;
      const recipeCategory = getRecipeCategory(recipe);
      state.output[id] = {
        id: id,
        uid: uuidv4(),
        amount: amount,
        recipe: recipe,
        ingredients: getIngredients(recipe),
        machine: { ...state.machines[recipeCategory], uid: uuidv4() },
      };
    },
    addToExistingOutput: ({ output }, { payload }) => {
      const { id, amount } = payload;
      output[id].amount += amount;
    },
    removeFromOutput: ({ output }, { payload }) => {
      delete output[payload];
    },
    modifyOutputElement: ({ output }, { payload }) => {
      const { id, amount } = payload;
      output[id] = {
        ...output[id],
        amount: amount,
      };
    },
    resetOutput: (state) => {
      state.output = {};
    },
    extendElement: (state, { payload }) => {
      const { uid, recipe } = payload;
      const machine = state.machines[getRecipeCategory(recipe)];
      Object.keys(state.output).forEach((item) => {
        extendElementByUid(state.output[item], uid, recipe, machine);
      });
    },
    extendSameTypeElements: (state, { payload }) => {
      const { id, recipe } = payload;
      const machine = state.machines[getRecipeCategory(recipe)];
      const uids = getAllUids(Object.values(state.output), id);
      uids.forEach((uid) => {
        Object.keys(state.output).forEach((key) => {
          extendElementByUid(state.output[key], uid, recipe, machine);
        });
      });
    },
    collapseElement: ({ output }, { payload }) => {
      const uid = payload;
      Object.keys(output).forEach((key) => {
        collapseElementByUid(output[key], uid);
      });
    },
    collapseSameTypeElements: ({ output }, { payload }) => {
      const id = payload;
      Object.keys(output).forEach((key) => {
        collapseElementsById(output[key], id);
      });
    },
    swapMachines: ({ output }, { payload }) => {
      const { update, machineConfig } = payload;
      Object.keys(output).forEach((key) => {
        switchMachines(output[key], machineConfig, update);
      });
    },
    swapMachine: ({ output }, { payload }) => {
      const { uid, pid, machineConfig } = payload;
      switchMachine(output[pid], machineConfig, uid);
    },
    bumpModules: ({ output }, { payload }) => {
      Object.keys(output).forEach((key) => {
        bumpProdModules(output[key], payload);
      });
    },
    saveDefaultMachineConfig: ({ machines }, { payload }) => {
      const { categories, machineConfig } = payload;
      categories.forEach((category) => {
        machines[category] = machineConfig;
      });
    },
  },
});

export const {
  addToOutput,
  addToExistingOutput,
  removeFromOutput,
  modifyOutputElement,
  resetOutput,
  extendElement,
  extendSameTypeElements,
  collapseElement,
  collapseSameTypeElements,
  saveDefaultMachineConfig,
  swapMachines,
  swapMachine,
  bumpModules,
} = calculatorSlice.actions;

export default calculatorSlice.reducer;
