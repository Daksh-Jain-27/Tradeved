import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

// Define the shape of the decoded JWT payload
interface DecodedToken {
  id: string; // This is the user ID
  iat: number;
  exp: number;
}

const AuthService = {
  /**
   * Logs in with the provided user credentials.
   * @param email - The user's email.
   * @param password - The user's password.
   */
  login: async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string; data?: { token: string; userId: string } }> => {
    try {
      const response = await fetch("https://api.dev.tradeved.com/user/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.data?.token) {
        throw new Error(data.message || "Login failed");
      }

      const token = data.data.token;
      const decodedToken: DecodedToken = jwtDecode(token);

      if (!decodedToken.id) {
        throw new Error("Token is invalid: Missing user ID ('id') in payload.");
      }

      // Store in AsyncStorage
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userId', decodedToken.id);

      // Setup profile
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        };

        // Avatar Signature
        await fetch('http://94.136.190.104:3000/api/onboarding/avatar-signature', {
          method: 'POST',
          headers,
          body: JSON.stringify({ fileType: 'image/jpeg' }),
        });

        // Profile Setup
        await fetch('http://94.136.190.104:3000/api/onboarding/progress', {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            step: 'profileSetup',
            data: {
              bio: 'I am a new trader interested in learning.',
              location: 'New York, USA',
              website: 'https://my-portfolio.com',
              avatarUrl: 'https://www.spruson.com/app/uploads/2014/03/bigstock_Wah_Taj__760602.jpg',
            },
          }),
        });
      } catch (profileError) {
        console.error('Profile setup error:', profileError);
        // Continue even if profile setup fails
      }

      return {
        success: true,
        message: "Login successful!",
        data: {
          token,
          userId: decodedToken.id,
        },
      };
    } catch (error: any) {
      console.error("AuthService Login Error:", error);
      await AuthService.logout(); // Clean up on error
      return { success: false, message: error.message };
    }
  },

  /**
   * Removes user authentication data from AsyncStorage.
   */
  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userId');
  },

  /**
   * Retrieves the current user's ID if logged in.
   * @returns The user ID or null.
   */
  getCurrentUserId: async (): Promise<string | null> => {
    return await AsyncStorage.getItem('userId');
  },

  /**
   * Retrieves the stored JWT token if available.
   */
  getToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem('authToken');
  },
};

export default AuthService; 