import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'menu_profiles',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'is_active', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'menu_profile_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'items',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'price', type: 'number' },
        { name: 'category_id', type: 'string', isIndexed: true },
        { name: 'is_out_of_stock', type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'orders',
      columns: [
        { name: 'total_amount', type: 'number' },
        { name: 'cash_amount', type: 'number' },
        { name: 'upi_amount', type: 'number' },
        { name: 'status', type: 'string' }, // 'draft', 'cooking', 'served', 'settled'
        { name: 'created_at', type: 'number' }, // timestamp
      ],
    }),
    tableSchema({
      name: 'expenses',
      columns: [
        { name: 'amount', type: 'number' },
        { name: 'tag', type: 'string' },
        { name: 'payment_source', type: 'string' }, // 'CASH', 'UPI'
        { name: 'created_at', type: 'number' }, // timestamp
      ],
    }),
  ],
});
