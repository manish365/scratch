// Fake api call function to post data
export async function postData(url = '', data = {}) {
  console.log('api url===>>', url);
  
  const response = await fetch(url, {
    method: 'POST', 
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', 
    referrerPolicy: 'no-referrer', 
    body: JSON.stringify(data) 
  });
  return response.json();
}


/** Storage Service Starts */
export const UserDataStorageService = {
  saveUserData: (userData: object) => {
    sessionStorage.setItem('userData', JSON.stringify(userData));
  },

  getUserData: () => {
    const userDataString = sessionStorage.getItem('userData');
    return userDataString ? JSON.parse(userDataString) : null;
  },

  clearUserData: () => {
    sessionStorage.removeItem('userData');
  },
};
/** Storage Service Ends */

