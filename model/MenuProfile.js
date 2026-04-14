import { Model } from '@nozbe/watermelondb';
import { text, field, children } from '@nozbe/watermelondb/decorators';

export default class MenuProfile extends Model {
  static table = 'menu_profiles';

  static associations = {
    categories: { type: 'has_many', foreignKey: 'menu_profile_id' },
  };

  @text('name') name;
  @field('is_active') isActive;

  @children('categories') categories;
}
