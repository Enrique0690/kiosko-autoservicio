/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import { useConfig } from "@/components/contexts";
import { BackHandler } from "react-native";

export const Colors = {
  primary: '#07A338', 
  lightPrimary: '#59C96D', 
  darkPrimary: '#1A4425', 
  
  secondary: '#EED437', 
  lightSecondary: '#F3E581',
  darkSecondary: '#D1B12A', 

  text: '#000', 
  textsecondary: '#235931', 

  neutralWhite: '#F9F9F9', 
  neutralGray: '#D6D6D6', 
  darkGray: '#4A4A4A', 

  success: '#28A745', 
  warning: '#FFC107', 
  info: '#17A2B8', 
  error: '#FF0000', 
  disable: '#6C757D',
  overlay: 'rgba(0, 0, 0, 0.5)',

  background: '#FFF',
};

export const updateColors = (configColors: Partial<typeof Colors>) => {
  Object.assign(Colors, configColors);
};