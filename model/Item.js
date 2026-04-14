import { Model } from '@nozbe/watermelondb';
import { text, field, relation } from '@nozbe/watermelondb/decorators';

export default class Item extends Model {
  static table = 'items';

  static associations = {
    categories: { type: 'belongs_to', key: 'category_id' },
  };

  @text('name') name;
  @field('price') price;
  @field('is_out_of_stock') isOutOfStock;

  @relation('categories', 'category_id') category;
}
