import api from "./axios";

export const reqPrincipal = async () => await api.get("/api/account/principal");