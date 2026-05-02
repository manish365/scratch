// Common GET Service
export const masterDataGetApiService = async (url: string, _data: any) => {
  // console.log('api url===>>', url);
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  return response.json();
};
