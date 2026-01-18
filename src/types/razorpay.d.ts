export {};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    order_id: string;
    handler: (response: RazorpaySuccessResponse) => void;
    modal?: {
      ondismiss?: () => void;
    };
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: {
      color?: string;
    };
  }

  interface RazorpaySuccessResponse {
    razorpay_payment_id: string | null;
    razorpay_order_id: string | null;
    razorpay_signature: string | null;
  }

  interface RazorpayFailureResponse {
    error: {
      code: string;
      description: string;
      source: string;
      step: string;
      reason: string;
      metadata: {
        order_id?: string;
        payment_id?: string;
      };
    };
  }

  interface RazorpayInstance {
    open: () => void;
    on: (
      event: "payment.failed" | "payment.success",
      handler: (response: RazorpayFailureResponse | RazorpaySuccessResponse) => void
    ) => void;
  }
}
