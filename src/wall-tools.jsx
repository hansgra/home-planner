import {Vector3} from "@babylonjs/core";

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

const toWallBottom = (box) => {
    return [
        new Vector3(0, 0, 0),
        new Vector3(box.size.length, 0, 0),
        new Vector3(box.size.length, 0, box.size.width),
        new Vector3(0, 0,  box.size.width)
    ]
}

const toWallSide = (box) => {
    return [
        new Vector3(0, 0, 0),
        new Vector3(box.size.height, 0, 0),
        new Vector3(box.size.height, 0, box.size.width),
        new Vector3(0, 0,  box.size.width)
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

export { toShape, toScenePosition, toHoles, toWallBottom, toWallSide }
