import React from 'react';
import './App.css';
import './App.scss';
import smallImg from './assets/imgs/5kb.png';
import bigImg from './assets/imgs/22kb.png';

function App() {
  return (
    <>
      <h2>react-ts-webpack5</h2>
      <img src={smallImg} alt="小于10kb的图片" />
      <img src={bigImg} alt="大于于10kb的图片" />
    </>
  );
}

export default App