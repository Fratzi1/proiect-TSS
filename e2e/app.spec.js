import fs from "node:fs/promises";

import { expect, test } from "@playwright/test";

const ordersFileUrl = new URL("../backend/data/orders.json", import.meta.url);

async function addMealToCart(page, mealName) {
  const mealItem = page.locator("#meals > li").filter({
    has: page.getByRole("heading", { name: mealName, exact: true }),
  });

  await mealItem.getByRole("button", { name: /add to cart/i }).click();
}

test("loads all meals from backend and shows them on the page", async ({
  page,
  request,
}) => {
  const response = await request.get("http://127.0.0.1:3000/meals");
  expect(response.ok()).toBeTruthy();

  const meals = await response.json();

  await page.goto("/");

  await expect(page.getByRole("heading", { name: /reactfood/i })).toBeVisible();
  await expect(page.locator("#meals > li")).toHaveCount(meals.length);

  for (const meal of meals) {
    await expect(
      page.getByRole("heading", { name: meal.name, exact: true }),
    ).toBeVisible();
  }
});

test("adds a product to cart and shows it in the cart modal", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByText(/mac & cheese/i)).toBeVisible();

  await addMealToCart(page, "Mac & Cheese");
  await expect(page.getByRole("button", { name: /cart \(1\)/i })).toBeVisible();

  await page.getByRole("button", { name: /cart \(1\)/i }).click();

  await expect(page.getByText(/no items in the cart!/i)).not.toBeVisible();
  await expect(page.getByText(/mac & cheese - 1 x \$8\.99/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /checkout/i })).toBeVisible();
});

test("increases quantity from cart controls", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText(/mac & cheese/i)).toBeVisible();

  await addMealToCart(page, "Mac & Cheese");
  await page.getByRole("button", { name: /cart \(1\)/i }).click();

  await expect(page.getByText(/mac & cheese - 1 x \$8\.99/i)).toBeVisible();

  await page.getByRole("button", { name: "+" }).click();

  await expect(page.getByText(/mac & cheese - 2 x \$8\.99/i)).toBeVisible();
});

test("decreases quantity from cart controls", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText(/mac & cheese/i)).toBeVisible();

  await addMealToCart(page, "Mac & Cheese");
  await page.getByRole("button", { name: /cart \(1\)/i }).click();
  await page.getByRole("button", { name: "+" }).click();

  await expect(page.getByText(/mac & cheese - 2 x \$8\.99/i)).toBeVisible();

  await page.getByRole("button", { name: "-" }).click();

  await expect(page.getByText(/mac & cheese - 1 x \$8\.99/i)).toBeVisible();
});

test("places an order and persists it in backend orders file", async ({
  page,
}) => {
  const originalOrders = JSON.parse(await fs.readFile(ordersFileUrl, "utf8"));
  const customer = {
    name: "Playwright Tester",
    email: `playwright-${Date.now()}@example.com`,
    street: "Test Street 42",
    postalCode: "12345",
    city: "Cluj-Napoca",
  };

  try {
    await page.goto("/");

    await expect(page.getByText(/mac & cheese/i)).toBeVisible();

    await addMealToCart(page, "Mac & Cheese");
    await addMealToCart(page, "Caesar Salad");

    await page.getByRole("button", { name: /cart \(2\)/i }).click();
    await expect(page.getByText(/mac & cheese - 1 x \$8\.99/i)).toBeVisible();
    await expect(page.getByText(/caesar salad - 1 x \$7\.99/i)).toBeVisible();

    await page.getByRole("button", { name: /checkout/i }).click();

    await page.getByLabel(/full name/i).fill(customer.name);
    await page.getByLabel(/e-mail address/i).fill(customer.email);
    await page.getByLabel(/street/i).fill(customer.street);
    await page.getByLabel(/postal code/i).fill(customer.postalCode);
    await page.getByLabel(/city/i).fill(customer.city);

    await page.getByRole("button", { name: /^order$/i }).click();

    await expect(
      page.getByText(
        /your order has been registered and will be delivered soon\./i,
      ),
    ).toBeVisible();

    const savedOrders = JSON.parse(await fs.readFile(ordersFileUrl, "utf8"));
    const savedOrder = savedOrders.find(
      (order) => order.customer.email === customer.email,
    );

    expect(savedOrder).toBeDefined();
    expect(savedOrder.customer).toEqual({
      name: customer.name,
      email: customer.email,
      street: customer.street,
      "postal-code": customer.postalCode,
      city: customer.city,
    });
    expect(savedOrder.items).toEqual([
      {
        id: "m1",
        name: "Mac & Cheese",
        price: "8.99",
        quantity: 1,
      },
      {
        id: "m3",
        name: "Caesar Salad",
        price: "7.99",
        quantity: 1,
      },
    ]);
    expect(savedOrder.totalprice).toBeCloseTo(16.98, 2);
  } finally {
    await fs.writeFile(ordersFileUrl, JSON.stringify(originalOrders));
  }
});
