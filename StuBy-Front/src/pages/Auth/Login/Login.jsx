import React from 'react';

function Login(props) {
    return (
        <div>
        <div css={s.layout}>
            <div css={s.container}>
            <div css={s.logo}>
                <img src={loginLogo} alt="" />
            </div>

            <div css={s.horizon}></div>

            <div css={s.snsLogin}>
                <a
                href={`${baseURL}/oauth2/authorization/google`}
                css={s.googleLogin}>
                <FaGoogle />
                Google
                </a>
                <a
                href={`${baseURL}/oauth2/authorization/naver`}
                css={s.naverLogin}>
                <SiNaver />
                Naver
                </a>
                <a
                href={`${baseURL}/oauth2/authorization/kakao`}
                css={s.kakaoLogin}>
                <RiKakaoTalkFill />
                Kakao
                </a>
            </div>
            </div>
        </div>
        <Footer />
        </div>
    );
}

export default Login;