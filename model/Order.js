import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Order extends Model {
  static table = 'orders';

  @field('total_amount') totalAmount;
  @field('cash_amount') cashAmount;
  @field('upi_amount') upiAmount;
  @text('status') status; // 'draft', 'cooking', 'served', 'settled'

  @readonly @date('created_at') createdAt;
}
