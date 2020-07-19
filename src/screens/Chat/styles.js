import { StyleSheet, StatusBar, Platform } from 'react-native';
import colors from '../../assets/colors';
import theme from '../../assets/theme';
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dcdcdc'
  },
  inputContainer: {
    flex: 1
  },
  navBar: {
    flexDirection: 'row',
    paddingTop: (Platform.OS === "ios") ? 8 : StatusBar.currentHeight,
    height: (Platform.OS === "ios") ? 50 : 64,
    width: '100%',
    alignItems: 'center',
    backgroundColor: theme.colorAccent,
    elevation: 1,
    shadowOffset: { height: 1, width: 0 },
    shadowColor: "#00000066",
    shadowOpacity: 0.25,
    shadowRadius: 2.26,
  },
  headerIcon: {
    height: 18,
    width: 18,
    tintColor: colors.blacks
  },
  profileIcon: {
    borderRadius: 30,
    height: 35,
    width: 35,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    borderRadius: 30,
    height: 40,
    width: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceTxtView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '50%'
  },
  txtHeader: {
    fontSize: theme.MediumFont,
    color: colors.black,
    marginLeft: 16,
    alignSelf: 'center',
    fontFamily: theme.LightFont
  },
  nameView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10
  },
  issuesStatus: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  exitTxt: {
    fontSize: 40,
    color: colors.text_color,
    fontFamily: theme.LightFont,
    marginLeft: 16
  },
  bodyView: {
    flex: 1,
    alignItems: 'center',
  },
  chatHeader: {
    width: '98%',
    height: '15%',
    marginTop: 4,
    backgroundColor: colors.white,
    shadowColor: colors.gray,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,
  },
  messageBody: {
    flex: 1,
    padding: 4,
    alignItems: 'center',
    width: '100%',
    paddingLeft: 8,
    paddingRight: 8,

  },
  loadTxt: {
    width: 160,
    backgroundColor: '#ddd',
    color: colors.white,
    fontSize: 14,
    fontFamily: theme.LightFont,
    textAlign: 'center',
    borderRadius: 4,
    paddingBottom: 2

  },
  dateTimeTxt: {
    // width : 150,
    fontSize: 12,
    fontFamily: theme.LightFont,
    textAlign: 'center',
    borderRadius: 4,
    paddingBottom: 2,
    color: colors.darkGray,

  },

  messageHolderLeft: {
    width: '100%',
    backgroundColor: colors.green,
    alignItems: 'flex-start',
    height: 40
  },
  messageHolderRight: {
    width: '100%',
    backgroundColor: colors.red,
    alignItems: 'flex-end',
    height: 40
  },
  adminMessage: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: colors.gray,
    width: '60%',
    padding: 10,

  },
  userMessage: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    backgroundColor: colors.gray,
    width: '60%',
    padding: 10,

  },
  // the main style to the chat ui
  //ChatView

  outer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  messagesBubble: {
    flex: 1,
    // marginBottom: Platform.OS === 'ios' ? 0 : 0

  },
  KeyAvoidView: {
    flex: 1,
  },
  inputBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: 'center',
    backgroundColor: colors.white,
    elevation: 2,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.25,
    shadowColor: colors.black,
    shadowRadius: 2.26,
    // position: Platform.OS === 'ios' ? null : 'absolute',
    // bottom: Platform.OS === 'ios' ? null : 0,
  },
  textBox: {
    borderRadius: 8,
    borderWidth: 0,
    borderColor: 'gray',
    // flex: 1,
    // height: 35,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    width: '85%',
    backgroundColor: colors.whiteGray,
    marginLeft: 8
  },
  sendButton: {

    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    borderRadius: 40,
    backgroundColor: theme.colorAccent, elevation: 2,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.25,
    shadowColor: '#00000066',
    shadowRadius: 2.26,
    padding: 10,
  },
  sendIcon: {
    tintColor: colors.gold,
    resizeMode: 'contain',
    height: 20,
    width: 20,
  },
  //MessageBubble
  messageBubble: {
    // borderRadius: 5,
    marginTop: 8,
    marginRight: 10,
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    flex: 1
  },

  messageBubbleLeft: {
    backgroundColor: colors.gold,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },

  messageBubbleTextLeft: {
    color: colors.white,
    fontSize: 16,
    fontFamily: theme.LightFont,
  },

  messageBubbleRight: {
    backgroundColor: '#dcdcdc',
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowOffset: { height: 0, width: 0 },
    shadowColor: "#ffffff66",
    shadowOpacity: 0.25,
    shadowRadius: 2.26,
  },

  messageBubbleTextRight: {
    color: theme.primaryColor,
    fontSize: 16,
    fontFamily: theme.LightFont,
  },
});