/**
 * Validate Pakistani phone number
 */
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, "");
  return /^(\+92|0092|0)?3[0-9]{9}$/.test(cleaned);
}

export type DeliveryForm = {
  name: string;
  phone: string;
  address: string;
  city: string;
  timeSlot: string;
};

export type PickupForm = {
  name: string;
  phone: string;
  timeSlot: string;
};

export type DeliveryErrors = Partial<Record<keyof DeliveryForm, string>>;
export type PickupErrors = Partial<Record<keyof PickupForm, string>>;

/**
 * Validate delivery form fields
 */
export function validateDeliveryForm(form: DeliveryForm): DeliveryErrors {
  const errors: DeliveryErrors = {};

  if (!form.name.trim()) {
    errors.name = "Full name is required.";
  } else if (form.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!validatePhone(form.phone)) {
    errors.phone = "Enter a valid Pakistani mobile number.";
  }

  if (!form.address.trim()) {
    errors.address = "Delivery address is required.";
  } else if (form.address.trim().length < 10) {
    errors.address = "Please enter a complete address.";
  }

  if (!form.city.trim()) {
    errors.city = "City or area is required.";
  }

  if (!form.timeSlot) {
    errors.timeSlot = "Please select a delivery time slot.";
  }

  return errors;
}

/**
 * Validate pickup form fields
 */
export function validatePickupForm(form: PickupForm): PickupErrors {
  const errors: PickupErrors = {};

  if (!form.name.trim()) {
    errors.name = "Full name is required.";
  } else if (form.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!validatePhone(form.phone)) {
    errors.phone = "Enter a valid Pakistani mobile number.";
  }

  if (!form.timeSlot) {
    errors.timeSlot = "Please select a pickup time slot.";
  }

  return errors;
}
