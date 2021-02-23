import React, {createContext, useReducer} from 'react';
import { randomUuid } from './uuid.js'

const initialState = {
    walls: [
      { name: 'Wall1', id: randomUuid(),
          position: { x: 0, y: 0, z: 0 },
          size: { width: .25, length: 12.043, height: 2.6 },
          rotation: 0,
          doors: [{position: 2.894, width: .9, height: 2.1}],
          windows: [{position: 1.005, width: .9, height: 1.2, elevation: .8},{position: 5.385, width: 1.6, height: .6, elevation: 1.4}],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB'

      },
      { name: 'Wall2', id: randomUuid(), position: { x: 12.043, y: 0, z: 0 },
          size: { width: .25, length: 9.047, height: 2.6 },
          rotation: 90,
          doors: [],
          windows: [{position: 2.499, width: .9, height: 2, elevation: .2},
              {position: 3.492, width: .9, height: 2, elevation: .2},
              {position: 5.841, width: .9, height: 2, elevation: .2},
              {position: 6.834, width: 1.6, height: 2, elevation: .2}],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB'
      },
      { name: 'Wall3', id: randomUuid(), position: { x: 12.043, y: 9.047, z: 0 }, size: { width: .25, length: 12.043, height: 2.6 }, rotation: 180,
          doors: [
              {position: 1.753, width: 3.304, height: 2}],
          windows: [
              {position: .527, width: .9, height: 2, elevation: .2},
              {position: 8.521, width: 3.091, height: .6, elevation: 1.4}],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB' },
      { name: 'Wall4', id: randomUuid(), position: { x: 0, y: 9.047, z: 0 }, size: { width: .25, length: 9.047, height: 2.6 }, rotation: 270,
          doors: [],
          windows: [
              {position: .433, width: 1.561, height: .6, elevation: 1.4},
              {position: 7.316, width: .9, height: 1.2, elevation: .8}],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB' },

      { name: 'Wall5', id: randomUuid(), position: { x: 2.462, y: 0, z: 0 }, size: { width: .10, length: 2.574, height: 2.6 }, rotation: 90,
          doors: [],
          windows: [],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB' },
      { name: 'Wall6', id: randomUuid(), position: { x: 4.280, y: 0, z: 0 }, size: { width: .10, length: 2.574, height: 2.6 }, rotation: 90,
          doors: [],
          windows: [],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB' },
      { name: 'Wall7', id: randomUuid(), position: { x: 7.928, y: 2.574, z: 0 }, size: { width: .10, length: 3.742, height: 2.6 }, rotation: 180,
          doors: [
              {position: 1.753, width: .98, height: 2.1}],
          windows: [],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB' },
        { name: 'Wall12', id: randomUuid(), position: { x: 7.928, y: 3.574, z: 0 }, size: { width: .10, length: 1.212, height: 2.6 }, rotation: 180,
            doors: [{position: .12, width: .75, height: 2.1}],
            windows: [],
            interiorColor: '#F0EAD6',
            exteriorColor: '#EEB5EB' },
        { name: 'Wall13', id: randomUuid(), position: { x: 6.716, y: 3.474, z: 0 }, size: { width: .10, length: 1.121, height: 2.6 }, rotation: 90,
            doors: [],
            windows: [],
            interiorColor: '#F0EAD6',
            exteriorColor: '#EEB5EB' },
      { name: 'Wall8', id: randomUuid(), position: { x: 7.928, y: 0, z: 0 }, size: { width: .10, length: 4.603, height: 2.6 }, rotation: 90,
          doors: [{position: 2.72, width: .8, height: 2.1}],
          windows: [],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB' },
      { name: 'Wall9', id: randomUuid(), position: { x: 12.043, y: 4.603, z: 0 }, size: { width: .10, length: 6.649, height: 2.6 }, rotation: 180,
          doors: [],
          windows: [],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB' },

      { name: 'Wall10', id: randomUuid(), position: { x: 0, y: 6.41, z: 0 }, size: { width: .10, length: 3.625, height: 2.6 }, rotation: 0,
          doors: [{position: 2.046, width: .8, height: 2.1}],
          windows: [],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB' },
      { name: 'Wall11', id: randomUuid(), position: { x: 3.625, y: 6.41, z: 0 }, size: { width: .10, length: 2.461, height: 2.6 }, rotation: 90,
          doors: [],
          windows: [],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB' },

  ],
    floors: [
        {   id: randomUuid(),
            edges: [
                {x: 0, y: 0}, {x: 12.043, y: 0}, {x: 12.043, y: 9.047}, {x: 0, y: 9.047}
            ],
            elevation: 1,
            color: '#00FF00'

        }
    ]
};
const store = createContext(initialState);
const { Provider } = store;

const SceneProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    let newState = {}
    switch(action.type) {
      case 'UPDATE_BOX':
          console.log("Updating " + action.payload.property + " " + action.payload.dimension + ": " + action.payload.value);
        newState = { ...state }
        newState.walls[action.payload.index][action.payload.property][action.payload.dimension] = action.payload.value;
        return newState;
        case 'ADD_BOX':
            newState = { ...state, walls: [ ...state.walls, action.payload ]}
            return newState;
        case 'SELECT_BOX':
            newState = { ...state, selected: action.payload }
            return newState;
      default:
        throw new Error();
    };
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, SceneProvider }

// const SceneContext = React.createContext()
// 
// class SceneProvider extends Component {
//   state = 
// 
//   updateBox = (i, box) => {
//     this.setState((prevState) => {
//       console.dir(box)
//       console.dir(prevState)
// 
//       prevState.walls[i] = box;
// 
// 
//       return {
//         ...prevState
//       }
//     })
//   }
// 
//   render() {
//     const { children } = this.props
//     const { walls } = this.state
//     const { updateBox } = this
// 
//     return (
//       <SceneContext.Provider
//         value={{
//           walls,
//           updateBox,
//         }}
//       >
//         {children}
//       </SceneContext.Provider>
//     )
//   }
// }
// 
// 
// 
// export default SceneContext
// 
// export { SceneProvider }
