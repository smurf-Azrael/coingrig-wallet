/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BigList from 'react-native-big-list';
import { useNavigation } from '@react-navigation/native';
import { Colors } from 'utils/colors';
import FastImage from 'react-native-fast-image';
import { TransitionEnd } from 'utils/hooks';
import { Loader } from 'components/loader';
const coins = require('../../assets/full_tokens.json');


const SearchScreen = ({ route }) => {
  const navigation = useNavigation();
  const [data, setData] = useState(coins);
  const [showScreen, setShowScreen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const transitionEnded = TransitionEnd(navigation);

  useEffect(() => {
    if (transitionEnded) {
      setShowScreen(true);
    }
  }, [transitionEnded]);

  const searchCoin = text => {
    let coinsList = data;
    if (text.length === 0) {
      setData(coins);
      return;
    }
    if (text.length < searchText.length) {
      coinsList = coins;
    }
    setSearchText(text);
    const newData = coinsList.filter(item => {
      const itemData = `${item.name.toUpperCase()}   
      ${item.symbol.toUpperCase()}`;

      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    setData(newData);
  };

  const renderItem = ({item}) => {
    if (route.params.onlySupported && !item.supported) {
      return null;
    }
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CoinDetailScreen', {
            coin: item.id,
            title: item.symbol,
            isSupported: item.supported,
          })
        }
        style={{
          flexDirection: 'row',
          flex: 1,
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.brick,
          paddingVertical: 10,
          alignItems: 'center',
        }}>
        <FastImage
          style={{
            width: 20,
            height: 20,
            marginRight: 0,
            justifyContent: 'center',
            alignSelf: 'center',
            marginVertical: 10,
          }}
          source={{
            uri: item.thumb,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              flex: 5,
              color: Colors.foreground,
              marginLeft: 10,
              fontSize: 17,
            }}
            numberOfLines={1}>
            {item.name}
          </Text>
          <Text
            style={{
              flex: 1,
              color: Colors.lighter,
              marginLeft: 10,
              fontSize: 13,
              textAlign: 'right',
            }}
            numberOfLines={1}>
            {item.symbol.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderList = () => {
    if (showScreen) {
      return (
        <BigList
          data={data}
          renderItem={renderItem}
          itemHeight={60}
          insetBottom={30}
          insetTop={10}
          showsVerticalScrollIndicator={false}
        />
      );
    } else {
      return <Loader />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 10,
          paddingBottom: 20,
          borderBottomColor: Colors.brick,
          borderBottomWidth: 1,
          paddingHorizontal: 15,
        }}>
        <TextInput
          style={{
            flex: 4,
            fontSize: 16,
            borderWidth: 1,
            borderColor: Colors.brick,
            backgroundColor: Colors.card,
            paddingHorizontal: 10,
            height: 40,
            borderRadius: 5,
            color: Colors.foreground,
          }}
          // autoFocus
          autoCorrect={false}
          placeholderTextColor={'gray'}
          onChangeText={text => searchCoin(text)}
          placeholder={'Coin Search'}
        />

        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => navigation.goBack()}>
          <Text style={{ color: Colors.foreground }}>Close</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, marginHorizontal: 15 }}>{renderList()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
  },
});

export default SearchScreen;
