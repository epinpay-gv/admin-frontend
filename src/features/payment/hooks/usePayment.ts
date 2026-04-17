"use client";

// Re-export yeni hooklar
export { usePaymentProviders } from "./usePaymentProviders";
export { usePaymentMethods } from "./usePaymentMethods";
export { useProviderMethods } from "./useProviderMethods";

// Backward compatibility: eski usePayment hook'u → usePaymentMethods wrapper
import { usePaymentMethods } from "./usePaymentMethods";

/**
 * @deprecated Yeni kodda usePaymentProviders, usePaymentMethods, useProviderMethods kullanın.
 */
export function usePayment() {
  const { methods, loading, error, updateMethod } = usePaymentMethods();
  return { methods, loading, error, updateMethod };
}