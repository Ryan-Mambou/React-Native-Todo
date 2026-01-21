import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Todo } from "../types/todo";
import { supabase } from "../utils/supabase";


export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase.from('Todos').select('*');
      if (error) {
        console.error('Error fetching todos:', error);
      } else {
        setTodos(data);
      }
    };
    fetchTodos();
  }, []);
  console.log(todos);
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
        <View style={styles.headerTopLeft}>
          <Text>My Tasks</Text>
          <Text>10 tasks remaining</Text>
        </View>
        <View style={styles.headerTopRight}>
          <Ionicons name="color-palette-outline" size={24} color="black" />
          <Text>Manage Categories</Text>
        </View>
        </View>
      </View>
      <View style={styles.searchInputContainer}>
        <TextInput style={styles.searchInput} placeholder="Search tasks..." />
      </View>

    <View
    >
      <View>
      <Text>Back into react native!</Text>
      </View>
    </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  headerTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomColor: 'gray',
  },

  headerTopLeft: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  headerTopRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
});
