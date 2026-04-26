import { initializePaddle, type Paddle } from "@paddle/paddle-js";

let paddleInstance: Paddle | undefined;

export async function getPaddle(): Promise<Paddle | undefined> {
  if (paddleInstance) return paddleInstance;

  paddleInstance = await initializePaddle({
    environment: "sandbox",
    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    eventCallback(event) {
      if (event.name === "checkout.completed") {
        window.dispatchEvent(new CustomEvent("firmiu:paddle-success"));
      }
    },
  });

  return paddleInstance;
}

export async function openCheckout(
  priceId: string,
  email: string,
  userId: string
): Promise<void> {
  const paddle = await getPaddle();

  if (!paddle) {
    console.error("[paddle] not initialized");
    return;
  }

  paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customer: { email },
    customData: { owner_id: userId },
  });
}
