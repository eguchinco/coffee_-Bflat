"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { startCheckout, type CheckoutRequest } from "@/lib/checkout-client";
import type { VariantProps } from "class-variance-authority";

type Props = {
  payload: CheckoutRequest;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
};

export function CheckoutButton({
  payload,
  children,
  className,
  disabled,
  variant,
  size,
}: Props) {
  const [pending, setPending] = React.useState(false);

  const handleClick = async () => {
    setPending(true);

    try {
      await startCheckout(payload);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Checkout に失敗しました";
      window.alert(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      className={className}
      disabled={disabled || pending}
      variant={variant}
      size={size}
      onClick={handleClick}
    >
      {pending ? "決済画面へ移動中..." : children}
    </Button>
  );
}
