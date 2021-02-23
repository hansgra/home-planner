import {Vector3} from "@babylonjs/core";

const toScenePosition = (wall) => {
    return new Vector3(
        wall.position.x,
        wall.position.z + (wall.size.height / 2),
        -wall.position.y
    )
}

const toShape = (wall) => {
    return [
        new Vector3(0, 0, 0),
        new Vector3(wall.size.length, 0, 0),
        new Vector3(wall.size.length, 0, wall.size.height),
        new Vector3(0, 0, wall.size.height)
    ]
}

const toBottom = (length, width) => {
    return [
        new Vector3(0, 0, 0),
        new Vector3(length, 0, 0),
        new Vector3(length, 0, width),
        new Vector3(0, 0,  width)
    ]
}

const toSide = (width, height) => {
    return [
        new Vector3(0, 0, 0),
        new Vector3(height, 0, 0),
        new Vector3(height, 0, width),
        new Vector3(0, 0,  width)
    ]
}

const toFloor = (edges) => {
    return edges.map(edge => new Vector3(edge.x, 0, edge.y))
}

const toHoles = (wall) => {
    return wall.doors.map(door => [
        new Vector3(door.position, 0, 0),
        new Vector3(door.position, 0, door.height),
        new Vector3(door.position + door.width, 0, door.height),
        new Vector3(door.position + door.width, 0, 0),
    ]).concat(
        wall.windows.map(window => [
            new Vector3(window.position, 0, window.elevation),
            new Vector3(window.position, 0, window.elevation + window.height),
            new Vector3(window.position + window.width, 0, window.elevation + window.height),
            new Vector3(window.position + window.width, 0, window.elevation)
        ])
    )
}

export { toShape, toScenePosition, toHoles, toBottom, toSide, toFloor }
