import { expect, test, type APIRequestContext } from "@playwright/test";

const name = `E2E Tester ${Date.now()}`;

async function deleteTestEmployees(request: APIRequestContext) {
    const response = await request.get('/api/employees', { params: { search: name }});
    const { data } = (await response.json()) as { data: { id: number }[] };
    for (const employee of data) await request.delete(`/api/employees/${employee.id}`);
}

test.afterEach(async ({ request }) => {
    await deleteTestEmployees(request);
});

test('HR can add, find, edit and delete an employee', async ({ page }) => {
    await page.goto('/employees');

    // Add
    await page.getByRole('button', { name: 'Add employee '}).click();
    const form = page.getByRole('dialog');
    await form.getByLabel('Full name').fill(name);
    await form.getByLabel('Job title').fill('Backend Engineer');
    await form.getByRole('combobox', { name: 'Department' }).click();
    await page.getByRole('option', { name: 'Engineering' }).click();
    await form.getByRole('combobox', { name: 'Country' }).click();
    await page.getByRole('option', { name: 'Germany' }).click();
    await form.getByLabel('Annual salary (EUR)').fill('85000');
    await form.getByLabel('Hire date').fill('2025-03-01');
    await form.getByRole('button', { name: 'Add employee' }).click();
    await expect(page.getByText(`${name} added`)).toBeVisible();

    // Find
    await page.getByLabel('Search').fill(name);
    const row = page.getByRole('row', { name: new RegExp(name) });
    await expect(row).toContainText('85.000 €');
    await expect(page).toHaveURL(/search=E2E/);

    // Edit
    await row.getByRole('button', { name: `Edit ${name}` }).click();
    await form.getByLabel('Annual salary (EUR)').fill('90000');
    await form.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText(`${name} updated`)).toBeVisible();
    await expect(row).toContainText('90.000 €');

    // Delete
    await row.getByRole('button', { name: `Delete ${name}` }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText(`${name} deleted`)).toBeVisible();
    await expect(page.getByText('No employees match these filters.')).toBeVisible();
});

test('the form shows what is missing before anything is sent', async ({ page }) => {
    await page.goto('/employees');
    await page.getByRole('button', { name: 'Add employee' }).click();
    const form = page.getByRole('dialog');
 
    await form.getByRole('button', { name: 'Add employee' }).click();
 
    await expect(form.getByText('Name is required')).toBeVisible();
    await expect(form.getByText('Pick a country', { exact: true })).toBeVisible();
    await expect(form.getByText('Enter a whole number above 0')).toBeVisible();
});

test('filters live in the URL and survive a reload', async ({ page }) => {
    await page.goto('/employees');
 
    await page.getByRole('combobox', { name: 'Country' }).click();
    await page.getByRole('option', { name: 'India' }).click();
    await expect(page).toHaveURL(/country=IN/);
 
    await page.reload();
 
    await expect(page.getByRole('combobox', { name: 'Country' })).toHaveValue('India');
    const countryCells = page.getByRole('row').locator('td:nth-child(4)');
    await expect(countryCells.first()).toHaveText('India');
    for (const text of await countryCells.allInnerTexts()) expect(text).toBe('India');
});

test('salary sorting is only offered within a single country', async ({ page }) => {
    await page.goto('/employees');
    await expect(page.getByRole('button', { name: 'Salary' })).toBeDisabled();
 
    await page.goto('/employees?country=US');
    await expect(page.getByRole('button', { name: 'Salary' })).toBeEnabled();
});