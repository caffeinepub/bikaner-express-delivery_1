export function buildWhatsAppUrl(message: string, phoneNumber?: string): string {
  const encodedMessage = encodeURIComponent(message);
  if (phoneNumber) {
    // Remove any non-digit characters from phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }
  return `https://wa.me/?text=${encodedMessage}`;
}

export function buildGoogleMapsUrl(address: string): string {
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
}

export function buildWhatsAppMessage(orderId: string, pickupAddress: string): string {
  return `Hello! I need help with my delivery order.\n\nOrder ID: ${orderId}\nPickup Address: ${pickupAddress}`;
}

export function buildWhatsAppMessageForRider(orderId: string, pickupLocation: string, dropLocation: string): string {
  return `New delivery assignment!\n\nOrder ID: ${orderId}\nPickup: ${pickupLocation}\nDrop: ${dropLocation}\n\nPlease confirm receipt and proceed with pickup.`;
}

export function buildWhatsAppMessageForCustomer(orderId: string, pickupLocation: string, dropLocation: string): string {
  return `Your order has been delivered!\n\nOrder ID: ${orderId}\nPickup: ${pickupLocation}\nDrop: ${dropLocation}\n\nThank you for using Bikaner Express Delivery!`;
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return Promise.resolve();
  } catch (err) {
    document.body.removeChild(textArea);
    return Promise.reject(err);
  }
}
