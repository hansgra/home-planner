import React, {useRef, useState, useContext, useEffect} from 'react'
import {Engine, Scene, useBeforeRender, useClick, useHover} from 'react-babylonjs'
import { Vector3, Color3 } from '@babylonjs/core'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import {store} from './scene-context';
import * as Earcut from 'earcut';
import './three-dee-view.css';
import {toHoles, toScenePosition, toShape} from "./wall-tools";

const GROUND_SIZE = 1000;

const DefaultScale = new Vector3(1, 1, 1);
const BiggerScale = new Vector3(1.25, 1.25, 1.25);

const OuterWall = (props) => {
    return (
        <babylon-polygon
            name={props.box.name}
            shape={toShape(props.box)}
            holes={toHoles(props.box)}
            sideOrientation= {Mesh.DOUBLESIDE}
            earcutInjection={Earcut}
        >
            <standardMaterial name={`${props.box.name}-mat`} diffuseColor={Color3.FromHexString(props.box.exteriorColor)}
                              specularColor={Color3.Black()}/>
        </babylon-polygon>
    )
}

const InnerWall = (props) => {
    return (
        <babylon-polygon
            name={props.box.name}
            shape={toShape(props.box)}
            holes={toHoles(props.box)}
            sideOrientation= {Mesh.DOUBLESIDE}
            position={new Vector3(0, props.box.size.width, 0)}
            earcutInjection={Earcut}
        >
            <standardMaterial name={`${props.box.name}-mat`} diffuseColor={Color3.FromHexString(props.box.interiorColor)}
                              specularColor={Color3.Black()}/>
        </babylon-polygon>
    )
}

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

    useBeforeRender((scene) => {

    });

    useEffect(() => {
        if (boxRef.current) {
            // boxRef.current.setPivotPoint(new Vector3(-(props.size.length / 2), 0, 0));
            // boxRef.current.rotation.y = props.rotation;
            // console.log("Pivot point set");
        }
    })

    const [hovered, setHovered] = useState(false);
    useHover(
        () => setHovered(true),
        () => setHovered(false),
        boxRef
    );

    const validateDrag = (targetPosition) => {
        props.dispatch({
            type: 'UPDATE_BOX',
            payload: {
                index: props.index,
                property: 'position',
                dimension: 'x',
                value: targetPosition.x - (props.box.size.length / 2)
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
                value: targetPosition.y - (props.box.size.height / 2)
            }
        })

        return Math.max(Math.abs(targetPosition.x), Math.abs(targetPosition.z)) <= (GROUND_SIZE / 2) - 10; // should be -15 for torus
    }

    return (
        <mesh
            ref={boxRef}
            position={toScenePosition(props.box)}
            rotation-x={-Math.PI / 2}
            rotation-y={props.box.rotation * Math.PI / 180}>
            <InnerWall box={props.box} />
            <OuterWall box={props.box} />
        </mesh>

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


    const boxes = state.boxes.map((box, i) =>
        <SpinningBox
            box={box}
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
                <pointLight name="Omni" position={new Vector3(20, 100, 5)} />
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
