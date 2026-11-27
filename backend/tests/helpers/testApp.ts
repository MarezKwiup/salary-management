import { createApp, type AppDeps } from '../../src/app';
import { EmployeeService } from '../../src/employees/employee.service';
import { InsightsService } from '../../src/insights/insights.service';
import { InMemoryEmployeeRepository } from '../fakes/InMemoryEmployeeRepository';
import { StubInsightsRepository } from '../fakes/StubInsightsRepository';

export function buildTestApp(overrides: Partial<AppDeps> = {}) {
    const deps: AppDeps = {
        employeeService:
            overrides.employeeService ?? new EmployeeService(new InMemoryEmployeeRepository()),
        insightsService:
            overrides.insightsService ?? new InsightsService(new StubInsightsRepository()),
        staticDir: overrides.staticDir,
    };
    return { app: createApp(deps), ...deps };
}
