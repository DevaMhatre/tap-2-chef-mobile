import { Model } from '@nozbe/watermelondb';
import { field, text, relation, children } from '@nozbe/watermelondb/decorators';

export default class Category extends Model {
  static table = 'categories';

  @field('tenant_id') tenantId;
  @text('name') name;
  @relation('menu_profiles', 'menu_profile_id') menuProfile;

  @children('items') items;
}
