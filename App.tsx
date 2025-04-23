/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Tts from 'react-native-tts';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LottieAvatar from './src/components/LottieAvatar';
import avatarAnimation from './src/assetes/lottie/animation-chatbot-1.json';

//import Icon from 'react-native-vector-icons/Ionicons';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

/*Parámetros de Configuración */
// const title = 'Upecito';
// const subTitle = 'Chatbot UPC Seccional Aguachica';
const trackColorTrue = '#FFF'; //'#00c896'
const trackColorFalse = '#FFF';

const colors = {
  verdeUpecito: '#6dc12a',
  azulRustica: '#d40d2b',
};

// const color = colors.verdeUpecito;

type Message = {
  id: string;
  text: string;
  from: 'user' | 'bot';
};

const congiguracion = [
  {
    title: 'Upecito',
    subTitle: 'Chatbot UPC Seccional Aguachica',
    color: colors.verdeUpecito,
  },
  {
    title: 'Rustica',
    subTitle: 'Pizzeria Gourmet',
    color: colors.azulRustica,
  },
];

const {title, subTitle, color} = congiguracion[0];

export default function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const inputRef = useRef<TextInput>(null);
  const flatListRef = useRef<FlatList>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [hablando, setHablando] = useState(false);
  const [vozActiva, setVozActiva] = useState(true);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      from: 'user',
    };
    setMessages(prev => [...prev, userMessage]);

    setInput('');

    try {
      console.log({input});
      //const path = "https://fastapi-upecito.onrender.com/finetune"
      const res = await axios.post('http://192.168.1.5:3000/chat', {
        message: input,
      });

      console.log(res.data);
      var respuesta = res?.data?.reply;

      //const respuesta = "Estos son algunos de los sabores"
      if (respuesta && respuesta.length > 0) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: respuesta,
          from: 'bot',
        };

        setMessages(prev => [...prev, botMessage]);

        //✅ Scroll automático al final después de que se agregue el mensaje
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({animated: true});
        }, 100);

        '4. Vegetariana – Con pimentón, champiñones, cebolla, maíz y aceitunas, sobre una base de salsa artesanal.\n' +
          '5. Hawaiana – Jamón y piña en perfecta armonía sobre queso mozzarella.\n' +
          '6. Mixta Especial – Pepperoni, salchicha, jamón, tocineta y vegetales frescos.\n' +
          '7. Rústica Suprema – Nuestra receta exclusiva con carne molida, pollo, vegetales y salsa especial de la casa.\n\n' +
          '📍 ¿Cuál se te antoja hoy? Puedes hacer tu pedido escribiéndonos por WhatsApp al 3187336796 o visitándonos en la Calle 6 #18-36, Aguachica, Cesar.';

        if (vozActiva) {
          setHablando(true);

          Tts.stop(); // Por si ya estaba hablando
          Tts.speak(respuesta);
          inputRef.current?.focus();
          //✅ Reproducir voz del bot
          // Speech.stop().then(() => {
          //   Speech.speak(respuesta, {
          //     language: 'es-Es',
          //     pitch: 1,
          //     rate: 1,
          //     onDone: () => {
          //       setHablando(false);
          //       inputRef.current?.focus(); // ✅ Recupera el foco después de hablar
          //     },
          //     onError: err => {
          //       setHablando(false);
          //       console.error('Error en Speech.speak:', err);
          //     },
          //   });
          // });
        } else {
          inputRef.current?.focus();
        }
      } else {
        console.warn('❌ No se recibió texto del backend.');
      }
    } catch (error) {
      const botError: Message = {
        id: (Date.now() + 2).toString(),
        text: '⚠️ Error al conectar con el servidor',
        from: 'bot',
      };
      setMessages(prev => [...prev, botError]);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);

      console.error(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: true});
    }, 200); // da tiempo al render

    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    // Configura el idioma en español (puedes usar "es-US" o "es-ES")
    Tts.setDefaultLanguage('es-ES');
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);
  }, []);

  useEffect(() => {
    const mensajeInicial =
      'Hola, soy Upecito, el asistente virtual de la Universidad Popular del Cesar, Seccional Aguachica. Estoy aquí para ayudarte. Puedes escribirme o hablarme por audio.';
    //const mensajeInicial =
    ('Hola, soy Rustibot, el asistente virtual de Rústica Pizza Gourmet. Estoy aquí para ayudarte a vivir una experiencia deliciosa. Puedes escribirme o hablarme por audio para hacer pedidos, consultar el menú o conocer nuestras promociones. ¡No se necesita tanto para ser feliz, solo una buena pizza!');

    const mensaje: Message = {
      id: Date.now().toString(),
      text: mensajeInicial,
      from: 'bot',
    };

    setMessages([mensaje]);
    inputRef.current?.focus();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
      <View style={styles.header}>
        <Ionicons name="chatbubbles" size={40} color="#FFF" />

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subTitle}</Text>
        </View>
        <View style={{marginLeft: 'auto', alignItems: 'center'}}>
          <Text style={{color: '#fff', fontSize: 12, marginBottom: 2}}>
            Voz
          </Text>
          <Switch
            value={vozActiva}
            onValueChange={value => setVozActiva(value)}
            thumbColor={vozActiva ? '#fff' : '#ccc'}
            trackColor={{false: '#fff', true: trackColorTrue}}
          />
        </View>
      </View>

      {/* Mensajes + Input */}
      <View style={{flex: 1}}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View
              style={[
                styles.messageBubble,
                item.from === 'user' ? styles.userBubble : styles.botBubble,
              ]}>
              <Text
                style={[
                  styles.messageText,
                  item.from === 'user' ? styles.userText : styles.botText,
                ]}>
                {item.text}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.messageList}
          keyboardShouldPersistTaps="handled"
        />

        {hablando && (
          <LottieAvatar
            source={avatarAnimation}
            style={{width: 50, height: 50}}
          />
        )}

        {/* Input al final */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Escribe un mensaje..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={
              input.trim()
                ? handleSend
                : () => console.log('🎤 iniciar grabación')
            }
            style={styles.sendButton}>
            {/* <Ionicons
              name={input.trim() ? 'send' : 'mic'}
              size={22}
              color="white"
            /> */}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5ddd5',
  },
  messageList: {
    padding: 10,
    paddingBottom: 20,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 4,
    maxWidth: '75%',
  },
  userBubble: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  userText: {
    color: '#000',
  },
  botText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    //backgroundColor: '#e5ddd5', //#FFF
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    fontFamily: 'Poppins_400Regular',
  },
  sendButton: {
    backgroundColor: color,
    borderRadius: 25,
    padding: 10,
    marginLeft: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: color,
    fontFamily: 'Poppins_600SemiBold',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 4,
  },

  headerTextContainer: {
    marginLeft: 15,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'Poppins_400Regular',
  },
});

//export default App;
