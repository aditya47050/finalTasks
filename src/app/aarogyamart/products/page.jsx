
import {Footer} from './../components/footer';
import { ProductCatalog } from './../components/product-catalog';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <ProductCatalog />
      </main>
      <Footer />
    </div>
  )
}
