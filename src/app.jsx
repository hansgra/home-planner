import React from 'react';
import Board from './board';
import SceneContext, { SceneProvider } from './scene-context';
import ControlPanel from './control-panel';
import { SceneWithSpinningBoxes } from './three-dee-view';
import './index.css';

const App = (props) => {
  const boxes = {boxes: [
      { name: 'Box1', position: { x: -2, y: 0, z: 0 }, scale: { x: 1.0, y: .5, z: 2.0 } },
      { name: 'Box2', position: { x:  2, y: 0, z: 0 }, scale: { x:  .5, y: .5, z:  .5 } }
    ]};

  return (
    <SceneProvider>
    <div className="container">
      <div className="control-panel">
        <ControlPanel />
      </div>
      <div className="three-d-view">
        <SceneWithSpinningBoxes />
      </div>
    </div>
    </SceneProvider>
  )
}

export default App;