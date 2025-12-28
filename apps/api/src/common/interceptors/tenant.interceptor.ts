import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
    private readonly logger = new Logger(TenantInterceptor.name);

    constructor(
        private readonly dataSource: DataSource,
        private readonly configService: ConfigService,
    ) { }

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const organizationId = user?.organizationId;

        if (organizationId) {
            const dbType = this.configService.get('USE_DUMMY_DATA') === 'true' ? 'sqlite' : 'postgres';

            try {
                if (dbType === 'postgres') {
                    // PostgreSQL Row-Level Security session variable (Secured with parameter binding)
                    await this.dataSource.query(
                        'SELECT set_config($1, $2, true)',
                        ['app.current_organization_id', organizationId],
                    );
                } else {
                    // For SQLite, we might just log or use a different mechanism if needed
                    // but RLS is specifically a PG feature we are designing for production.
                    this.logger.debug(`[Tenant] SQLite detected, skipping RLS session variable for Org: ${organizationId}`);
                }
            } catch (error) {
                this.logger.error(`Failed to set tenant context: ${error.message}`);
            }
        }

        return next.handle();
    }
}
