import { Model } from '@nozbe/watermelondb';
import { field, relation, text } from '@nozbe/watermelondb/decorators';

export default class OrderItem extends Model {
  static table = 'order_items';

  @field('tenant_id') tenantId;
  @field('quantity') quantity;
  @field('price') price;
  @text('notes') notes;

  @relation('orders', 'order_id') order;
  @relation('items', 'item_id') item;
}
