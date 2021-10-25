import styled from "styled-components";
import Button from "../Layout/Button";
import Sidebar from "../Sidebar";

interface Props {
  title: string;
  children: React.ReactNode;
  buttons?: React.ReactNode;
}

const Page: React.FC<Props> = ({ title, children, buttons }: Props) => {
  return (
    <Container>
      <Sidebar />
      <Main>
        <Header>
          <Title>{title}</Title>
          {buttons && <ButtonContainer>{buttons}</ButtonContainer>}
        </Header>
        <Content>{children}</Content>
      </Main>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100%;
`;

export const Main = styled.div`
  opacity: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
`;

export const Header = styled.header`
  display: flex;
  height: 50px;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.layout.lightest};
  padding: 0 15px;
  align-items: center;
`;

export const Title = styled.h1`
  font-weight: ${({ theme }) => theme.weight.bold};
`;

export const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
`;

export const ButtonContainer = styled.div`
  display: flex;
  ${Button} {
    margin: 0 5px;
    :first-child {
      margin-left: 0;
    }
    :last-child {
      margin-right: 0;
    }
  }
`;

export default Page;
