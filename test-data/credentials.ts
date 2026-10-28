export const validCredentials = {
  username: 'mor_2314',
  password: '83r5^_',
};

export const invalidCredentials = {
  username: 'mor_2314',
  password: 'wrong_password',
};

export const nonExistentUserCredentials = {
  username: 'does_not_exist_user',
  password: 'whatever123',
};

export const newUserPayload = {
  email: 'newqauser@example.com',
  username: 'newqauser',
  password: 'StrongPass123!',
  name: {
    firstname: 'QA',
    lastname: 'Tester',
  },
  address: {
    city: 'Lahore',
    street: 'Test Street',
    number: 42,
    zipcode: '54000',
    geolocation: {
      lat: '31.5204',
      long: '74.3587',
    },
  },
  phone: '1-555-555-5555',
};

export const newProductPayload = {
  title: 'QA Test Product',
  price: 29.99,
  description: 'A product created during automated API testing.',
  image: 'https://example.com/test-product.png',
  category: 'electronics',
};
