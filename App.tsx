/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import { HueResponse, Lights, Light } from './android/app/src/models/Responses';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function needsLogin(hue: HueResponse): boolean {
  return hue.hasOwnProperty('success') && !!hue.success;
}

function lightsList(lights: Lights<Light>): Lights<Light> {
  return lights;
}

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const [bridgeIpAddr, onChangeText] = React.useState('Hello, world!');
  const isDarkMode = useColorScheme() === 'dark';
  const [hueUsername, setHueUsername] = React.useState('');
  const [allLights, setAllLights] = React.useState<Lights<Light>>({});

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the recommendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */
  const safePadding = '5%';

  fetch('https://discovery.meethue.com', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(response => {
    if(!response.ok) {
      throw new Error('Network error');
    }
    return response.json();
  }).then(json => {
    onChangeText(json[0].internalipaddress);
  });

  const onPressGetLights = () => {
    if (hueUsername.length > 0) {
      console.log(hueUsername);
      fetch('http://' + bridgeIpAddr + '/api/' + hueUsername + '/lights', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if(!response.ok) {
          throw new Error('Network error');
        }
        return response.json();
      })
      .then(json => {
        setAllLights(json);
        console.log(allLights[4]);
      });
    }
    else{
      console.log('no username');
    }
  };

  const onPressConnectHub = () => {
    fetch('http://' + bridgeIpAddr + '/api', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: '{"devicetype":"testing_hue_app#android testuser"}',
    }).then(response => {
      if(!response.ok) {
        throw new Error('Network error');
      }
      return response.json();
    })
    .then(json => {
      if (!needsLogin(json[0])) {
        throw new Error('PRESS LINK BUTTON');
      }
      setHueUsername(json[0].success.username);
      return json;
      }).catch(error => {
        console.error(error);
      });
      console.log(hueUsername);
    };

  // function setBridgeIpAddr(text: string): void {
  //   throw new Error('Function not implemented.');
  // }

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        style={backgroundStyle}>
        <View style={{paddingRight: safePadding}}>
          {/* <Header/> */}
        </View>
        <View
          style={{

            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            paddingHorizontal: safePadding,
            paddingBottom: safePadding,
          }}>
          <Section title="Philips Hue Control App">
            <Text>Bridge IP: {bridgeIpAddr}{'\n'}</Text>
            <Button
            onPress={onPressConnectHub}
            title="Connect"
            color="#841584"/>
            <Text>{'\n'}</Text>
            <Button
            onPress={onPressGetLights}
            title="Load Lights"
            color="#841584"/>
            <Text>{'\n'}</Text>
          </Section>
          <Section title="Lights">
            <View>{allLights.map(key, light) => (
              <Text key={key}>{light.name}</Text>
            )}</View>
          </Section>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: Colors.white,
  },
});

export default App;
