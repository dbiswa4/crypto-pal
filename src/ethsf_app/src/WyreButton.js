import React from 'react';
import { Button } from 'reactstrap';

const WyreButton = (props) => {
  return (
    <Button {...props} variant="contained" color="primary">Open Wyre</Button>
  );
}
export default WyreButton
//
// export default (props) => {
//   return (
//     <Button color="danger">Danger!</Button>
//   );
// };
