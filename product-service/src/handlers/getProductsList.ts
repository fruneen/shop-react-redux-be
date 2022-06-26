import createResponse from 'helpers/createResponse';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getProductsList = async () => {
  try {
    const products = await prisma.$queryRaw`
      SELECT id, title, description, price, count FROM "Product" 
      LEFT JOIN "Stock" ON "Product"."id" = "Stock"."productId"
    `;

    return createResponse(200, products);
  } catch (error) {
    return createResponse(500, error);
  }
};

export default getProductsList;
