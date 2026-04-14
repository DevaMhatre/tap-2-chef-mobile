import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, FlatList } from 'react-native';
import { DatabaseProvider, useDatabase } from '@nozbe/watermelondb/react';
import withObservables from '@nozbe/with-observables';
import { database } from './model/index';
import MenuProfile from './model/MenuProfile';

interface ProfileItemProps { profile: MenuProfile }
// 1. Single Item Component
const ProfileItem = ({ profile }: ProfileItemProps) => (
  <View style={styles.item}>
    <Text>{profile.name} - Active: {profile.isActive ? 'Yes' : 'No'}</Text>
  </View>
);

const EnhancedProfileItem = withObservables(['profile'], ({ profile }) => ({
  profile,
}))(ProfileItem);

// 2. The List Component
const ProfileList: any = ({ profiles }: { profiles: MenuProfile[] }) => {
  return (
    <FlatList
      data={profiles}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <EnhancedProfileItem profile={item} />}
      ListEmptyComponent={<Text>No menu profiles exist yet.</Text>}
    />
  );
};

// 3. Connect List to the Database 'menu_profiles' Collection
const EnhancedProfileList = withObservables([], () => ({
  profiles: database.get('menu_profiles').query().observe(),
}))(ProfileList);


// 4. Content Screen using DB hooks
const TestScreen = () => {
  const db = useDatabase();

  const handleAddProfile = async () => {
    await db.write(async () => {
      await db.get('menu_profiles').create((profile: any) => {
        profile.name = `Standard Dine-In ${Date.now()}`;
        profile.isActive = true;
      });
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>WatermelonDB Sandbox</Text>

      <Button title="Add Test Menu Profile" onPress={handleAddProfile} />

      <View style={styles.listContainer}>
        <EnhancedProfileList />
      </View>
    </SafeAreaView>
  );
};

// 5. Root Application Wrapper
const App = () => {
  return (
    <DatabaseProvider database={database}>
      <TestScreen />
    </DatabaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  listContainer: {
    marginTop: 20,
    flex: 1,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
    borderRadius: 5
  }
});

export default App;
