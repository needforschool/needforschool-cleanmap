import styled from "styled-components";
import React from "react";
import SubMenu from "./SubMenu";
import { useLocation } from "react-router";
import ROUTES from "../../constants/routes";
import Link from "../Link";

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();

  const [isActive, setIsActive] = React.useState(false);
  const toggleSubMenu = () => setIsActive(!isActive);

  return (
    <Container>
      <Header href={ROUTES.MAP}>
        <Title>{"Unknow"}</Title>
      </Header>
      <Nav>
        <NavItem href={ROUTES.MAP} active={pathname == ROUTES.MAP}>
          <NavIcon className="ri-map-line" /> Map
        </NavItem>
        {/* <NavItem
          href={ROUTES.INBOX}
          active={pathname.includes(ROUTES.INBOX)}
        >
          <NavIcon className="ri-message-2-line" /> Inbox
        </NavItem> */}
      </Nav>
      <Footer>
        <FooterItem active={isActive} onClick={toggleSubMenu}>
          <SubMenu setIsActive={setIsActive} isActive={isActive} />
          <NavIcon className="ri-message-2-line" /> {"Feedback & Support"}
        </FooterItem>
      </Footer>
    </Container>
  );
};

const Container = styled.aside`
  display: flex;
  flex-direction: column;
  width: 228px;
  background-color: ${({ theme }) => theme.colors.layout.darker};
  border-right: 1px solid ${({ theme }) => theme.colors.layout.lightest};
`;

const Header = styled(Link)<{ active?: boolean }>`
  display: flex;
  height: 50px;
  align-items: center;
  padding-left: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.layout.lightest};
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  font-weight: ${({ theme }) => theme.weight.medium};
  align-items: center;
  :hover {
    background-color: ${({ theme }) => theme.colors.layout.dark};
  }
`;

const Title = styled.h1`
  white-space: nowrap;
  margin-left: 5px;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px 12px;
`;

const NavItem = styled(Link)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-top: 4px;
  border-radius: 4px;
  background-color: ${({ active, theme }) =>
    active && theme.colors.layout.dark};
  font-size: ${({ theme }) => theme.size.small};

  :hover {
    background-color: ${({ theme }) => theme.colors.layout.dark};
  }
`;

const NavIcon = styled.i`
  margin-right: 5px;
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.layout.light};
`;

const FooterItem = styled.div<{ active?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-top: 4px;
  border-radius: 4px;
  background-color: ${({ active, theme }) =>
    active && theme.colors.layout.dark};
  font-size: ${({ theme }) => theme.size.small};
  user-select: none;
`;

export default Sidebar;
