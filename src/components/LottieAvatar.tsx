import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import LottieView from 'lottie-react-native';

type Props = {
  source: any;
  style?: object;
};

export default function LottieAvatar({ source, style }: Props) {
  const [LottieView, setLottieView] = useState<any>(null);

  // useEffect(() => {
  //   if (Platform.OS === 'web') {
  //     // 👇 importación dinámica protegida por entorno
  //     import('lottie-react').then((module) => {
  //       setLottieView(() => module.default);
  //     });
  //   }
  // }, []);

  //if (!LottieView) return null;

  return (
    <LottieView
      //animationData={source}
      source={require('../../assets/lottie/avatar.json')}
      loop
      autoplay
      style={style}
    />
  );
}
