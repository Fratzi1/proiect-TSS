import { describe } from "vitest";
import { calculateTotalAmount, isEmail } from "../util/helper-functions";

describe("test calculateTotalAmount", () => {
  test("no items", () => {
    const items = [];
    expect(calculateTotalAmount(items)).toBe(0);
  });

  test("one item of a kind", () => {
    const items = [{ price: 10, quantity: 1 }];
    expect(calculateTotalAmount(items)).toBe(10);
  });

  test("several items of a kind", () => {
    const items = [{ price: 10, quantity: 3 }];
    expect(calculateTotalAmount(items)).toBe(30);
  });

  test("several items of several kinds", () => {
    const items = [{ price: 14, quantity: 2 }, {price: 15, quantity:10}, {price:8, quantity: 4}];
    expect(calculateTotalAmount(items)).toBe(210);
  });
});

describe("test isEmail", () => {
  test("test email contains @", () => {
    expect(isEmail("test@mail.com")).toBeTruthy();
  });

  test("test email doesn't contain @", () => {
    expect(isEmail("testmail.com")).toBeFalsy();
  });
});
