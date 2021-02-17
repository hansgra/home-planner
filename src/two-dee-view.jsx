import React, { useRef, useState, useContext } from 'react'
import { Stage, Layer, Rect, Text } from 'react-konva';
import {store} from "./scene-context";

export const KonvaScene = (props) => {
    const {state, dispatch } = useContext(store);

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <Text text="Try to drag a star" />
                {state.boxes.map((box, i) => (
                    <Rect
                        key={box.id}
                        id={box.id}
                        x={box.position.x * 50}
                        y={box.position.y * 50}
                        width={box.size.length * 50}
                        height={box.size.width * 50}
                        rotation={box.rotation}
                        fill="#9b9b9b"
                        stroke="#000000"
                        strokeWidth={1}
                        opacity={1}
                        draggable

                        onDragMove={e => {
                            dispatch({
                                type: 'UPDATE_BOX',
                                payload: {
                                    index: i,
                                    property: 'position',
                                    dimension: 'x',
                                    value: e.target.x() / 50
                                }
                            });

                            dispatch({
                                type: 'UPDATE_BOX',
                                payload: {
                                    index: i,
                                    property: 'position',
                                    dimension: 'y',
                                    value: e.target.y() / 50
                                }
                            });
                        }}

                        onDragEnd={e => {
                            dispatch({
                                type: 'UPDATE_BOX',
                                payload: {
                                    index: i,
                                    property: 'position',
                                    dimension: 'x',
                                    value: e.target.x() / 50
                                }
                            });

                            dispatch({
                                type: 'UPDATE_BOX',
                                payload: {
                                    index: i,
                                    property: 'position',
                                    dimension: 'y',
                                    value: e.target.y() / 50
                                }
                            });
                        }}
                    />
                ))}
            </Layer>
        </Stage>
    );
}
