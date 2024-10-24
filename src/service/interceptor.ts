// import LocalStorage from "./localstorage";

const logout = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!response.ok) {
    //: logout 실패시 에러 발생 catch 문으로 이동
    throw new Error("Failed to fetch logout.");
  }
  return response;
};

export const refreshAccessToken = async (baseUrl: string | undefined) => {
  try {
    //: 리프레시 토큰으로 액세스 토큰 발급 받기
    const response = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      //: 리프레시 토큰 만료됐음
      //: 로그아웃 시켜야한다.
      await logout();
      //: 로그아웃 되면 로그인 페이지로 돌아가기
      localStorage.removeItem("accessToken");
      location.replace(`${process.env.NEXT_PUBLIC_URL}/login`);
    } else {
      //: 리프레시 토큰은 만료가 되지 않아서 액세스 토큰을 재발급 받을 수 있음.
      const jsonData = await response.json();
      const accessToken = jsonData.data.access;
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    }
  } catch (error) {
    //: throw Error 받거나,
    //: 리프레시 토큰으로 액세스 토큰을 확인하던 와중 에러발생 처리
    await logout();
    localStorage.removeItem("accessToken");
    //: 무슨에러인지는 모르지만 일단 로그아웃하고 로그인 페이지로 이동
    console.error("토큰 갱신 중 오류 발생", "error");
    alert("오류 발생. 로그아웃 되었습니다");
    location.replace(`${process.env.NEXT_PUBLIC_URL}/login`);
    return null;
  }
};

const createApiClient = (baseUrl: string | undefined) => {
  let apiResponse: Response;
  const apiFetch = async (url: string, options = {}, headers = {}) => {
    try {
      const access = localStorage.getItem("accessToken");
      //: content type도 다를 수 있으니 header도 요청쪽에서 Authorization을 제외한 모든 설정을 전달
      const mergedOptions = {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${access}`,
        },
      };
      const response = await fetch(baseUrl + url, mergedOptions);
      apiResponse = response;
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
          //: 새 액세스 토큰으로 이전 api 다시 요청
          const response = await fetch(baseUrl + url, resetOptions);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          return { data, accessToken };
        } else {
          //: 에러코드가 401이 아니면 액세스 토큰 만료가 아닌 그냥 일반 에러
          throw new Error("Network response was not ok");
        }
      } else {
        //: 액세스 토큰 만료 아닌, 정상 api 호출
        const data = await response.json();
        return { data, accessToken: "null" };
      }
    } catch (error) {
      //: api 요청 중 오류 발생 throw Error 받는 곳
      console.error("API 요청 중 오류 발생:", error);
      if (url === "/api/post" && apiResponse.statusText === "Unauthorized") {
        throw apiResponse;
      }
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
