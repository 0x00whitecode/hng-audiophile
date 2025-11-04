import type { Order } from "@/lib/types";

export function renderEmailHtml(order: Order) {
  const items = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">x${i.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${i.price * i.quantity}</td>
        </tr>`
    )
    .join("");

  return `
  <div style="font-family:Manrope,Arial,sans-serif;background:#fafafa;padding:24px">
    <table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden">
      <tr>
        <td style="background:#000;color:#fff;padding:20px 24px">
          <strong style="letter-spacing:2px;text-transform:uppercase">audiophile</strong>
        </td>
      </tr>
      <tr>
        <td style="padding:24px">
          <h1 style="margin:0 0 8px;font-size:20px">Thanks, ${order.customer.name}!</h1>
          <p style="margin:0 0 16px;color:#444">Your order <strong>#${order.id}</strong> is being processed.</p>
          <h2 style="font-size:16px;margin:16px 0">Item Summary</h2>
          <table role="presentation" width="100%" style="border-collapse:collapse">${items}</table>
          <div style="margin-top:16px;border-top:1px solid #eee;padding-top:12px">
            <p style="margin:0;display:flex;justify-content:space-between"><span>Subtotal</span><strong>$${order.totals.subtotal}</strong></p>
            <p style="margin:0;display:flex;justify-content:space-between"><span>Shipping</span><strong>$${order.totals.shipping}</strong></p>
            <p style="margin:0;display:flex;justify-content:space-between"><span>Tax</span><strong>$${order.totals.tax}</strong></p>
            <p style="margin:0;display:flex;justify-content:space-between"><span>Grand Total</span><strong>$${order.totals.grandTotal}</strong></p>
          </div>
          <h2 style="font-size:16px;margin:16px 0">Shipping</h2>
          <p style="margin:0 0 8px;color:#444">${order.shipping.address}, ${order.shipping.city}, ${order.shipping.country}, ${order.shipping.zip}</p>
          <p style="margin:0 0 24px;color:#444">Contact: ${order.customer.email} • ${order.customer.phone}</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/order/${order.id}" style="display:inline-block;background:#D87D4A;color:#fff;padding:12px 16px;border-radius:8px;text-decoration:none;letter-spacing:1px;text-transform:uppercase;font-size:12px">View Your Order</a>
        </td>
      </tr>
      <tr>
        <td style="background:#f5f5f5;color:#666;padding:12px 24px;text-align:center;font-size:12px">© ${new Date().getFullYear()} Audiophile</td>
      </tr>
    </table>
  </div>`;
}