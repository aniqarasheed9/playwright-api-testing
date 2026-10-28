export const productSchema = {
  type: 'object',
  required: ['id', 'title', 'price', 'description', 'category', 'image', 'rating'],
  additionalProperties: false,
  properties: {
    id: { type: 'number' },
    title: { type: 'string', minLength: 1 },
    price: { type: 'number', minimum: 0 },
    description: { type: 'string' },
    category: { type: 'string', minLength: 1 },
    image: { type: 'string', format: 'uri' },
    rating: {
      type: 'object',
      required: ['rate', 'count'],
      additionalProperties: false,
      properties: {
        rate: { type: 'number', minimum: 0, maximum: 5 },
        count: { type: 'number', minimum: 0 },
      },
    },
  },
};

export const productListSchema = {
  type: 'array',
  items: productSchema,
};

export const loginResponseSchema = {
  type: 'object',
  required: ['token'],
  additionalProperties: false,
  properties: {
    token: { type: 'string', minLength: 10 },
  },
};

export const userSchema = {
  type: 'object',
  required: ['id', 'email', 'username', 'name', 'address', 'phone'],
  properties: {
    id: { type: 'number' },
    email: { type: 'string', format: 'email' },
    username: { type: 'string', minLength: 1 },
    password: { type: 'string' },
    name: {
      type: 'object',
      required: ['firstname', 'lastname'],
      properties: {
        firstname: { type: 'string' },
        lastname: { type: 'string' },
      },
    },
    address: {
      type: 'object',
      required: ['city', 'street', 'number', 'zipcode', 'geolocation'],
      properties: {
        city: { type: 'string' },
        street: { type: 'string' },
        number: { type: 'number' },
        zipcode: { type: 'string' },
        geolocation: {
          type: 'object',
          required: ['lat', 'long'],
          properties: {
            lat: { type: 'string' },
            long: { type: 'string' },
          },
        },
      },
    },
    phone: { type: 'string' },
  },
};

export const cartSchema = {
  type: 'object',
  required: ['id', 'userId', 'date', 'products'],
  properties: {
    id: { type: 'number' },
    userId: { type: 'number' },
    date: { type: 'string' },
    products: {
      type: 'array',
      items: {
        type: 'object',
        required: ['productId', 'quantity'],
        properties: {
          productId: { type: 'number' },
          quantity: { type: 'number', minimum: 1 },
        },
      },
    },
  },
};
