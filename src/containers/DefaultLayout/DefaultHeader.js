import React, { Component } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import { AppHeaderDropdown } from '@coreui/react';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

const style = {
  backgroundColor: "blue"
}

class DefaultHeader extends Component {

  render() {

    let $address = null;
    if (this.props.address) {
      $address = (
        <p> {this.props.address}</p>
      )
    }

    return (
      <React.Fragment>
        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-4">
            <NavLink href="/" className="text-white">Home</NavLink>
          </NavItem>
          <NavItem className="px-4">
            <NavLink href="upload" className="text-white">Upload</NavLink>
          </NavItem>
          <NavItem className="px-4">
            <NavLink href="verify" className="text-white">Verify</NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-location-pin"></i></NavLink>
          </NavItem>
          <AppHeaderDropdown direction="down">
            {$address}
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
