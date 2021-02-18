import React, {createContext, useReducer} from 'react';
import { randomUuid } from './uuid.js'

const initialState = {
  boxes: [
      { name: 'Wall1', id: randomUuid(),
          position: { x: 0, y: 0, z: 0 },
          size: { width: .25, length: 12.043, height: 2.6 },
          rotation: 0,
          doors: [{position: 3.54, width: 1, height: 2}],
          windows: [{position: 6.54, width: 1, height: 1, elevation: 1}],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB'

      },
      { name: 'Wall2', id: randomUuid(), position: { x: 12.043, y: 0, z: 0 },
          size: { width: .25, length: 9.047, height: 2.6 },
          rotation: 90,
          doors: [],
          windows: [],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB'
      },
      { name: 'Wall3', id: randomUuid(), position: { x: 12.043, y: 9.047, z: 0 }, size: { width: .25, length: 12.043, height: 2.6 }, rotation: 180,
          doors: [],
          windows: [],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB' },
      { name: 'Wall4', id: randomUuid(), position: { x: 0, y: 9.047, z: 0 }, size: { width: .25, length: 9.047, height: 2.6 }, rotation: 270,
          doors: [],
          windows: [],
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
          doors: [],
          windows: [],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB' },

      { name: 'Wall8', id: randomUuid(), position: { x: 7.928, y: 0, z: 0 }, size: { width: .10, length: 4.577, height: 2.6 }, rotation: 90,
          doors: [],
          windows: [],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB' },
      { name: 'Wall9', id: randomUuid(), position: { x: 12.043, y: 4.577, z: 0 }, size: { width: .10, length: 6.649, height: 2.6 }, rotation: 180,
          doors: [],
          windows: [],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB' },

      { name: 'Wall10', id: randomUuid(), position: { x: 0, y: 6.41, z: 0 }, size: { width: .10, length: 3.625, height: 2.6 }, rotation: 0,
          doors: [],
          windows: [],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB' },
      { name: 'Wall11', id: randomUuid(), position: { x: 3.625, y: 6.41, z: 0 }, size: { width: .10, length: 2.261, height: 2.6 }, rotation: 90,
          doors: [],
          windows: [],
          interiorColor: '#F0EAD6',
          exteriorColor: '#EEB5EB' },

  ],
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
        newState.boxes[action.payload.index][action.payload.property][action.payload.dimension] = action.payload.value;
        return newState;
        case 'ADD_BOX':
            newState = { ...state, boxes: [ ...state.boxes, action.payload ]}
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
//       prevState.boxes[i] = box;
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
//     const { boxes } = this.state
//     const { updateBox } = this
// 
//     return (
//       <SceneContext.Provider
//         value={{
//           boxes,
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
