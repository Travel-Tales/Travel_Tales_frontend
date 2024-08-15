import LocalStorage from "./localstorage";

export const refreshAccessToken = async (baseUrl: string | undefined) => {
  const response = await fetch(`${baseUrl}/api/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    //: 리프레시 토큰 만료
    alert("시간 만료! 다시 로그인 해주세요.");
    location.replace(`${process.env.NEXT_PUBLIC_API_URL}/login`);
  } else {
    const jsonData = await response.json();
    const accessToken = jsonData.data.access;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  }
};

const createApiClient = (baseUrl: string | undefined) => {
  //   const access = useStore((state) => state.accessToken);
  const apiFetch = async (url: string, options = {}, headers = {}) => {
    const access = LocalStorage.getItem("accessToken");
    //: content type도 다를 수 있으니 header도 요청쪽에서 Authorization을 제외한 모든 설정을 전달
    const mergedOptions = {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${access}`,
      },
    };
    const response = await fetch(baseUrl + url, mergedOptions);

    if (!response.ok) {
      //: 에러 공통 처리 (액세스 토큰 만료시 재발급 로직)
      if (response.status === 401 && access) {
        //: 액세스토큰 만료
        const accessToken = await refreshAccessToken(baseUrl);
        const resetOptions = {
          headers: {
            ...headers,
            Authorization: `Bearer ${accessToken}`,
          },
          ...options,
        };
        const response = await fetch(baseUrl + url, resetOptions);
        const data = await response.json();
        return { data, accessToken };
      } else {
        throw new Error("Network response was not ok");
      }
    } else {
      const data = await response.json();
      return { data, accessToken: "null" };
    }
  };

  return {
    //: options에는 header제외 모든 내용
    get: (url: string, options: any, headers: any) =>
      apiFetch(url, { ...options, method: "GET", cache: "no-store" }, headers),
    post: (url: string, options: any, headers: any) =>
      apiFetch(
        url,
        {
          ...options,
          method: "POST",
          cache: "no-store",
        },
        headers
      ),
    patch: (url: string, options: any, headers: any) =>
      apiFetch(
        url,
        {
          ...options,
          method: "PATCH",
          cache: "no-store",
        },
        headers
      ),
    delete: (url: string, options: any, headers: any) =>
      apiFetch(
        url,
        { ...options, method: "DELETE", cache: "no-store" },
        headers
      ),
  };
};

export const apiClient = createApiClient(process.env.NEXT_PUBLIC_API_URL);
//: return {get, post, patch, delete}
