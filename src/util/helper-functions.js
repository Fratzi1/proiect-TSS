export function calculateTotalAmount(items = []) {
    return items.reduce(
        (acc, item) => acc + (item.price * item.quantity), 
        0
    );
}
export function isEmail(value) {
  return value.includes('@');
}
