import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class TenantSetting extends Model {
  static table = 'tenant_settings';

  @field('tenant_id') tenantId;
  @field('table_count') tableCount;
}
