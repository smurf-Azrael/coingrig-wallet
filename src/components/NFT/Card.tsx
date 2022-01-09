import React from 'react';
import {View, Text, Image} from 'react-native';
import {Colors} from 'utils/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

const NFTCard = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.push('NFTScreen', {item})}
      style={{
        marginHorizontal: 15,
        backgroundColor: Colors.card,
        marginBottom: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border,
      }}>
      <Image
        style={{
          height: 200,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
        resizeMode="cover"
        source={{
          uri: item.image_url,
        }}
      />
      <View style={{padding: 10}}>
        <Text
          style={{
            fontSize: 15,
            color: Colors.lighter,
            fontFamily: 'RobotoSlab-Medium',
          }}>
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(NFTCard);
