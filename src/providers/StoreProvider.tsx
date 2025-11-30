"use client";
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { hydrate } from '@/store/authSlice';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrate());
  }, []);
  return <Provider store={store}>{children}</Provider>;
}
