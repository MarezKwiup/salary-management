import { Router } from 'express';
import { createEmployeeSchema } from './employee.validation';
import type { EmployeeService } from './employee.service';

export function employeeRouter(service: EmployeeService): Router {
  const router = Router();

  router.post('/', async (req, res) => {
    const body = createEmployeeSchema.parse(req.body);
    const employee = await service.create(body);
    res.status(201).json(employee);
  });

  return router;
}
