/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';
import {useTranslation} from 'react-i18next';
import Svg, {Path} from 'react-native-svg';
import {WalletStore} from 'stores/wallet';
import {formatPrice} from 'utils';
import FastImage from 'react-native-fast-image';
import {styles} from './styles';
import {CryptoService} from 'services/crypto';
import {Colors} from 'utils/colors';
import {showMessage} from 'react-native-flash-message';
import {SettingsStore} from 'stores/settings';
import endpoints from 'utils/endpoints';

const WalletScreen = observer(({route}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.symbol,
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          {WalletStore.getWalletByCoinId(
            route.params.symbol,
            route.params.chain,
          )?.price === 0 ? null : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CoinDetailScreen', {
                  coin: route.params.coin,
                  chain: route.params.chain,
                  title: route.params.symbol,
                });
              }}
              style={styles.moreBtn}>
              <Icon name="stats-chart" size={20} color={Colors.foreground} />
            </TouchableOpacity>
          )}
          {WalletStore.getWalletByCoinId(
            route.params.symbol,
            route.params.chain,
          )?.type === 'token' ? null : (
            <TouchableOpacity
              onPress={() => showTransactions()}
              style={styles.moreBtn}>
              <Icon
                name="list-circle-outline"
                size={28}
                color={Colors.foreground}
              />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, []);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     setTimeout(() => {
  //       CryptoService.updateWalletBalance(
  //         route.params.symbol,
  //         route.params.chain,
  //       );
  //     }, 2000);
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBalance();
  }, []);
  const fetchBalance = useCallback(async () => {
    const success = await CryptoService.updateWalletBalance(
      route.params.symbol,
      route.params.chain,
    );
    if (!success) {
      showMessage({
        message: t('message.error.remote_servers_not_available'),
        type: 'warning',
      });
    }
    setRefreshing(false);
  }, []);

  const openLink = async url => {
    try {
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'automatic',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
        });
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteWallet = async () => {
    Alert.alert(t('wallet.delete_wallet'), t('wallet.alert_delete_wallet'), [
      {
        text: t('settings.cancel'),
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: t('settings.yes'),
        onPress: async () => {
          const w = WalletStore.getWalletByCoinId(
            route.params.symbol,
            route.params.chain,
          );
          console.log();
          const wIndex = WalletStore.wallets.indexOf(w!);
          if (wIndex) {
            WalletStore.deleteWallet(wIndex);
            navigation.goBack();
          }
        },
      },
    ]);
  };
  const showTransactions = () => {
    const w = WalletStore.getWalletByCoinId(
      route.params.symbol,
      route.params.chain,
    );
    openLink(CryptoService.getBlockExplorer(w?.chain!));
  };

  const buySellAction = () => {
    const w = WalletStore.getWalletByCoinId(
      route.params.symbol,
      route.params.chain,
    );
    const address = WalletStore.getWalletAddressByChain(w?.chain!);
    let coin = route.params.symbol.toUpperCase();
    const link =
      endpoints.ramper + '&userAddress=' + address + '&swapAsset=' + coin;
    openLink(link);
  };

  const renderUnconfirmedTx = () => {
    const unconfTxValue = WalletStore.getWalletByCoinId(
      route.params.symbol,
      route.params.chain,
    )?.unconfirmedBalance;
    if (SettingsStore.confirmationEnabled && unconfTxValue !== 0) {
      return (
        <View style={styles.smallCard}>
          <Text style={styles.unconfTxt}>{t('wallet.unconfirmed_tx')}</Text>
          <Text
            style={[
              styles.unconfValue,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                color: unconfTxValue! > 0 ? '#5cb85c' : '#d9534f',
              },
            ]}>
            {unconfTxValue || 0} {route.params.symbol}
          </Text>
        </View>
      );
    }
  };

  const buyOrTx = () => {
    if (
      WalletStore.getWalletByCoinId(route.params.symbol, route.params.chain)
        ?.type === 'token'
    ) {
      return (
        <>
          <TouchableOpacity
            onPress={() => showTransactions()}
            style={styles.roundBtn}>
            <Icon name="list" size={20} color={Colors.background} />
          </TouchableOpacity>
          <Text style={styles.roundb}>{t('wallet.transactions')}</Text>
        </>
      );
    } else {
      return (
        <>
          <TouchableOpacity
            onPress={() => buySellAction()}
            style={styles.roundBtn}>
            <Icon2 name="dollar-sign" size={20} color={Colors.background} />
          </TouchableOpacity>
          <Text style={styles.roundb}>{t('wallet.buysell')}</Text>
        </>
      );
    }
  };

  const screen = () => {
    const wallet = WalletStore.getWalletByCoinId(
      route.params.symbol,
      route.params.chain,
    );
    return (
      <View style={{flexGrow: 1}}>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.lighter}
              colors={[Colors.lighter]}
            />
          }>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={styles.pills}>
              <Text style={{fontSize: 12, color: Colors.lighter}}>
                {t('coindetails.price') +
                  ': ' +
                  formatPrice(
                    WalletStore.getWalletByCoinId(
                      route.params.symbol,
                      route.params.chain,
                    )?.price,
                  )}
              </Text>
            </View>
            <View style={styles.pills}>
              <Text style={{fontSize: 12, color: Colors.lighter}}>
                {CryptoService.getSupportedChainNamebyID(
                  WalletStore.getWalletByCoinId(
                    route.params.symbol,
                    route.params.chain,
                  )?.chain,
                ) +
                  ' ' +
                  t('wallet.network')}
              </Text>
            </View>
          </View>

          <Text adjustsFontSizeToFit numberOfLines={1} style={styles.bigText}>
            {formatPrice(
              WalletStore.getWalletByCoinId(
                route.params.symbol,
                route.params.chain,
              )?.value ?? 0,
              true,
            ) || 0}
          </Text>
          <Text style={styles.coins}>
            {WalletStore.getWalletByCoinId(
              route.params.symbol,
              route.params.chain,
            )?.balance || 0}{' '}
            {route.params.symbol}
          </Text>
          <View style={styles.btnCointainers}>
            <View style={{marginHorizontal: 15}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SendReceiveScreen', {
                    coin: route.params.symbol,
                    chain: route.params.chain,
                    name: wallet?.name,
                    receive: false,
                  })
                }
                style={styles.roundBtn}>
                <Icon name="arrow-up" size={20} color={Colors.background} />
              </TouchableOpacity>
              <Text style={styles.roundb}>{t('wallet.send')}</Text>
            </View>
            <View style={{marginHorizontal: 15}}>{buyOrTx()}</View>
            <View style={{marginHorizontal: 15}}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SendReceiveScreen', {
                    coin: route.params.symbol,
                    chain: route.params.chain,
                    name: wallet?.name,
                    receive: true,
                  })
                }
                style={styles.roundBtn}>
                <Icon name="arrow-down" size={20} color={Colors.background} />
              </TouchableOpacity>
              <Text style={styles.roundb}>{t('wallet.receive')}</Text>
            </View>
          </View>
          {renderUnconfirmedTx()}
        </ScrollView>
        <FastImage
          style={styles.logoimg}
          source={{
            uri: wallet?.image!,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
        <Svg
          viewBox="0 0 400 150"
          preserveAspectRatio="none"
          style={styles.svg}>
          <Path
            d="M0 49.98c149.99 100.02 349.2-99.96 500 0V150H0z"
            fill={Colors.darker}
          />
        </Svg>
        {WalletStore.getWalletByCoinId(route.params.symbol, route.params.chain)
          ?.type !== 'token' ? null : (
          <View style={{right: 20, bottom: 40, position: 'absolute'}}>
            <TouchableOpacity
              onPress={() => deleteWallet()}
              style={styles.deleteBtn}>
              <Icon name="trash" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return screen();
});

export default WalletScreen;
