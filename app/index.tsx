import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // Using 375 as base width (iPhone standard)

// Function to calculate responsive sizes
const normalize = (size: number) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(newSize);
  }
  return Math.round(newSize);
};

const LoginSignupScreen = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email: string; password: string }>({ email: '', password: '' });
  const colorScheme = useColorScheme();

  const router = useRouter();

  const handleLogin = async () => {
    const newErrors = {
      email: email.trim() === '' ? 'Email is required!' : '',
      password: password.trim() === '' ? 'Password is required!' : '',
    };
  
    setErrors(newErrors);
  
    const hasErrors = Object.values(newErrors).some((err) => err !== '');
    if (hasErrors) return;
  
    try {
      const response = await fetch('https://api.dev.tradeved.com/user/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Login failed!');
        return;
      }
  
      // Store token
       await AsyncStorage.setItem('authToken', data.data.token);  
      // Redirect to onboarding
      router.replace('/onboarding');
  
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  const handleSignup = async () => {
    const newErrors = {
      name: name.trim() === '' ? 'Name is required!' : '',
      email: email.trim() === '' ? 'Email is required!' : '',
      password: password.trim() === '' ? 'Password is required!' : '',
    };
  
    setErrors(newErrors);
  
    const hasErrors = Object.values(newErrors).some((err) => err !== '');
    if (hasErrors) return;
  
    try {
      const response = await fetch('https://api.dev.tradeved.com/user/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Signup failed!');
        return;
      }
  
      // ✅ Store token
      // const token = await AsyncStorage.setItem('authToken', data.token); // or data.accessToken depending on API response
      // console.log(token);
  
      // Redirect to onboarding
      // router.replace('/onboarding');
  
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, colorScheme === 'dark' && styles.containerDark]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentContainer}>
            <Image
              source={require('../assets/images/TradeVed LOGO.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={[styles.title, colorScheme === 'dark' && styles.textLight]}>
              {isLogin ? 'Welcome Back!' : 'Connect with us'}
            </Text>
            <Text style={[styles.subtitle, colorScheme === 'dark' && styles.textGray]}>
              {isLogin 
                ? 'Enter your credentials to continue your trading journey.'
                : 'Enter your credentials to get started with your trading journey.'}
            </Text>

            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={[
                  styles.socialButton,
                  colorScheme === 'dark' && styles.buttonDark
                ]}
              >
                <View style={styles.socialButtonContent}>
                  <Image
                    source={require('../assets/images/google.png')}
                    style={styles.sociallogo}
                    resizeMode="contain"
                  />
                  <Text style={[styles.socialtext, colorScheme === 'dark' && styles.textLight]}>
                    {isLogin ? 'Log in with Google' : 'Sign up with Google'}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.socialButton,
                  colorScheme === 'dark' && styles.buttonDark
                ]}
              >
                <View style={styles.socialButtonContent}>
                  <Image
                    source={require('../assets/images/facebook.png')}
                    style={styles.sociallogo}
                    resizeMode="contain"
                  />
                  <Text style={[styles.socialtext, colorScheme === 'dark' && styles.textLight]}>
                    {isLogin ? 'Log in with Facebook' : 'Sign up with Facebook'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              {!isLogin && (
                <>
                  <Text style={[styles.label, colorScheme === 'dark' && styles.textLight]}>Name*</Text>
                  <TextInput
                    style={[styles.input, colorScheme === 'dark' && styles.inputDark]}
                    placeholder="Eg: John Doe"
                    placeholderTextColor={colorScheme === 'dark' ? '#888' : '#999'}
                    value={name}
                    onChangeText={(text) => {
                      setName(text);
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                  />
                  {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
                </>
              )}

              <Text style={[styles.label, colorScheme === 'dark' && styles.textLight]}>Email*</Text>
              <TextInput
                style={[styles.input, colorScheme === 'dark' && styles.inputDark]}
                placeholder="Eg: xyz@email.com"
                placeholderTextColor={colorScheme === 'dark' ? '#888' : '#999'}
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

              <Text style={[styles.label, colorScheme === 'dark' && styles.textLight]}>Password*</Text>
              <View style={[styles.passwordContainer, colorScheme === 'dark' && styles.inputDark]}>
                <TextInput
                  style={[styles.passwordInput, colorScheme === 'dark' && styles.textLight]}
                  placeholder="Eg: xxxxxx"
                  placeholderTextColor={colorScheme === 'dark' ? '#888' : '#999'}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Icon
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={normalize(20)}
                    color={colorScheme === 'dark' ? '#fff' : '#888'}
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

              <TouchableOpacity style={styles.forgotContainer}>
                <Text style={styles.forgotText}>Forgot Password ?</Text>
              </TouchableOpacity>

              {!isLogin && (
                <View style={styles.checkboxContainer}>
                  <Checkbox 
                    value={agree} 
                    onValueChange={setAgree}
                    color={agree ? '#9BEC00' : undefined}
                  />
                  <Text style={[styles.checkboxText, colorScheme === 'dark' && styles.textLight]}>
                    I agree to the <Text style={[styles.link, colorScheme === 'dark' && styles.textLight]}>Terms and Policy</Text>
                  </Text>
                </View>
              )}

              <TouchableOpacity 
                style={[
                  styles.loginButton,
                  !isLogin && !agree && styles.disabledButton
                ]} 
                onPress={isLogin ? handleLogin : handleSignup}
                disabled={!isLogin && !agree}
              >
                <Text style={[
                  styles.loginButtonText,
                  !isLogin && !agree && styles.disabledButtonText
                ]}>
                  {isLogin ? 'Login' : 'Signup'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.switchModeContainer}
                onPress={() => setIsLogin(!isLogin)}
              >
                <Text style={[styles.switchModeText, colorScheme === 'dark' && styles.textLight]}>
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginSignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#242620',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.05, // 5% of screen width
    paddingVertical: SCREEN_HEIGHT * 0.03, // 3% of screen height
    width: '100%',
    maxWidth: 500, // Maximum width for larger screens
    alignSelf: 'center',
  },
  logo: {
    width: normalize(164),
    height: normalize(118),
    alignSelf: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  title: {
    fontSize: normalize(20),
    fontWeight: '800',
    marginBottom: normalize(5),
    color: '#000',
  },
  subtitle: {
    fontSize: normalize(14),
    color: '#7a7a7a',
    marginBottom: SCREEN_HEIGHT * 0.02,
    lineHeight: normalize(16.8),
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: normalize(25),
    marginBottom: SCREEN_HEIGHT * 0.025,
  },
  socialButton: {
    minWidth: normalize(100),
    height: normalize(44),
    borderWidth: 1,
    borderColor: '#242621',
    borderRadius: normalize(5),
    backgroundColor: '#fff',
    paddingHorizontal: normalize(4),
  },
  socialButtonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: normalize(8),
  },
  buttonDark: {
    backgroundColor: '#2c2e27',
    borderColor: '#3b3b3b',
  },
  sociallogo: {
    width: normalize(20),
    height: normalize(25),
  },
  socialtext: {
    fontSize: normalize(12),
    fontWeight: '600',
    color: '#000',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: normalize(14),
    fontWeight: '700',
    marginBottom: normalize(8),
    color: '#000',
  },
  input: {
    width: '100%',
    height: normalize(44),
    backgroundColor: '#f7faf5',
    borderRadius: normalize(8),
    padding: normalize(12),
    marginBottom: normalize(15),
    color: '#000',
    fontSize: normalize(14),
  },
  errorText: {
    color: '#ff4d4d',
    marginBottom: normalize(5),
    marginLeft: normalize(10),
    fontSize: normalize(14),
    marginTop: normalize(-10),
  },
  passwordContainer: {
    width: '100%',
    height: normalize(44),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7faf5',
    borderRadius: normalize(5),
    paddingHorizontal: normalize(12),
    marginBottom: normalize(10),
  },
  passwordInput: {
    flex: 1,
    paddingVertical: normalize(12),
    color: '#000',
    fontSize: normalize(14),
  },
  inputDark: {
    backgroundColor: '#2c2e27',
    color: '#fff',
  },
  textLight: {
    color: '#fff',
  },
  textGray: {
    color: '#a2ab9a',
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  forgotText: {
    color: '#2f8eff',
    fontWeight: '400',
    fontSize: normalize(14),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
    gap: normalize(10),
  },
  checkboxText: {
    marginLeft: normalize(5),
    color: '#000',
    fontSize: normalize(14),
  },
  link: {
    fontWeight: 'bold',
    color: '#000',
  },
  loginButton: {
    width: '100%',
    height: normalize(52),
    backgroundColor: '#9bec00',
    padding: normalize(15),
    borderRadius: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontWeight: 'bold',
    fontSize: normalize(16),
    color: '#242620',
  },
  switchModeContainer: {
    marginTop: normalize(15),
    alignItems: 'center',
  },
  switchModeText: {
    color: '#2f8eff',
    fontSize: normalize(14),
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  disabledButtonText: {
    color: '#666666',
  },
});
