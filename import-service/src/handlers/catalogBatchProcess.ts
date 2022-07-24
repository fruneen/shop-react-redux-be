import Joi from 'joi';
import { SQSEvent } from 'aws-lambda';
import { PrismaClient } from '@prisma/client';

import createResponse from 'helpers/createResponse';
import snsClient from 'services/email.service';

const prisma = new PrismaClient();

const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  count: Joi.number().required(),
});


const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    const records = event.Records;

    for (const record of records) {
      console.log('Processing message');

      const { value: product, error } = await schema.validate( record.body);

      if (error) return createResponse(400, error);

      const createdProduct = await prisma.product.create({
        data: {
          title: product.title,
          description: product.description,
          price: product.price,
          stock: {
            create: {
              count: product.count,
            },
          },
        },
      });

      await snsClient.publish(
        {
          Subject: 'Catalog batch process',
          Message: JSON.stringify(createdProduct),
          TopicArn: process.env.SNS_ARN || '',
        },
        () => { console.log('Email sent'); },
      ).promise();

      return createResponse(200, { message: 'Product created' });
    }
  } catch (error) {
    console.log(error);
    return createResponse(500, error);
  }
};

export default catalogBatchProcess;
