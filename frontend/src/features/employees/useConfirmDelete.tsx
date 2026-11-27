import { Text } from "@mantine/core";
import { modals } from '@mantine/modals';
import { notifications } from "@mantine/notifications";
import { useDeleteEmployee } from "../../api/employees";
import type { Employee } from "../../api/types";

export function useConfirmDelete() {
    const remove = useDeleteEmployee();

    return (employee: Employee) =>
        modals.openConfirmModal({
            title: 'Delete employee',
            centered: true,
            children: (
                <Text size="sm">
                    Delete <strong>{employee.fullName}</strong>? This cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () =>
                remove.mutate(employee.id, {
                    onSuccess: () =>
                        notifications.show({
                            color: 'green',
                            message: `${employee.fullName} deleted`
                        }),
                    onError: () =>
                        notifications.show({
                            color: 'red',
                            message: 'Could not delete. Please try agian.'
                        }),
                }),
        });
}