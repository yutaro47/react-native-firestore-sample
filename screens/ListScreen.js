import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { FormLabel, FormInput, Button, Icon } from 'react-native-elements';
import Fire from '../utils/Fire';
import Colors from '../constants/Colors';
import firebase from 'firebase';
import moment from 'moment';
import 'moment/locale/ja';
import ListItem from '../components/ListItem';

export default class ListScreen extends React.Component {
  static navigationOptions = {
    title: 'FOOD NOTE',
  };

  state = {
    foods: [],
    date: moment().format('YYYY-MM-DD'),
  };

  async componentDidMount() {
    if (Fire.shared.uid) {
      this.searchFooodByDay(this.state.date);
    } else {
      firebase.auth().onAuthStateChanged(async user => {
        this.searchFooodByDay(this.state.date);
      });
    }
  }

  async onDaySelected(day) {
    this.setState({ date: day.dateString });
    this.searchFooodByDay(day.dateString);
  }

  async searchFooodByDay(dateString) {
    const foods = await Fire.shared.searchFooodByDay(dateString);
    this.setState({ foods });
  }

  openCalendar() {
    this.props.navigation.navigate('Calendar', {
      onDaySelected: day => this.onDaySelected(day),
    });
  }

  openEditor() {
    this.props.navigation.navigate('Editor', {
      onFoodAdded: food => {
        const foods = [...this.state.foods, food];
        this.setState({ foods });
      },
    });
  }

  renderFood(food) {
    return <ListItem food={food} />;
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title={this.state.date}
          onPress={() => this.openCalendar()}
          color={Colors.tintColor}
          icon={{
            name: 'calendar',
            type: 'font-awesome',
            color: Colors.tintColor,
          }}
          buttonStyle={{
            borderColor: Colors.tintColor,
            borderWidth: 1,
            backgroundColor: '#fff',
          }}
          rounded
        />
        <FlatList
          data={this.state.foods}
          renderItem={({ item }) => this.renderFood(item)}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.roundButtonContainer}>
          <Icon
            reverse
            size={28}
            name="edit"
            type="font-awesome"
            color={Colors.tintColor}
            onPress={() => this.openEditor()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  roundButtonContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
