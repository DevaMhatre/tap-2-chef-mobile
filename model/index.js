import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
import MenuProfile from './MenuProfile';
import Category from './Category';
import Item from './Item';
import Order from './Order';
import Expense from './Expense';

// The adapter defines how WatermelonDB communicates with the SQLite database
const adapter = new SQLiteAdapter({
  schema,
  // (You might want to implement migrations later, but for now we omit them to focus on the schema)
  // migrations,

  // Using JSI (true) is recommended for bridging WatermelonDB natively on modern RN (0.74+) architecture 
  jsi: true, /* Set to false if you experience issues bridging on your specific RN minor version */
  
  // (Optional) Database operations callbacks
  onSetUpError: error => {
    console.error('Database setup error', error);
  }
});

// The Database instance is the main access point to your data
export const database = new Database({
  adapter,
  modelClasses: [
    MenuProfile,
    Category,
    Item,
    Order,
    Expense,
  ],
});
