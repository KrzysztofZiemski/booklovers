import React from "react";
import { Link } from "react-router-dom";
import { ButtonBasic } from "../../Button/Button";
import { deleteCookie } from "../../cookies/cookies";
import {
  Container,
  Menu
} from 'semantic-ui-react';

import "./header.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

const LoggedHeader = (props) => {
  const { loggedUser, setLoginUser,toggleMenu } = props;

  const logout = () => {
    deleteCookie("accessToken");
    setLoginUser(null);
  }

  // TODO: hamburger menu

  return (
    <Menu className="navbar">
      <button className="close" onClick={toggleMenu}><FontAwesomeIcon icon={faTimes} /></button>
      <Container>
        <Menu.Item as={Link} to={"/"} active className="logo">
          BookMates
        </Menu.Item>
        <Menu.Item as={Link} to={"/profile"}>
          profile
        </Menu.Item>
        <Menu.Item as={Link} to={"/dashboard"}>
          dashboard
        </Menu.Item>
        <Menu.Item as={Link} to={"/addbook"}>
          dodaj książkę
        </Menu.Item>
        <Menu.Item position='right'>
          <ButtonBasic content="Wyloguj" handleClick={logout} />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default LoggedHeader;