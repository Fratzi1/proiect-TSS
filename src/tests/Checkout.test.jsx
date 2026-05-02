import Submit from "../components/Submit";
import Checkout from "../components/Checkout";
import { MealsContext } from "../components/meals-context";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function clickButton() {
  return userEvent.click(screen.getByRole("button", { name: /order/i }));
}

describe("test checkout", () => {
  test("all fields are blank => expect errors", async () => {
    render(<Checkout />);

    await clickButton();

    expect(screen.getByRole("list")).toBeInTheDocument();

    expect(screen.getByText(/username must be filled/i)).toBeInTheDocument();

    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Postal code must be a valid number/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/City and street must be filled/i),
    ).toBeInTheDocument();
  });

  test("name filled => username error dissapears", async () => {
    render(<Checkout />);

    const nameInput = screen.getByLabelText(/full name/i);
    await userEvent.type(nameInput, "Test name");

    await clickButton();

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(
      screen.queryByText(/username must be filled/i),
    ).not.toBeInTheDocument();

    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Postal code must be a valid number/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/City and street must be filled/i),
    ).toBeInTheDocument();
  });

  test("email filled => email error dissapears", async () => {
    render(<Checkout />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    await userEvent.type(emailInput, "test@mail.com");

    await clickButton();

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.queryByText(/username must be filled/i)).toBeInTheDocument();

    expect(
      screen.queryByText(/Invalid email address/i),
    ).not.toBeInTheDocument();

    expect(
      screen.getByText(/Postal code must be a valid number/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/City and street must be filled/i),
    ).toBeInTheDocument();
  });

  test("postal code correct => postal code error dissapears", async () => {
    render(<Checkout />);

    const postalCodeInput = screen.getByLabelText(/postal code/i);
    await userEvent.type(postalCodeInput, "12345");

    await clickButton();

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText(/username must be filled/i)).toBeInTheDocument();

    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();

    expect(
      screen.queryByText(/Postal code must be a valid number/i),
    ).not.toBeInTheDocument();

    expect(
      screen.getByText(/City and street must be filled/i),
    ).toBeInTheDocument();
  });

  test("postal code not a number => postal code error remains", async () => {
    render(<Checkout />);

    const postalCodeInput = screen.getByLabelText(/postal code/i);
    fireEvent.change(postalCodeInput, { target: { value: "abc" } });

    await clickButton();

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText(/username must be filled/i)).toBeInTheDocument();

    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Postal code must be a valid number/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/City and street must be filled/i),
    ).toBeInTheDocument();
  });

  test("street and city filled => address error dissapears", async () => {
    render(<Checkout />);

    const streetInput = screen.getByLabelText(/street/i);
    const cityInput = screen.getByLabelText(/city/i);

    await userEvent.type(streetInput, "Main Street 10");
    await userEvent.type(cityInput, "Cluj");

    await clickButton();

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText(/username must be filled/i)).toBeInTheDocument();

    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Postal code must be a valid number/i),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/City and street must be filled/i),
    ).not.toBeInTheDocument();
  });

  test("only street filled => address error remains", async () => {
    render(<Checkout />);

    const streetInput = screen.getByLabelText(/street/i);
    await userEvent.type(streetInput, "Main Street 10");

    await clickButton();

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText(/username must be filled/i)).toBeInTheDocument();

    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Postal code must be a valid number/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/City and street must be filled/i),
    ).toBeInTheDocument();
  });

  test("only city filled => address error remains", async () => {
    render(<Checkout />);

    const cityInput = screen.getByLabelText(/city/i);
    await userEvent.type(cityInput, "Cluj");

    await clickButton();

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText(/username must be filled/i)).toBeInTheDocument();

    expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Postal code must be a valid number/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/City and street must be filled/i),
    ).toBeInTheDocument();
  });

  test("all fields filled => no validation errors", async () => {
    render(<Checkout onAfterOrder={() => {}} />);

    await userEvent.type(screen.getByLabelText(/full name/i), "Test name");
    await userEvent.type(screen.getByLabelText(/e-mail/i), "test@mail.com");
    await userEvent.type(screen.getByLabelText(/street/i), "Main Street 10");
    await userEvent.type(screen.getByLabelText(/postal code/i), "12345");
    await userEvent.type(screen.getByLabelText(/city/i), "Cluj");

    await clickButton();

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/username must be filled/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/invalid email address/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/postal code must be a valid number/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/city and street must be filled/i),
    ).not.toBeInTheDocument();
  });

  test("all fields filled => addOrder works", async () => {
    const addOrderMock = vi.fn().mockResolvedValue(undefined);
    const onAfterOrderMock = vi.fn();

    render(
      <MealsContext value={{ items: [], addOrder: addOrderMock }}>
        <Checkout onAfterOrder={onAfterOrderMock} />
      </MealsContext>,
    );

    await userEvent.type(screen.getByLabelText(/full name/i), "Test name");
    await userEvent.type(screen.getByLabelText(/e-mail/i), "test@mail.com");
    await userEvent.type(screen.getByLabelText(/street/i), "Main Street 10");
    await userEvent.type(screen.getByLabelText(/postal code/i), "12345");
    await userEvent.type(screen.getByLabelText(/city/i), "Cluj");

    await clickButton();

    expect(addOrderMock).toHaveBeenCalledTimes(1);
    expect(addOrderMock).toHaveBeenCalledWith({
      customer: {
        name: "Test name",
        email: "test@mail.com",
        street: "Main Street 10",
        "postal-code": "12345",
        city: "Cluj",
      },
    });

    expect(onAfterOrderMock).toHaveBeenCalledTimes(1);
  });

  test("order button text changes to placing order while submit is pending", async () => {
    const addOrderMock = vi.fn(() => new Promise(() => {}));

    render(
      <MealsContext value={{ items: [], addOrder: addOrderMock }}>
        <Checkout onAfterOrder={() => {}} />
      </MealsContext>,
    );

    await userEvent.type(screen.getByLabelText(/full name/i), "Test name");
    await userEvent.type(screen.getByLabelText(/e-mail/i), "test@mail.com");
    await userEvent.type(screen.getByLabelText(/street/i), "Main Street 10");
    await userEvent.type(screen.getByLabelText(/postal code/i), "12345");
    await userEvent.type(screen.getByLabelText(/city/i), "Cluj");

    await clickButton();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /placing order/i }),
      ).toBeInTheDocument();
    });
  });

  test("order button becomes disabled while submit is pending", async () => {
    const addOrderMock = vi.fn(() => new Promise(() => {}));

    render(
      <MealsContext value={{ items: [], addOrder: addOrderMock }}>
        <Checkout onAfterOrder={() => {}} />
      </MealsContext>,
    );

    await userEvent.type(screen.getByLabelText(/full name/i), "Test name");
    await userEvent.type(screen.getByLabelText(/e-mail/i), "test@mail.com");
    await userEvent.type(screen.getByLabelText(/street/i), "Main Street 10");
    await userEvent.type(screen.getByLabelText(/postal code/i), "12345");
    await userEvent.type(screen.getByLabelText(/city/i), "Cluj");

    await clickButton();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /placing order/i }),
      ).toBeDisabled();
    });
  });
});
