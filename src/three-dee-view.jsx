import React, {useRef, useState, useContext, useEffect} from 'react'
import {Engine, Scene, useBeforeRender, useClick, useHover} from 'react-babylonjs'
import { Vector3, Color3 } from '@babylonjs/core'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import {store} from './scene-context';
import * as Earcut from 'earcut';
import './three-dee-view.css';

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
            props.dispatch({type: 'SELECT_BOX', payload: props.id})
            console.log('hello');
        },
        boxRef
    );

    useEffect(() => {
        if (boxRef.current) {
            // boxRef.current.setPivotPoint(new Vector3(-(props.size.length / 2), 0, 0));
            boxRef.current.rotation.y = props.rotation;
            console.log("Pivot point set");
        }
    })

    const [hovered, setHovered] = useState(false);
    useHover(
        () => setHovered(true),
        () => setHovered(false),
        boxRef
    );

    // This will rotate the box on every Babylon frame.
    const rpm = 5;
    // useBeforeRender((scene) => {
    //   if (boxRef.current) {
    //     // Delta time smoothes the animation.
    //     var deltaTimeInMillis = scene.getEngine().getDeltaTime();
    //     boxRef.current.rotation.y += ((rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000));
    //   }
    // });

    const validateDrag = (targetPosition) => {
        props.dispatch({
            type: 'UPDATE_BOX',
            payload: {
                index: props.index,
                property: 'position',
                dimension: 'x',
                value: targetPosition.x - (props.size.length / 2)
            }
        })
        props.dispatch({
            type: 'UPDATE_BOX',
            payload: {
                index: props.index,
                property: 'position',
                dimension: 'y',
                value: -targetPosition.z
            }
        })
        props.dispatch({
            type: 'UPDATE_BOX',
            payload: {
                index: props.index,
                property: 'position',
                dimension: 'z',
                value: targetPosition.y - (props.size.height / 2)
            }
        })

        return Math.max(Math.abs(targetPosition.x), Math.abs(targetPosition.z)) <= (GROUND_SIZE / 2) - 10; // should be -15 for torus
    }

    return (
        <extrudePolygon
            name={props.name}
            ref={boxRef}
            shape={props.shape}
            holes={props.holes}
            depth={props.size.width}
            position={props.position}
            sideOrientation= {Mesh.DOUBLESIDE}
            earcutInjection={Earcut}
            rotation-x={-Math.PI / 2}
        >
            <standardMaterial name={`${props.name}-mat`} diffuseColor={hovered ? props.hoveredColor : props.color}
                specularColor={Color3.Black()}/>
            <pointerDragBehavior dragPlaneNormal={new Vector3(0, 1, 0)} validateDrag={validateDrag}/>
        </extrudePolygon>

    );


    // return (<box name={props.name} ref={boxRef} position={props.position}
    //              height={props.size.height} width={props.size.length} depth={props.size.width}>
    //         <standardMaterial name={`${props.name}-mat`} diffuseColor={hovered ? props.hoveredColor : props.color}
    //                           specularColor={Color3.Black()}/>
    //         <pointerDragBehavior dragPlaneNormal={new Vector3(0, 1, 0)} validateDrag={validateDrag}/>
    //     </box>
    // );
}

export const SceneWithSpinningBoxes = (props) => {
    const {state, dispatch} = useContext(store);

    const toScenePosition = (box) => {
        return new Vector3(
            box.position.x,
            box.position.z + (box.size.height / 2),
            -box.position.y
        )
    }

    const toShape = (box) => {
        return [
            new Vector3(0, 0, 0),
            new Vector3(box.size.length, 0, 0),
            new Vector3(box.size.length, 0, box.size.height),
            new Vector3(0, 0, box.size.height)
        ]
    }

    const toHoles = (box) => {
        return box.doors.map(door => [
            new Vector3(door.position, 0, 0),
            new Vector3(door.position, 0, door.height),
            new Vector3(door.position + door.width, 0, door.height),
            new Vector3(door.position + door.width, 0, 0),
        ]).concat(
            box.windows.map(window => [
                new Vector3(window.position, 0, window.elevation),
                new Vector3(window.position, 0, window.elevation + window.height),
                new Vector3(window.position + window.width, 0, window.elevation + window.height),
                new Vector3(window.position + window.width, 0, window.elevation)
            ])
        )
    }

    const boxes = state.boxes.map((box, i) =>
        <SpinningBox
            name={box.name}
            key={box.id}
            id={box.id}
            size={box.size}
            rotation={box.rotation * Math.PI / 180}
            position={toScenePosition(box)}
            color={Color3.FromHexString('#EEB5EB')}
            hoveredColor={Color3.FromHexString('#C26DBC')}
            shape={toShape(box)}
            holes={toHoles(box)}
            dispatch={dispatch}
            index={i}
        />
    )
    return (
        // <div className="babylon-canvas">
        <Engine antialias adaptToDeviceRatio canvasId='babylonJS'>
            <Scene>
                <arcRotateCamera name="camera1" target={new Vector3(4, 0, -3)} alpha={1.5 * Math.PI} beta={0}
                                 radius={8}/>
                <hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()}/>
                <ground name='ground' width={GROUND_SIZE} height={GROUND_SIZE} subdivisions={1}>
                    <standardMaterial name='groundMat' specularColor={Color3.Black()}/>
                </ground>
                {boxes}
                <lines name="z-axis" points={[new Vector3.Zero(), new Vector3(0, 0, 1)]}/>
            </Scene>
        </Engine>
        // </div>
    )
}
