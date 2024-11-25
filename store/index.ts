"use client"
import React from 'react';
import RootStore from './root';

export const rootStore = new RootStore();

export const StoresContext = React.createContext(rootStore);

export const useStore = () => React.useContext(StoresContext);

// @ts-ignore
globalThis.store = rootStore;
