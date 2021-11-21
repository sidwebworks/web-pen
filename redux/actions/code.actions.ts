import { createAction } from "@reduxjs/toolkit";

export const UPDATE_EDITOR =
	createAction<{ type: string; code: string }>("CODE.UPDATE_EDITOR");

export const UPDATE_BUNDLE = createAction<string>("CODE.UPDATE_BUNDLE");

export const UPDATE_ERROR = createAction<string | null>("CODE.UPDATE_ERROR");

export const SWITCH_FILE = createAction<string | null>("CODE.SWITCH_FILE");

export const ADD_LOG = createAction<any | null>("LOGS.ADD_NEW");

export const CLEAR_LOGS = createAction<any | null>("LOGS.CLEAR_LOGS");

export const BUNDLER_LOADED = createAction("CODE.BUNDLER_LOADED");
