import productImage1 from '../src/assets/apparel1.jpg';
import productImage2 from '../src/assets/apparel2.jpg';
import productImage3 from '../src/assets/apparel3.jpg';
import productImage5 from '../src/assets/apparel5.jpg';


export interface Product{
    id: number;
    name: string;
    price: number;
    image: string;
}

export const sampleProducts: Product[] = [
    { id: 1, name: "Product 1", price: 0.23, image: productImage1 },
    { id: 2, name: "Product 2", price: 0.20, image: productImage2 },
    { id: 3, name: "Product 3", price: 0.13, image: productImage3 },
    { id: 4, name: "Product 4", price: 0.13, image: productImage5 },


];