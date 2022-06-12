import createResponse from 'helpers/createResponse';
import productListJson from 'mock/productList.json';

const getProductsList = async () => {
  try {
    return createResponse(200, productListJson);
  } catch (error) {
    return createResponse(500, error);
  }
};

export default getProductsList;
