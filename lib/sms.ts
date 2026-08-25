export function normalizePhone(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = `233${digits.slice(1)}`;
  return digits;
}

export async function sendSms(phoneNumber: string, message: string) {
  const apiKey = process.env.SMS_API_KEY;
  if (!apiKey) throw new Error("SMS_API_KEY is not set");

  const res = await fetch("https://sendlinesms.com/api/v1/sms/send", {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipients: [normalizePhone(phoneNumber)],
      message,
      sender: "FeesahSt",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SMS send failed (${res.status}): ${text}`);
  }

  return res.json();
}

export type OrderSmsEvent = "placed" | "processing" | "delivered";

export function buildOrderSms(
  event: OrderSmsEvent,
  params: { name: string; orderNumber: string; total: number }
) {
  const { name, orderNumber, total } = params;
  const amount = `GHS ${total.toLocaleString()}`;

  switch (event) {
    case "placed":
      return (
        `Hi ${name}, we have received your Sutura by Feesah order ${orderNumber}. ` +
        `Total: ${amount}. We will contact you shortly to confirm. Thank you for shopping with us!`
      );
    case "processing":
      return (
        `Hi ${name}, your Sutura by Feesah order ${orderNumber} is being processed! ` +
        `Total: ${amount}. We will contact you shortly to arrange delivery. Thank you for shopping with us!`
      );
    case "delivered":
      return (
        `Hi ${name}, your Sutura by Feesah order ${orderNumber} has been delivered. ` +
        `We hope you love it! Thank you for shopping with us!`
      );
  }
}