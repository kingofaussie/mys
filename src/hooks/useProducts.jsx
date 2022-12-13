import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts as fetchProducts , addNewProduct  } from '../api/firebase';

export default function useProducts() {
  const queryClient = useQueryClient();

  const productsQuery = useQuery(['products'], fetchProducts , {  // useQuery는 파이어베이스로부터 정보를 가져오기 위해 사용
    staleTime: 1000 * 60, 
  });

  const addProduct = useMutation(
    ({product, url}) => addNewProduct(product, url), 
    {
    onSuccess: () => queryClient.invalidateQueries(['products']),
    }
  );

  return { productsQuery, addProduct }
}