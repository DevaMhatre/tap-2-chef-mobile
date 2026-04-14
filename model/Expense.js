import { Model } from '@nozbe/watermelondb';
import { field, text, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Expense extends Model {
  static table = 'expenses';

  @field('amount') amount;
  @text('tag') tag;
  @text('payment_source') paymentSource; // 'CASH', 'UPI'

  @readonly @date('created_at') createdAt;
}
