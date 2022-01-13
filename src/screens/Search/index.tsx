/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import BigList from 'react-native-big-list';
import {useNavigation} from '@react-navigation/native';
import {Colors} from 'utils/colors';
import FastImage from 'react-native-fast-image';
import {useTransitionEnd} from 'utils/hooks/useTransitionEnd';
import {useTranslation} from 'react-i18next';
import {Loader} from 'components/loader';
import {SmallButton} from 'components/smallButton';
import {styles} from './styles';
const coins = require('../../assets/tokens.json');

const SearchScreen = ({route}) => {
  const navigation = useNavigation();
  const [data, setData] = useState(coins);
  const [showScreen, setShowScreen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const transitionEnded = useTransitionEnd(navigation);

  const {t} = useTranslation();

  useEffect(() => {
    if (transitionEnded) {
      setTimeout(() => {
        setShowScreen(true);
      }, 200);
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

  const getData = () => {
    if (route.params.onlySupported) {
      return data.filter(item => {
        return item.supported === true;
      });
    }
    return data;
  };

  const renderFooter = () => {
    if (!route.params.onlySupported) {
      return null;
    } else {
      return (
        <View style={styles.footer}>
          <SmallButton
            text={t('search.add_asset')}
            onPress={() => navigation.navigate('CustomTokenScreen')}
            color={Colors.lighter}
            style={styles.customBtn}
          />
        </View>
      );
    }
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
        style={styles.item}>
        <FastImage
          style={styles.img}
          source={{
            uri: item.thumb,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
        <View style={styles.itemContent}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemSymbol} numberOfLines={1}>
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
          data={getData()}
          renderItem={renderItem}
          itemHeight={60}
          insetBottom={30}
          insetTop={10}
          keyboardDismissMode="on-drag"
          // batchSizeThreshold={1.5}
          showsVerticalScrollIndicator={false}
          footerHeight={150}
          ListFooterComponent={renderFooter}
        />
      );
    } else {
      return <Loader />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.search}
          // autoFocus
          autoCorrect={false}
          placeholderTextColor={'gray'}
          onChangeText={text => searchCoin(text)}
          placeholder={t('search.search_assets')}
        />

        <TouchableOpacity
          style={styles.close}
          onPress={() => navigation.goBack()}>
          <Text style={{color: Colors.foreground, fontWeight: 'bold'}}>
            {t('settings.cancel')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, marginHorizontal: 15}}>{renderList()}</View>
    </SafeAreaView>
  );
};

export default SearchScreen;
