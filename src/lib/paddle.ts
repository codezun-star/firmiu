import { initializePaddle, type Paddle } from "@paddle/paddle-js";

let paddleInstance: Paddle | undefined;

export async function getPaddle(): Promise<Paddle | undefined> {
  if (paddleInstance) return paddleInstance;

  const env = process.env.NEXT_PUBLIC_PADDLE_ENV;
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

  console.log("[paddle] environment:", env);
  console.log("[paddle] token prefix:", token?.slice(0, 10));

  paddleInstance = await initializePaddle({
    environment: env === "production" ? "production" : "sandbox",
    token: token!,
    eventCallback(event) {
      if (event.name === "checkout.completed") {
        window.dispatchEvent(new CustomEvent("firmiu:paddle-success"));
      }
      if (event.name === "checkout.closed") {
        window.dispatchEvent(new CustomEvent("firmiu:paddle-closed"));
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
  console.log("[paddle] abriendo checkout con:", { priceId, email, userId });
  const paddle = await getPaddle();
  if (!paddle) {
    console.error("[paddle] no se pudo inicializar");
    return;
  }
  paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customer: { email },
    customData: { owner_id: userId },
  });
}
