import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/firebase';
import ProductCard from './ProductCard';

export default function Products() {
    const {
        isLoading,
        error,
        data: products
    } = useQuery(['products'], getProducts); // useQuery는 파이어베이스로부터 정보를 가져오기 위해 사용
    return (
    <>
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <ul className='grid grid-cols-1 md:grid-cols-3 lg-grid-cols-4 gap-4 p-4'>
            {products && 
                products.map((product) => (
                    <ProductCard key={product.id} product={product} />
            ))}
        </ul>
    </>
    );     
}

