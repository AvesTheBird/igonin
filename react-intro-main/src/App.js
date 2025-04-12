import React, { useState } from 'react';
import { YourComponent } from './components/GraphComponent'; // Исправлено на импорт по умолчанию
import VHDLEditorWithCompiler from './components/Editor';
import TextWatcher from './components/textwatcher';

function App() {
  
  // Stop error ResizeObserver
const debounce = (callback, delay) => {
  let tid;
  return function (...args) {
    const ctx = this;
    if (tid) clearTimeout(tid);
    tid = setTimeout(() => callback.apply(ctx, args), delay);
  };
};

const OriginalResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends OriginalResizeObserver {
  constructor(callback) {
    super(debounce(callback, 20)); // 20ms debounce
  }
};


  return (
    <>
      <VHDLEditorWithCompiler />
      <YourComponent/>

    </>
  );

  
}



export default App;