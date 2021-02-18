import React, {useRef, useState, useContext, useEffect} from 'react'
import {Engine, Scene, useBeforeRender, useClick, useHover} from 'react-babylonjs'
import { Vector3, Color3 } from '@babylonjs/core'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import {store} from './scene-context';
import * as Earcut from 'earcut';
import './three-dee-view.css';
import {toHoles, toScenePosition, toShape, toWallBottom, toWallSide} from "./wall-tools";

const GROUND_SIZE = 1000;

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

const WallTop = (props) => {
    return (
        <babylon-polygon
            name={props.box.name}
            shape={toWallBottom(props.box)}
            sideOrientation= {Mesh.DOUBLESIDE}
            position={new Vector3(0, 0, props.box.size.height)}
            rotation-x={-Math.PI / 2}
            earcutInjection={Earcut}
        >
            <standardMaterial name={`${props.box.name}-mat`} diffuseColor={Color3.FromHexString(props.box.interiorColor)}
                              specularColor={Color3.Black()}/>
        </babylon-polygon>
    )
}

const WallBottom = (props) => {
    return (
        <babylon-polygon
            name={props.box.name}
            shape={toWallBottom(props.box)}
            holes={[]}
            sideOrientation= {Mesh.DOUBLESIDE}
            rotation-x={-Math.PI / 2}
            earcutInjection={Earcut}
        >
            <standardMaterial name={`${props.box.name}-mat`} diffuseColor={Color3.FromHexString(props.box.interiorColor)}
                              specularColor={Color3.Black()}/>
        </babylon-polygon>
    )
}

const WallSideLeft = (props) => {
    return (
        <babylon-polygon
            name={props.box.name}
            shape={toWallSide(props.box)}
            sideOrientation= {Mesh.DOUBLESIDE}
            position={new Vector3(0, 0, 0)}
            rotation-y={-Math.PI / 2}
            rotation-x={-Math.PI / 2}
            earcutInjection={Earcut}
        >
            <standardMaterial name={`${props.box.name}-mat`} diffuseColor={Color3.Green()}
                              specularColor={Color3.Black()}/>
        </babylon-polygon>
    )
}

const WallSideRight = (props) => {
    return (
        <babylon-polygon
            name={props.box.name}
            shape={toWallSide(props.box)}
            sideOrientation= {Mesh.DOUBLESIDE}
            position={new Vector3(props.box.size.length, 0, 0)}
            rotation-y={-Math.PI / 2}
            rotation-x={-Math.PI / 2}
            earcutInjection={Earcut}
        >
            <standardMaterial name={`${props.box.name}-mat`} diffuseColor={Color3.Green()}
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
            name={props.box.id + "-mesh"}
            ref={boxRef}
            position={toScenePosition(props.box)}
            rotation-x={-Math.PI / 2}
            rotation-y={props.box.rotation * Math.PI / 180}>
            <InnerWall box={props.box} />
            <OuterWall box={props.box} />
            <WallTop box={props.box} />
            <WallBottom box={props.box} />
            <WallSideLeft box={props.box} />
            <WallSideRight box={props.box} />
        </mesh>
    )
}

export const SceneWithSpinningBoxes = (props) => {
    const {state, dispatch} = useContext(store);

    const engineRef = useRef(null);

    useEffect(() => {
        if (engineRef.current) {
            const resize = () => {
                engineRef.current.engine.resize();
            };
            if (window) {
                window.addEventListener("resize", resize);
            }
        }
    })

    const boxes = state.boxes.map((box, i) =>
        <SpinningBox
            box={box}
            dispatch={dispatch}
            index={i}
            key={box.id}
        />
    )

    return (
        // <div className="babylon-canvas">
        <Engine antialias adaptToDeviceRatio canvasId='babylonJS' ref={engineRef} >
            <Scene>
                <arcRotateCamera name="camera1" target={new Vector3(4, 0, -3)} alpha={1.5 * Math.PI} beta={0}
                                 radius={16}/>
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
