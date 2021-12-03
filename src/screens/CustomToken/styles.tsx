import {StyleSheet} from 'react-native';
import {Colors} from 'utils/colors';
import {SIZE} from 'utils/constants';

export const styles = StyleSheet.create({
  maincontainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  container: {
    justifyContent: 'space-between',
    borderRadius: 10,
    marginBottom: 25,
    paddingBottom: 10,
  },
  toFiat: {
    marginLeft: 20,
    marginTop: 10,
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'RobotoSlab-Bold',
    color: Colors.foreground,
  },
  available: {
    fontSize: 12,
    fontWeight: 'normal',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    // marginRight: 15,
    color: Colors.lighter,
    marginTop: 5,
    textAlign: 'center',
  },
  cameracontainer: {
    height: SIZE.height / 1.7,
    margin: 10,
    backgroundColor: 'black',
  },
  confirmtx: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 15,
    fontFamily: 'RobotoSlab-Bold',
    color: '#353333',
  },
  exectx: {
    backgroundColor: Colors.black,
    marginTop: 30,
    marginBottom: 30,
  },
  totalusd: {
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 16,
    color: Colors.black,
  },
  amountusd: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  preparetx: {flex: 1, justifyContent: 'flex-end', marginBottom: 40},
  input: {flex: 1, color: Colors.foreground},
  inputView: {
    flex: 1,
    minHeight: 50,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontSize: 14,
    marginVertical: 10,
    marginBottom: 0,
    borderColor: Colors.brick,
    marginHorizontal: 15,
    backgroundColor: Colors.inputBackground,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  chain: {
    flex: 1,
  },
  moreBtn: {
    justifyContent: 'center',
    marginRight: 10,
    paddingLeft: 10,
  },
  moreBtn2: {
    justifyContent: 'center',
    marginRight: 10,
  },
  value: {
    height: 40,
    marginVertical: 10,
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 5,
    borderColor: '#756156',
    fontSize: 14,
    marginHorizontal: 20,
    backgroundColor: Colors.background,
  },
});
