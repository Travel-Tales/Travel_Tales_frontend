import LocalStorage from "./localstorage";

export const refreshAccessToken = async (baseUrl: string | undefined) => {
  try {
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
  } catch (error) {
    console.error("토큰 갱신 중 오류 발생", "error");
    alert("오류가 발생했습니다. 다시 시도해 주세요.");
    location.replace(`${process.env.NEXT_PUBLIC_API_URL}/login`);
    return null;
  }
};

const createApiClient = (baseUrl: string | undefined) => {
  //   const access = useStore((state) => state.accessToken);
  const apiFetch = async (url: string, options = {}, headers = {}) => {
    try {
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
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
      throw error; // 필요에 따라 호출자에게 오류를 다시 던질 수 있음
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
