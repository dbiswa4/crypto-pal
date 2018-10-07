import {
  TEST_TEST
} from './Types'

export function setTest ({ params }) {

  return {
    type: TEST_TEST,
    params
  }
}
