import express from 'express';
import { EmployeeService } from './employees/employee.service';
import { employeeRouter } from './employees/employee.routes';
import { errorHandler, notFound } from './middleware/errors';
import { InsightsService } from './insights/insights.service';
import { insightsRouter } from './insights/insights.routes';
import { serveFrontend } from './middleware/frontend';

export interface AppDeps {
    employeeService: EmployeeService;
    insightsService: InsightsService;
    staticDir?: string | undefined;
}

export function createApp({ employeeService, insightsService, staticDir }: AppDeps) {
    const app = express();

    app.use(express.json({ limit: '100kb' }));
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok' });
    });
    app.use('/api/employees', employeeRouter(employeeService));
    app.use('/api/insights', insightsRouter(insightsService));
    if (staticDir) app.use(serveFrontend(staticDir));
    app.use(notFound);
    app.use(errorHandler);
    return app;
}
