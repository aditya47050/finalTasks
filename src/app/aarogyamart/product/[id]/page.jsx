import { ProductDetails } from "./../../components/product-details"
import { RelatedProducts } from "./../../components/related-products"
import { Header } from './../../components/header';
import {Footer} from './../../components/footer';

export default function ProductPage({ params }) {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <ProductDetails productId={params.id} />
        <RelatedProducts productId={params.id} />
      </main>
      <Footer />
    </div>
  )
}
