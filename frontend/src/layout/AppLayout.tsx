import { AppShell, Group, NavLink, Title } from "@mantine/core";
import { NavLink as RouterNavLink, Outlet } from "react-router";

export function AppLayout() {
    return (
        <AppShell header={{ height: 56}} navbar={{ width: 220, breakpoint: 'sm '}} padding="md">
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Title order={4}>ACME Salary Management</Title>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="sm">
                <NavLink component={RouterNavLink} to="/employees" label="Employees" />
                <NavLink component={RouterNavLink} to="/insights" label="Insights" />
            </AppShell.Navbar>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}