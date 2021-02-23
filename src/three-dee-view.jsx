import React, {useRef, useState, useContext, useEffect} from 'react'
import {Engine, Scene, useBeforeRender, useClick, useHover } from 'react-babylonjs'
import {Vector3, Color3, ActionManager, SetValueAction} from '@babylonjs/core'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import {store} from './scene-context';
import * as Earcut from 'earcut';
import './three-dee-view.css';
import '@babylonjs/loaders';
import {toHoles, toScenePosition, toShape, toBottom, toSide, toFloor} from "./wall-tools";
import ScaledModelWithProgress from "./ScaledModelWithProgress";

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
            name={props.name}
            shape={toBottom(props.length, props.width)}
            sideOrientation= {Mesh.DOUBLESIDE}
            position={new Vector3(props.position, 0, props.elevation)}
            rotation-x={-Math.PI / 2}
            earcutInjection={Earcut}
        >
            <standardMaterial name={`${props.name}-mat`} diffuseColor={Color3.FromHexString(props.color)}
                              specularColor={Color3.Black()}/>
        </babylon-polygon>
    )
}

const WallSide = (props) => {
    return (
        <babylon-polygon
            name={props.name}
            shape={toSide(props.width, props.height)}
            sideOrientation= {Mesh.DOUBLESIDE}
            position={new Vector3(props.position, 0, props.elevation)}
            rotation-y={-Math.PI / 2}
            rotation-x={-Math.PI / 2}
            earcutInjection={Earcut}
        >
            <standardMaterial name={`${props.name}-mat`} diffuseColor={Color3.FromHexString(props.color)}
                              specularColor={Color3.Black()}/>
        </babylon-polygon>
    )
}

const Wall = (props) => {
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

    const windowSides = props.box.windows.map((window, i) =>
        <React.Fragment key={props.box.id + "-window-frame-" + i }>
            <WallTop name={props.box.id} width={props.box.size.width} length={window.width} elevation={window.elevation} position={window.position} color={props.box.interiorColor}/>
            <WallTop name={props.box.id} width={props.box.size.width} length={window.width} elevation={window.elevation + window.height} position={window.position} color={props.box.interiorColor}/>
            <WallSide name={props.box.id} width={props.box.size.width} height={window.height} elevation={window.elevation} position={window.position} color={props.box.interiorColor}/>
            <WallSide name={props.box.id} width={props.box.size.width} height={window.height} elevation={window.elevation} position={window.position + window.width} color={props.box.interiorColor}/>
        </React.Fragment>
    )

    const doorSides = props.box.doors.map((door, i) =>
        <React.Fragment key={props.box.id + "-door-frame-" + i }>
            <WallTop name={props.box.id} width={props.box.size.width} length={door.width} elevation={door.height} position={door.position} color={props.box.interiorColor}/>
            <WallSide name={props.box.id} width={props.box.size.width} height={door.height} elevation={0}  position={door.position} color={props.box.interiorColor}/>
            <WallSide name={props.box.id} width={props.box.size.width} height={door.height} elevation={0} position={door.position + door.width} color={props.box.interiorColor}/>
        </React.Fragment>
    )

    return (
        <mesh
            name={props.box.id + "-mesh"}
            ref={boxRef}
            position={toScenePosition(props.box)}
            rotation-x={-Math.PI / 2}
            rotation-y={props.box.rotation * Math.PI / 180}>
            <InnerWall box={props.box} />
            <OuterWall box={props.box} />
            <WallTop  name={props.box.id} width={props.box.size.width} position={0} elevation={0} length={props.box.size.length} color={props.box.interiorColor} />
            <WallTop  name={props.box.id} width={props.box.size.width} position={0} elevation={props.box.size.height} length={props.box.size.length}  color={props.box.interiorColor} />
            <WallSide name={props.box.id} width={props.box.size.width} height={props.box.size.height} elevation={0} position={0} color={props.box.interiorColor}/>
            <WallSide name={props.box.id} width={props.box.size.width} height={props.box.size.height} elevation={0} position={props.box.size.length} color={props.box.interiorColor}/>
            {windowSides}
            {doorSides}
        </mesh>
    )
}

const Floor = (props) => {
    return (
        <babylon-polygon
        name={props.name}
        shape={toFloor(props.floor.edges)}
        sideOrientation= {Mesh.DOUBLESIDE}
        rotation-x={ Math.PI }
        position={new Vector3(0, props.floor.elevation, 0)}
        earcutInjection={Earcut}
    >
        <standardMaterial name={`${props.name}-mat`} diffuseColor={Color3.FromHexString(props.floor.color)}
                          specularColor={Color3.Black()}/>
    </babylon-polygon>
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

    const walls = state.walls.map((box, i) =>
        <Wall
            box={box}
            dispatch={dispatch}
            index={i}
            key={box.id}
        />
    )

    const floors = state.floors.map((floor, i) =>
        <Floor
            floor={floor}
            dispatch={dispatch}
            index={i}
            key={floor.id}
        />
    )

    const onModelLoaded  = (model, sceneContext) => {
        // let mesh = model.meshes[1]
        // mesh.actionManager = new ActionManager(sceneContext.scene)
        // mesh.actionManager.registerAction(
        //     new SetValueAction(
        //         ActionManager.OnPointerOverTrigger,
        //         mesh.material,
        //         'wireframe',
        //         true
        //     )
        // )
        // mesh.actionManager.registerAction(
        //     new SetValueAction(
        //         ActionManager.OnPointerOutTrigger,
        //         mesh.material,
        //         'wireframe',
        //         false
        //     )
        // )
    }

    return (
        // <div className="babylon-canvas">
        <Engine antialias adaptToDeviceRatio canvasId='babylonJS' ref={engineRef} >
            <Scene>
                <arcRotateCamera name="camera1" target={new Vector3(4, 0, -3)} alpha={1.5 * Math.PI} beta={0}
                                 radius={16}/>
                <hemisphericLight name='light1' intensity={0.8} direction={Vector3.Up()}/>
                {/*<pointLight name="Omni" intensity={0.7} position={new Vector3(20, 100, 5)} />*/}
                <ground name='ground' width={GROUND_SIZE} height={GROUND_SIZE} subdivisions={1}>
                    <standardMaterial name='groundMat' specularColor={Color3.Black()}/>
                </ground>
                {walls}
                {floors}
                <ScaledModelWithProgress rootUrl={'/'} sceneFilename='lounge_chair_leather.obj' scaleTo={1}
                                         progressBarColor={Color3.FromInts(255, 165, 0)} center={new Vector3(4.5, 1.5, -8)}
                                         onModelLoaded={onModelLoaded}
                />
                <lines name="z-axis" points={[new Vector3.Zero(), new Vector3(0, 0, 1)]}/>
            </Scene>
        </Engine>
        // </div>
    )
}
