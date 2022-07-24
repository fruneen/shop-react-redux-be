import createResponse from 'helpers/createResponse';
import { Prisma, PrismaClient } from '@prisma/client';
import Joi from 'joi';

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  count: Joi.number().required(),
});

const prismaClient = new PrismaClient();

const getProductsList = async (event: { body: any; }) => {
  const { body } = event;

  try {
    if (!body) return createResponse(400, { message: 'Bad request' });

    const { value: validatedData, error } = await schema.validate(body);

    if (error) return createResponse(400, error);

    return await prismaClient.$transaction(async (prisma) => {
      const createdProduct = await prisma.product.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          price: validatedData.price,
          stock: {
            create: {
              count: validatedData.count,
            },
          },
        },
      });

      const [product]: any = await prisma.$queryRaw(Prisma.sql`
      SELECT id, title, description, price, count FROM "Product" 
      LEFT JOIN "Stock" ON "Product"."id" = "Stock"."productId"
      WHERE id = ${createdProduct.id}
    `);

      return createResponse(201, product);
    });

  } catch (error) {
    return createResponse(500, error);
  }
};

export default getProductsList;
