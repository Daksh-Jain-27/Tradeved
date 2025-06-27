import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { CountryCode, countryCodes } from '../../constants/CountryCodes';

type PersonalInfo = {
  fullName: string;
  phoneNumber: string;
  countryCode: string;
  dateOfBirth: Date | null;
  address: string;
  document: {
    name: string;
    uri: string;
  } | null;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function ProfileScreen() {
  const [isPersonalInfoSaved, setIsPersonalInfoSaved] = useState(false);
  const [isOneTimeInfoSaved, setIsOneTimeInfoSaved] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    phoneNumber: '',
    countryCode: '+91',
    dateOfBirth: null,
    address: '',
    document: null,
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPersonalInfo(prev => ({ ...prev, dateOfBirth: selectedDate }));
    }
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true
      });

      if (!result.canceled) {
        const document = result.assets[0];
        setPersonalInfo(prev => ({
          ...prev,
          document: {
            name: document.name,
            uri: document.uri
          }
        }));
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const handleSave = (section: 'personal' | 'onetime') => {
    setPasswordError('');
    if (section === 'personal' || section === 'onetime') {
      if (personalInfo.password !== personalInfo.confirmPassword) {
        setPasswordError('Passwords do not match');
        Alert.alert('Error', 'Password and Confirm Password do not match.');
        return;
      }
    }
    if (section === 'personal') {
      setIsPersonalInfoSaved(true);
    } else {
      setIsOneTimeInfoSaved(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Profile Card */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(tabs)/Quest')}
          >
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.profileCard}>
            <Image
              source={require('../../assets/images/profile.png')}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileId}>12345i</Text>
              <Text style={styles.profileName}>Swati Patidar</Text>
              <Text style={styles.profileusername}>@swati125</Text>
              <Text style={styles.profileDate}>DOB: 11/11/1994</Text>
            </View>
            <TouchableOpacity style={styles.essentialBtn}>
              <Text style={styles.essentialText}>• Essential</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <Text style={styles.sectionSubText}>*This section can be edited anytime</Text>
              </View>
              {!isPersonalInfoSaved ? (
                <TouchableOpacity 
                  style={styles.saveBtn} 
                  onPress={() => handleSave('personal')}
                >
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.editBtn}
                  onPress={() => setIsPersonalInfoSaved(false)}
                >
                  <Text style={styles.saveBtnText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>
            {!isPersonalInfoSaved ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full name*</Text>
                  <TextInput
                    style={styles.input}
                    value={personalInfo.fullName}
                    onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, fullName: text }))}
                    placeholder="Eg. John Doe"
                    placeholderTextColor="#696969"
                  />
                </View>
                
                <Text style={styles.inputLabel}>Phone number</Text>
                <View style={styles.inputGroupRow}>
                  <View style={styles.countryCodeBox}>
                    <DropDownPicker
                      open={dropdownOpen}
                      value={personalInfo.countryCode}
                      items={countryCodes.map((country: CountryCode) => ({
                        label: `${country.flag} ${country.code} ${country.name}`,
                        value: country.code
                      }))}
                      setOpen={setDropdownOpen}
                      setValue={(callback: (value: string) => string) => {
                        const newValue = callback(personalInfo.countryCode);
                        setPersonalInfo(prev => ({ ...prev, countryCode: newValue }));
                      }}
                      containerStyle={styles.dropdownContainer}
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownList}
                      textStyle={styles.dropdownText}
                      maxHeight={200}
                      searchable={true}
                      searchPlaceholder="Search..."
                      listMode="MODAL"
                      modalProps={{
                        animationType: "slide"
                      }}
                      modalContentContainerStyle={{
                        backgroundColor: '#242620'
                      }}
                      modalTitle="Select Country Code"
                      modalTitleStyle={{
                        color: '#fff',
                        fontWeight: 'bold'
                      }}
                    />
                  </View>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={personalInfo.phoneNumber}
                    onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, phoneNumber: text }))}
                    placeholder="Eg. 623469782"
                    placeholderTextColor="#696969"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Date of Birth</Text>
                  <View style={styles.inputWithIcon}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      value={personalInfo.dateOfBirth?.toLocaleDateString() || ''}
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor="#696969"
                      editable={false}
                    />
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                      <Ionicons name="calendar-clear-outline" size={20} color="#a2aba9" style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                  </View>
                  {showDatePicker && (
                    <DateTimePicker
                      value={personalInfo.dateOfBirth || new Date()}
                      mode="date"
                      onChange={handleDateChange}
                    />
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Address</Text>
                  <TextInput
                    style={styles.input}
                    value={personalInfo.address}
                    onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, address: text }))}
                    placeholder="Eg. ABC Street 1"
                    placeholderTextColor="#696969"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Upload Document</Text>
                  <View style={styles.inputWithIcon}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      value={personalInfo.document?.name || ''}
                      placeholder="Upload docs/pdf/images"
                      placeholderTextColor="#696969"
                      editable={false}
                    />
                    <TouchableOpacity onPress={handleDocumentPick}>
                      <Ionicons name="cloud-upload-outline" size={20} color="#a2aba9" style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.fieldLabel}>Full name*</Text>
                <Text style={styles.fieldValue}>{personalInfo.fullName}</Text>

                <Text style={styles.fieldLabel}>Phone number</Text>
                <Text style={styles.fieldValue}>{personalInfo.countryCode} {personalInfo.phoneNumber}</Text>

                <Text style={styles.fieldLabel}>Date of Birth</Text>
                <Text style={styles.fieldValue}>{personalInfo.dateOfBirth?.toLocaleDateString()}</Text>

                <Text style={styles.fieldLabel}>Address</Text>
                <Text style={styles.fieldValue}>{personalInfo.address}</Text>

                <Text style={styles.fieldLabel}>Upload Document</Text>
                <Text style={[styles.fieldValue, styles.documentLink]}>{personalInfo.document?.name}</Text>
              </>
            )}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <View style={styles.warningRow}>
                  <Ionicons name="warning" size={18} color="#e6e600" style={{ marginRight: 6 }} />
                  <Text style={styles.warningText}>One time editable information</Text>
                </View>
                <Text style={styles.sectionSubText}>This Section can be edited only once and will be unique only to you.</Text>
              </View>
              {!isOneTimeInfoSaved && (
                <TouchableOpacity 
                  style={styles.saveBtn}
                  onPress={() => handleSave('onetime')}
                >
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              )}
            </View>
            {!isOneTimeInfoSaved ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Username*</Text>
                  <TextInput
                    style={styles.input}
                    value={personalInfo.username}
                    onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, username: text }))}
                    placeholder="@username"
                    placeholderTextColor="#696969"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email*</Text>
                  <TextInput
                    style={styles.input}
                    value={personalInfo.email}
                    onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, email: text }))}
                    placeholder="email@example.com"
                    placeholderTextColor="#696969"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password*</Text>
                  <View style={styles.inputWithIcon}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      value={personalInfo.password}
                      onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, password: text }))}
                      placeholder="Enter password"
                      placeholderTextColor="#696969"
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#a2aba9"
                        style={{ marginRight: 10 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirm Password*</Text>
                  <View style={styles.inputWithIcon}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      value={personalInfo.confirmPassword}
                      onChangeText={(text) => setPersonalInfo(prev => ({ ...prev, confirmPassword: text }))}
                      placeholder="Confirm password"
                      placeholderTextColor="#696969"
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <Ionicons
                        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#a2aba9"
                        style={{ marginRight: 10 }}
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>
              </>
            ) : (
              <>
                <Text style={styles.fieldLabel}>Username*</Text>
                <Text style={styles.fieldValue}>{personalInfo.username}</Text>

                <Text style={styles.fieldLabel}>Email*</Text>
                <Text style={styles.fieldValue}>{personalInfo.email}</Text>

                <Text style={styles.fieldLabel}>Password*</Text>
                <Text style={styles.fieldValue}>{personalInfo.password.length > 0 ? '•'.repeat(personalInfo.password.length) : ''}</Text>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242620',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    paddingTop: 50,
    alignItems: 'center',
  },
  backButton: {
    left: -150,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2e27',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 18,
    width: 350,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileId: {
    color: '#2f8eff',
    fontWeight: '400',
    fontSize: 11,
  },
  profileName: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 13,
    marginTop: 2,
  },
  profileusername: {
    color: '#a2aba9',
    fontWeight: '400',
    fontSize: 10,
  },
  profileDate: {
    color: '#a2aba9',
    fontSize: 11,
    marginTop: 6,
  },
  essentialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: 8,
  },
  essentialText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13,
  },
  sectionCard: {
    backgroundColor: '#2c2e27',
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    width: 350,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionSubText: {
    color: '#73786c',
    fontSize: 10,
    marginBottom: 10,
    marginTop: 4,
    maxWidth: 200,
  },
  saveBtn: {
    backgroundColor: '#9BEC00',
    borderRadius: 6,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  editBtn: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  saveBtnText: {
    color: '#23241f',
    fontWeight: 'bold',
    fontSize: 15,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 11,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#383b31',
    borderRadius: 4,
    color: '#fff',
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3e4138',
    borderRadius: 4,
    marginBottom: 0,
  },
  countryCodeBox: {
    width: 140,
    marginRight: 10,
    zIndex: 1000,
  },
  dropdownContainer: {
    width: '100%',
  },
  dropdown: {
    backgroundColor: '#3e4138',
    borderColor: '#333',
    borderRadius: 8,
    minHeight: 45,
  },
  dropdownList: {
    backgroundColor: '#3e4138',
    borderColor: '#333',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: 'relative',
  },
  dropdownText: {
    color: '#FFF',
    fontSize: 14,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#a2aba9',
    marginTop: 16,
  },
  fieldValue: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 4,
  },
  documentLink: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 12,
    marginTop: 4,
  },
}); 