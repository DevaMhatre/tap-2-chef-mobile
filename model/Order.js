import { Model } from '@nozbe/watermelondb';
import { field, text, date, children } from '@nozbe/watermelondb/decorators';

export default class Order extends Model {
  static table = 'orders';

  @field('tenant_id') tenantId;
  @text('table_number') tableNumber;
  @field('total_amount') totalAmount;
  @field('cash_amount') cashAmount;
  @field('upi_amount') upiAmount;
  @text('status') status; // 'draft', 'cooking', 'served', 'settled'

  @date('created_at') createdAt;

  @children('order_items') orderItems;
}
