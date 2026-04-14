import { Model } from '@nozbe/watermelondb';
import { text, relation, children } from '@nozbe/watermelondb/decorators';

export default class Category extends Model {
  static table = 'categories';

  static associations = {
    menu_profiles: { type: 'belongs_to', key: 'menu_profile_id' },
    items: { type: 'has_many', foreignKey: 'category_id' },
  };

  @text('name') name;
  @relation('menu_profiles', 'menu_profile_id') menuProfile;

  @children('items') items;
}
