import React, {useEffect} from 'react';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {Pincode} from '../../components/pincode';
import {DeviceEventEmitter} from 'react-native';
import {WalletGenerator} from '@coingrig/core';
import {showMessage} from 'react-native-flash-message';
import {COIN_LIST} from 'utils/constants';
import {WalletStore} from 'stores/wallet';
import {useTranslation} from 'react-i18next';
import {sleep} from 'utils';
import {generateMnemonic} from '@coingrig/wallet-generator';

const SetPinScreen = ({route}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  useEffect(() => {}, []);

  const success = async () => {
    const goTo = route.params.new
      ? 'GenerateWalletScreen'
      : 'ImportWalletScreen';

    if (goTo === 'GenerateWalletScreen') {
      DeviceEventEmitter.emit('showDoor', {
        title: t('modal.please_wait'),
        body: t('modal.remember_to_backup'),
      });
      await sleep(2000);
      let newMnemonic: any = null;
      try {
        const words = 12; // or 24
        newMnemonic = await generateMnemonic(words);
        console.log('-----------------ooook');
      } catch (error) {
        newMnemonic = WalletGenerator.generateMnemonic();
      }

      createWallet(newMnemonic);
      return;
    }
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: goTo}],
      }),
    );
  };

  const createWallet = async mnemonic => {
    const newWallet = await WalletStore.createWallets(mnemonic, COIN_LIST);
    if (newWallet) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{name: 'HomeScreens'}],
        }),
      );
    } else {
      // alert
      showMessage({
        message: t('message.error.unable_to_create_wallets'),
        type: 'danger',
      });
    }
  };

  return <Pincode onSuccess={() => success()} status={'choose'} />;
};

export default SetPinScreen;
