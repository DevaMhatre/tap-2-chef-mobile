import { Model } from '@nozbe/watermelondb';
import { field, text, relation } from '@nozbe/watermelondb/decorators';

export default class Item extends Model {
  static table = 'items';

  @field('tenant_id') tenantId;
  @text('name') name;
  @field('price') price;
  @field('is_out_of_stock') isOutOfStock;
  @field('is_veg') isVeg;

  @relation('categories', 'category_id') category;
}
