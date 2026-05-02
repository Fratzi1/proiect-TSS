import { render, screen } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/react";
import { vi } from "vitest";

const mockMeals = [
  {
    id: "1",
    name: "Fasole batuta",
    price: "20",
    description: "Este o mancare foarte gustoasa.",
    image: "test-1.jpg",
  },
];

const mockTwoMeals = [
  {
    id: "1",
    name: "Fasole batuta",
    price: "20",
    description: "Este o mancare foarte gustoasa.",
    image: "test-1.jpg",
  },
  {
    id: "2",
    name: "Ciorba de burta",
    price: "30",
    description: "Este o ciorba foarte buna.",
    image: "test-2.jpg",
  },
];

// functie care face mock la fetch-ul din backend
function mockMealsRequest(meals = mockMeals) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => meals,
  });
}

function mockMealsAndOrderRequests(meals = mockMeals) {
  return vi.spyOn(globalThis, "fetch").mockImplementation((url, options) => {
    if (url === "http://localhost:3000/meals") {
      return Promise.resolve({
        ok: true,
        json: async () => meals,
      });
    }

    if (url === "http://localhost:3000/orders") {
      return Promise.resolve({
        ok: true,
        json: async () => ({ message: "ok" }),
      });
    }

    return Promise.reject(new Error(`Unexpected fetch call: ${String(url)}`));
  });
}

function getDialog() {
  return screen.getByRole("dialog", { hidden: true });
}

describe("App component tests", () => {
  test("App renders with no errors", async () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /reactfood/i }),
    ).toBeInTheDocument();
  });

  test("backend data mock works", async () => {
    mockMealsRequest();

    render(<App />);

    expect(await screen.findByText(/fasole batuta/i)).toBeInTheDocument();
  });
});

describe("test add to cart button", () => {
  test("add to cart - one product (cart number updates)", async () => {
    mockMealsRequest();

    render(<App />);

    expect(
      screen.getByRole("button", { name: /cart \(0\)/i }),
    ).toBeInTheDocument();

    await screen.findByText(/fasole batuta/i);

    await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(
      screen.getByRole("button", { name: /cart \(1\)/i }),
    ).toBeInTheDocument();
  });

  test("add to cart - one product (product is visible in the cart)", async () => {
    mockMealsRequest();

    render(<App />);

    // 1. in cos apare textul de "fara produse"
    expect(screen.getByText(/No items in the cart/i)).toBeInTheDocument();

    // 2. nu exista un element de tip lista in cos
    const dialog = getDialog();
    expect(within(dialog).queryByRole("list")).toBeNull();

    // 3. totalul e $0.00
    expect(within(dialog).queryByText(/\$0\.00/i)).toBeInTheDocument();

    await screen.findByText(/fasole batuta/i);

    // click add to cart si apoi deschid cosul
    await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    await userEvent.click(screen.getByRole("button", { name: /cart \(1\)/i }));

    expect(screen.queryByText(/No items in the cart/i)).not.toBeInTheDocument();

    expect(within(dialog).getByText(/fasole batuta/i)).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /checkout/i }),
    ).toBeInTheDocument();
  });

  test("2 x click pe Add to cart acelasi produs => counterul ramane 1", async () => {
    mockMealsRequest();

    render(<App />);

    await screen.findByText(/fasole batuta/i);

    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });

    await userEvent.click(addToCartButton);
    await userEvent.click(addToCartButton);

    expect(
      screen.getByRole("button", { name: /cart \(1\)/i }),
    ).toBeInTheDocument();
  });

  test("2 x click pe Add to cart acelasi produs => in cos produsul are cantitatea 2", async () => {
    mockMealsRequest();

    render(<App />);

    await screen.findByText(/fasole batuta/i);

    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });

    await userEvent.click(addToCartButton);
    await userEvent.click(addToCartButton);
    await userEvent.click(screen.getByRole("button", { name: /cart \(1\)/i }));

    const dialog = getDialog();

    expect(within(dialog).getAllByRole("listitem")).toHaveLength(1);
    expect(
      within(dialog).getByText(/fasole batuta - 2 x \$20/i),
    ).toBeInTheDocument();
  });

  test("2 x click pe Add to cart pe produse diferite => counterul devine 2", async () => {
    mockMealsRequest(mockTwoMeals);

    render(<App />);

    await screen.findByText(/fasole batuta/i);
    await screen.findByText(/ciorba de burta/i);

    const addToCartButtons = screen.getAllByRole("button", {
      name: /add to cart/i,
    });

    await userEvent.click(addToCartButtons[0]);
    await userEvent.click(addToCartButtons[1]);

    expect(
      screen.getByRole("button", { name: /cart \(2\)/i }),
    ).toBeInTheDocument();
  });

  test("2 produse diferite adaugate => ambele produse sunt vizibile in cos", async () => {
    mockMealsRequest(mockTwoMeals);

    render(<App />);

    expect(screen.getByText(/No items in the cart/i)).toBeInTheDocument();

    await screen.findByText(/fasole batuta/i);
    await screen.findByText(/ciorba de burta/i);

    const addToCartButtons = screen.getAllByRole("button", {
      name: /add to cart/i,
    });

    await userEvent.click(addToCartButtons[0]);
    await userEvent.click(addToCartButtons[1]);
    await userEvent.click(screen.getByRole("button", { name: /cart \(2\)/i }));

    const dialog = getDialog();

    expect(screen.queryByText(/No items in the cart/i)).not.toBeInTheDocument();
    expect(within(dialog).getByText(/fasole batuta/i)).toBeInTheDocument();
    expect(within(dialog).getByText(/ciorba de burta/i)).toBeInTheDocument();
    expect(within(dialog).getAllByRole("listitem")).toHaveLength(2);
  });
});

describe("test increase / decrease quantity in cart", () => {
  test("un produs in cos si click pe + => creste cantitatea la 2", async () => {
    mockMealsRequest();

    render(<App />);
    await screen.findByText(/fasole batuta/i);
    const dialog = getDialog();

    await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    await userEvent.click(screen.getByRole("button", { name: /cart \(1\)/i }));

    expect(
      within(dialog).getByText(/fasole batuta - 1 x \$20/i),
    ).toBeInTheDocument();

    await userEvent.click(
      within(dialog).getByRole("button", { name: /^\+$/i }),
    );

    expect(within(dialog).queryByText(/fasole batuta - 1 x \$20/i)).toBeNull();
    expect(
      within(dialog).getByText(/fasole batuta - 2 x \$20/i),
    ).toBeInTheDocument();
  });

  test("un produs in cos si click pe - => cosul se goleste", async () => {
    mockMealsRequest();

    render(<App />);
    await screen.findByText(/fasole batuta/i);
    const dialog = getDialog();

    // Add to cart si apoi deschid cosul
    await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    await userEvent.click(screen.getByRole("button", { name: /cart \(1\)/i }));

    expect(within(dialog).getByText(/fasole batuta/i)).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /checkout/i }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /-/i }));

    expect(within(dialog).queryByText(/fasole batuta - 1 x \$20/i)).toBeNull();
    expect(screen.queryByText(/No items in the cart/i)).toBeInTheDocument();
  });
});

describe("test order placement flow", () => {
  test("dupa plasarea comenzii modalul afiseaza mesajul final si butonul Return to the shop", async () => {
    mockMealsAndOrderRequests();

    render(<App />);

    await screen.findByText(/fasole batuta/i);

    await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    await userEvent.click(screen.getByRole("button", { name: /cart \(1\)/i }));

    const dialog = getDialog();

    await userEvent.click(
      within(dialog).getByRole("button", { name: /checkout/i }),
    );

    await userEvent.type(
      within(dialog).getByLabelText(/full name/i),
      "Test name",
    );
    await userEvent.type(
      within(dialog).getByLabelText(/e-mail/i),
      "test@mail.com",
    );
    await userEvent.type(
      within(dialog).getByLabelText(/street/i),
      "Main Street 10",
    );
    await userEvent.type(
      within(dialog).getByLabelText(/postal code/i),
      "12345",
    );
    await userEvent.type(within(dialog).getByLabelText(/city/i), "Cluj");

    await userEvent.click(
      within(dialog).getByRole("button", { name: /^order$/i }),
    );

    expect(
      await within(dialog).findByText(
        /your order has been registered and will be delivered soon\./i,
      ),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: /return to the shop/i }),
    ).toBeInTheDocument();
  });
});
