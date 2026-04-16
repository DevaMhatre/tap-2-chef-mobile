import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 4,
  tables: [
    tableSchema({
      name: 'tenant_settings',
      columns: [
        { name: 'tenant_id', type: 'string', isIndexed: true },
        { name: 'table_count', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'menu_profiles',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'is_active', type: 'boolean' },
        { name: 'tenant_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'menu_profile_id', type: 'string', isIndexed: true },
        { name: 'tenant_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'items',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'price', type: 'number' },
        { name: 'category_id', type: 'string', isIndexed: true },
        { name: 'is_out_of_stock', type: 'boolean' },
        { name: 'is_veg', type: 'boolean' },
        { name: 'tenant_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'orders',
      columns: [
        { name: 'total_amount', type: 'number' },
        { name: 'cash_amount', type: 'number' },
        { name: 'upi_amount', type: 'number' },
        { name: 'status', type: 'string' }, // 'draft', 'cooking', 'served', 'settled'
        { name: 'tenant_id', type: 'string', isIndexed: true },
        { name: 'table_number', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' }, // timestamp
      ],
    }),
    tableSchema({
      name: 'order_items',
      columns: [
        { name: 'order_id', type: 'string', isIndexed: true },
        { name: 'item_id', type: 'string', isIndexed: true },
        { name: 'quantity', type: 'number' },
        { name: 'price', type: 'number' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'tenant_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'expenses',
      columns: [
        { name: 'amount', type: 'number' },
        { name: 'tag', type: 'string' },
        { name: 'payment_source', type: 'string' }, // 'CASH', 'UPI'
        { name: 'tenant_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' }, // timestamp
      ],
    }),
  ],
});
