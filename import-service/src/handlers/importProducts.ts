import createResponse from 'helpers/createResponse';
import s3Client from 'services/storage.service';

const importProducts = async (event: { queryStringParameters: { name: string }; }) => {
  try {
    const { name } = event.queryStringParameters;

    if (!name) {
      return createResponse(400, { error: 'Name is required' });
    }

    const signedUrl = await s3Client.getSignedUrlPromise('putObject', {
      Bucket: 'node-in-aws-import-service',
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv',
    });

    return createResponse(200, { signedUrl });
  } catch (error) {
    console.log(error);
    return createResponse(500, error);
  }
};

export default importProducts;
