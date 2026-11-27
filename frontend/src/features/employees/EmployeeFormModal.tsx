import { Button, Group, Modal, NumberInput, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from '@mantine/form';
import { notifications } from "@mantine/notifications";
import { fieldErrorsFrom } from "../../api/errors";
import { useCreateEmployee, useUpdateEmployee } from "../../api/employees";
import type { Employee } from "../../api/types";
import { COUNTRIES, COUNTRY_CODES, DEPARTMENTS } from "../../lib/countries";
import {
    emptyEmployeeForm,
    employeeFormValidation,
    toEmployeeInput,
    toFormValues,
    type EmployeeFormValues
} from './employeeForm';

interface Props {
    opened: boolean;
    onClose: () => void;
    employee?: Employee | undefined;
}

const countryOptions = COUNTRY_CODES.map((code) => ({ value: code, label: COUNTRIES[code].name }));

export function EmployeeFormModal({ opened, onClose, employee }: Props) {
    const isEdit = Boolean(employee);
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={isEdit ? 'Edit employee' : 'Add employee'}
            centered
        >
            <EmployeeForm key={employee?.id ?? 'new'} employee={employee} onDone={onClose} />
        </Modal>
    );
}

function EmployeeForm({
    employee,
    onDone,
}: {
    employee?: Employee | undefined;
    onDone: () => void;
}) {
    const form = useForm<EmployeeFormValues>({
        mode: 'controlled',
        initialValues: employee ? toFormValues(employee) : emptyEmployeeForm,
        validate: employeeFormValidation,
    });
    const create = useCreateEmployee();
    const update = useUpdateEmployee();
    const saving = create.isPending || update.isPending;

    const country = form.values.country;
    const currency = country ? COUNTRIES[country].currency : undefined;

    async function handleSubmit(values: EmployeeFormValues) {
        const input = toEmployeeInput(values);
        try {
            if (employee) {
                await update.mutateAsync({ id: employee.id, input })
            } else {
                await create.mutateAsync(input);
            }
            notifications.show({
                color: 'green',
                message: employee ? `${input.fullName} updated` : `${input.fullName} added`,
            });
            onDone();
        } catch (error) {
            const fieldErrors = fieldErrorsFrom(error);
            if (fieldErrors) {
                form.setErrors(fieldErrors);
            } else {
                notifications.show({
                    color: 'red',
                    message: 'Something went wrong. Please try agian.',
                });
            }
        }
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
            <Stack>
                <TextInput
                    label="Full name"
                    withAsterisk
                    data-autofocus
                    {...form.getInputProps('fullName')}
                />
                <TextInput label="Job title" withAsterisk {...form.getInputProps('jobTitle')} />
                <Select
                    label="Department"
                    withAsterisk
                    data={[...DEPARTMENTS]}
                    {...form.getInputProps('department')}
                />
                <Select
                    label="Country"
                    withAsterisk
                    data={countryOptions}
                    {...form.getInputProps('country')}
                />
                <NumberInput
                    label={currency ? `Annual salary (${currency})` : 'Annual salary'}
                    description={currency ? undefined : 'Pick a country to set the currency'}
                    withAsterisk
                    min={1}
                    allowDecimal={false}
                    allowNegative={false}
                    thousandSeparator=","
                    {...form.getInputProps('salary')}
                />
                <TextInput
                    label="Hire date"
                    type="date"
                    withAsterisk
                    {...form.getInputProps('hireDate')}
                />
                <Group justify="flex-end" mt="sm">
                    <Button variant="default" onClick={onDone} disabled={saving}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={saving}>
                        {employee ? 'Save changes' : 'Add employee'}
                    </Button>

                </Group>
            </Stack>
        </form>
    )
}