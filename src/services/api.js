const SIGNUP_BASE_URL = 'http://localhost:9001'; // Your signup service URL

// SignUp API only - S3 operations handled by external uploader
export const signupApi = {
  registerUser: (userData) =>
    fetch(`${SIGNUP_BASE_URL}/signup/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    }).then(async (response) => {
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return response.json();
    }),
};

