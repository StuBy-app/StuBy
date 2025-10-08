import { css } from "@emotion/react";

export const layout = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 66vh;
  background-color: #f5f6f8;
`;

export const container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1.5rem;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15), 0 2px 2px rgba(0, 0, 0, 0.15),
    0 4px 4px rgba(0, 0, 0, 0.15), 0 8px 8px rgba(0, 0, 0, 0.15);
  width: 35rem;
  height: 40rem;
  background-color: #ffffff;
`;

export const logo = css`
  margin-top: 4rem;
  height: 6.7rem;
`;

export const horizon = css`
  margin-top: 2rem;
  margin-bottom: 4rem;
  border: 0.1rem solid #f2f4f8;
  width: 26rem;
`;

export const snsLogin = css`
  & > a {
    display: flex;
    align-items: center;
    width: 22rem;
    height: 4rem;
    font-size: 2rem;
    font-weight: 900;
    text-decoration: none;
  }
  & > a > svg {
    margin-left: 5rem;
    margin-right: 2rem;
    font-size: 2.5rem;
  }
`;

export const googleLogin = css`
  border: 0.2rem solid #4285f4;
  border-radius: 1rem;
  color: #4285f4;

  &:hover {
    color: #ffffff;
    background-color: #4285f4;
  }
`;
 
export const naverLogin = css`
  border: 0.2rem solid #34a853;
  margin-top: 2rem;
  border-radius: 1rem;
  color: #34a853;

  &:hover {
    color: #ffffff;
    background-color: #34a853;
  }
`;

export const kakaoLogin = css`
  border: 0.2rem solid #ffc421;
  margin-top: 2rem;
  border-radius: 1rem;
  color: #ffc421;

  &:hover {
    color: #ffffff;
    background-color: #ffc421;
  }
`;