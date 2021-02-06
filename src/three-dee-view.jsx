import React, { useRef, useState, useContext } from 'react'
import { Engine, Scene, useBeforeRender, useClick, useHover } from 'react-babylonjs'
import { Vector3, Color3 } from '@babylonjs/core'
import { store } from './scene-context';

const GROUND_SIZE = 1000;

const DefaultScale = new Vector3(1, 1, 1);
const BiggerScale = new Vector3(1.25, 1.25, 1.25);

const SpinningBox = (props) => {
  // access Babylon scene objects with same React hook as regular DOM elements
  const boxRef = useRef(null);

  const [clicked, setClicked] = useState(false);
  useClick(
    () => {
    	setClicked(clicked => !clicked);
    	console.log('hello');
    },
    boxRef
  );

  const [hovered, setHovered] = useState(false);
  useHover(
    () => setHovered(true),
    () => setHovered(false),
    boxRef
  );

  // This will rotate the box on every Babylon frame.
  const rpm = 5;
  useBeforeRender((scene) => {
    if (boxRef.current) {
      // Delta time smoothes the animation.
      var deltaTimeInMillis = scene.getEngine().getDeltaTime();
      boxRef.current.rotation.y += ((rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000));
    }
  });

  const validateDrag = (targetPosition) => {
    console.log(props.index + ': ' + targetPosition)

    props.dispatch({
        type: 'UPDATE_BOX',
        payload: {
          index: props.index,
          property: 'position',
          dimension: 'x',
          value: targetPosition.x
        }
    })
    props.dispatch({
      type: 'UPDATE_BOX',
      payload: {
        index: props.index,
        property: 'position',
        dimension: 'y',
        value: targetPosition.y
      }
    })
    props.dispatch({
      type: 'UPDATE_BOX',
      payload: {
        index: props.index,
        property: 'position',
        dimension: 'z',
        value: targetPosition.z
      }
    })

    return Math.max(Math.abs(targetPosition.x), Math.abs(targetPosition.z)) <= (GROUND_SIZE / 2) - 10; // should be -15 for torus
  }

  return (<box name={props.name} ref={boxRef} size={2} position={props.position} scaling={props.scale}>
    <standardMaterial name={`${props.name}-mat`} diffuseColor={hovered ? props.hoveredColor : props.color} specularColor={Color3.Black()} />
    <pointerDragBehavior dragPlaneNormal={new Vector3(0,1,0)} validateDrag={validateDrag} />
  </box>);
}

export const SceneWithSpinningBoxes = (props) => {
    const {state, dispatch } = useContext(store);

	const boxes = state.boxes.map((box, i) =>
        <SpinningBox
            name='{box.name}'
        	scale={new Vector3(box.scale.x, box.scale.y, box.scale.z)} 
        	position={new Vector3(box.position.x, box.position.y, box.position.z)}
            color={Color3.FromHexString('#EEB5EB')}
            hoveredColor={Color3.FromHexString('#C26DBC')}
            dispatch={dispatch}
            index={i}
        />
	)
	return (
  <div>
    <Engine antialias adaptToDeviceRatio canvasId='babylonJS' >
      <Scene>
        <arcRotateCamera name="camera1" target={Vector3.Zero()} alpha={Math.PI / 2} beta={Math.PI / 4} radius={8} />
        <hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()} />
        <ground name='ground' width={GROUND_SIZE} height={GROUND_SIZE} subdivisions={1}>
          <standardMaterial name='groundMat' specularColor={Color3.Black()} />
        </ground>
    	{boxes}
      </Scene>
    </Engine>
  </div>
)}