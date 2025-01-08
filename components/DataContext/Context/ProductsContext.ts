import { useState, useEffect } from 'react';
import { fetchLines, fetchProducts } from '../api';

interface Product {
    id: number;
    idLinea?: number;
    descripcion: string;
    habilitado?: boolean;
    existencia?: number;
    pvp1: number;
}

export const useProducts = () => {
    const [lines, setLines] = useState<any[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedLines = await fetchLines();
            const fetchedProducts = await fetchProducts();
            setLines(fetchedLines);
            setProducts(fetchedProducts);
        } catch (err) {
            setError('Hubo un error al cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { lines, products, loading, error, retry: fetchData };
};