import createResponse from 'helpers/createResponse';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getProductById = async (event: { pathParameters: { id: string }; }) => {
  const { id } = event.pathParameters;
  console.log(id);

  try {
    const [product]: any = await prisma.$queryRaw(Prisma.sql`
      SELECT id, title, description, price, count
      FROM "Product"
             LEFT JOIN "Stock" ON "Product"."id" = "Stock"."productId"
      WHERE id = ${id}
    `);


    if (!product) return createResponse(404, { message: 'Product not found' });

    return createResponse(200, product);
  } catch (error) {
    return createResponse(500, error);
  }
};

export default getProductById;
