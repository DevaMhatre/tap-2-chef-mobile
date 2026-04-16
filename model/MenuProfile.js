import { Model } from '@nozbe/watermelondb';
import { field, text, children } from '@nozbe/watermelondb/decorators';

export default class MenuProfile extends Model {
  static table = 'menu_profiles';

  @field('tenant_id') tenantId;
  @text('name') name;
  @field('is_active') isActive;

  @children('categories') categories;
}
