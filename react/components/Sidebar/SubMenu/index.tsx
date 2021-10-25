import React from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

interface Props {
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const SubMenu: React.FC<Props> = ({ isActive, setIsActive }: Props) => {
  const router = useHistory();
  const elRef = React.useRef<HTMLDivElement>(null);

  const handleClick = (link: string) => {
    const internal = /^\/(?!\/)/.test(link);

    if (internal) router.push(link);
    else window.open(link, "_blank");
    setIsActive(false);
  };

  React.useEffect(() => {
    const onClick = (e: any) => {
      // If the active element exists and is clicked outside of
      if (elRef.current !== null && !elRef.current.contains(e.target)) {
        setIsActive(!isActive);
      }
    };

    // If the item is active (ie open) then listen for clicks outside
    if (isActive) {
      window.addEventListener("click", onClick);
    }

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, [setIsActive, isActive, elRef]);

  if (isActive)
    return (
      <Wrapper ref={elRef}>
        <Container>
          <NavItem
            onClick={() =>
              handleClick(
                "https://github.com/needforschool/needforschool-cleanmap"
              )
            }
          >
            GitHub
          </NavItem>
          <Separator />
          <NavItem onClick={() => handleClick("https://discord.gg/5P3pP5VKX6")}>
            Help
          </NavItem>
        </Container>
      </Wrapper>
    );

  return <div />;
};

const Wrapper = styled.div`
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.layout.dark};
  border-radius: 4px;
  padding: 8px 0;
`;

const NavItem = styled.button`
  outline: none;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  font-size: ${({ theme }) => theme.size.small};

  :hover {
    background-color: ${({ theme }) => theme.colors.layout.lightest};
  }
`;

const Separator = styled.hr`
  display: block;
  margin: 8px 0;
  height: 1px;
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.layout.lightest};
`;

export default SubMenu;
