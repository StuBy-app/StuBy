import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuthLogin(props) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    if (!!accessToken) {
      localStorage.setItem("AccessToken", `Bearer ${accessToken}`);
      queryClient
        .invalidateQueries({
          queryKey: ["principal"],
        })
        .then(() => {
          navigate("/");
        });
    } else {
      navigate("/");
    }
  }, []);

  return <></>;
}

export default OAuthLogin;