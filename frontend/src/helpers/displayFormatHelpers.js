export function displayCurrency(number) {
  return (
    "₹ " +
    number?.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
      // style: "currency",
      currency: "INR",
    })
  );
}
