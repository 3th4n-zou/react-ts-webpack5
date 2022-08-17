// import React from 'react';
// import './App.css';
// import './App.scss';
// import smallImg from './assets/imgs/5kb.png';
// import bigImg from './assets/imgs/22kb.png';

// function App() {
//   return (
//     <>
//       <h2>react-ts-webpack5</h2>
//       <img src={smallImg} alt="小于10kb的图片" />
//       <img src={bigImg} alt="大于于10kb的图片" />
//     </>
//   );
// }

// export default App

import React, { lazy, Suspense, useState } from 'react';
import smallImg from '@/assets/imgs/5kb.png';
import bigImg from '@/assets/imgs/22kb.png';
import '@/app.scss';
import { Demo1, Demo2 } from '@/components';

const LazyDemo = lazy(() => import('@/components/LazyDemo'))  // 使用import语法配合react的lazy动态引入资源

// prefetch
const PrefetchDemo = lazy(() => import(
  /* webpackChunkName: "PrefetchDemo" */
  /* webpackPrefetch: true */
  '@/components/PrefetchDemo'
))

// preload
const PreloadDemo = lazy(() => import(
  /* webpackChunkName: "PreloadDemo" */
  /* webpackPreload: true */
  '@/components/PreloadDemo'
))

function App() {
  const [ count, setCounts ] = useState('');
  const onChange = (e: any) => {
    setCounts(e.target.value)
  }

  const [ show, setShow ] = useState(false)
  const onClick = () => {
    import ('./app.css');
    setShow(true);
  }

  const [ showPreload, setShowPreload ] = useState(false);
  const onClickPreload = () => {
    setShowPreload(true);
  }

  return (
    <>
      <h2>react + ts + webpack5</h2>
      <Demo1 />
      <p>受控组件</p>
      <input type="text" value={count} onChange={onChange} />
      <br />
      <p>非受控组件</p>
      <input type="text" />
      <br />
      <div className="smallImg"></div>
      <div className="bigImg"></div>
      <h2 onClick={onClick}>展示资源懒加载</h2>
      {show && (
        <>
          <Suspense fallback={null}>
            <LazyDemo />
          </Suspense>
        </>
      )}
      <h2 onClick={onClickPreload}>展示资源预加载</h2>
      {showPreload && (
        <>
          <Suspense fallback={null}>
            <PreloadDemo />
          </Suspense>
          <Suspense fallback={null}>
            <PrefetchDemo />
          </Suspense>
        </>
      )}
    </>
  );
}

export default App;