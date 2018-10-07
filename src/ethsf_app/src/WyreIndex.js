import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import {
  Container,
  Row,
  Col,
  Button,
  Input,
} from 'reactstrap';
import WyreVerification from 'wyre-react-library';

const WYRE_API_KEY = "AK-4AVZZ28X-XEDDD497-DWL2F7B2-TV4T6YCW"

const OurButton = (props) => {
  console.log("props: ", props)
  return (
    <Button {...props} variant="contained" color="primary">Open Wyre</Button>
  );
}
const myButton = OurButton

// WyreIndex
class WyreIndex extends Component {

  state = {
  }

  componentDidMount () {

  }

  render() {

    return(

      <Container className='home' style={{
        textAlign: 'center',
      }}>

        <WyreVerification myButton={myButton} apiKey="AK-4AVZZ28X-XEDDD497-DWL2F7B2-TV4T6YCW"/>

      </Container>

    )
  }
}

export default withRouter( connect(null, null)(WyreIndex) )
