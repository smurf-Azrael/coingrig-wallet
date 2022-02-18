import apps from 'data/apps';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import CardList from 'components/CardList';
import {styles} from './styles';
import Separator from 'components/CardList/Separator';

const data = apps.filter(app => app.categories?.includes('tools'));

export default function Tools() {
  const {t} = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.scrollview}>
      <Separator title={'MODULES'} />
      <CardList
        data={data.filter(app => app.module)}
        title={null}
        category={null}
      />
      <Separator title={'EXTERNAL LINKS'} />
      <CardList
        data={data.filter(app => !app.module)}
        category={null}
        title={null}
      />
    </ScrollView>
  );
}
