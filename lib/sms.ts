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
      recipients: [phoneNumber],
      message,
      sender: "DasandaCL",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SMS send failed (${res.status}): ${text}`);
  }

  return res.json();
}

export function buildConfirmationSms(params: {
  name: string;
  orderNumber: string;
  total: number;
  currency: string;
}) {
  const { name, orderNumber, total, currency } = params;
  return (
    `Hi ${name}, your Dasanda Closet order ${orderNumber} has been CONFIRMED! ` +
    `Total: ${currency} ${total.toLocaleString()}. ` +
    `We will contact you shortly to arrange delivery. Thank you for shopping with us!`
  );
}