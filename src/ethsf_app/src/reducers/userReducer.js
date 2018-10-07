import {
  TEST_TEST
} from '../actions/Types'

function user (state = {}, action) {

  switch (action.type) {

    case TEST_TEST :

      const { test } = action.params
      return {
        ...state,
        test: test,
      }
      
    default :
      return state
  }
}

export default user
