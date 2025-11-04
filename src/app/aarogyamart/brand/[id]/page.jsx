import { Footer } from "./../../components/footer"
import { BrandProducts } from './../../components/BrandProducts';

export default function BrandPage({ params }) {
  const { id } = params

  return (
    <div className="min-h-screen bg-background">
      <main>
        <BrandProducts brandSlug={id} />
      </main>
      <Footer />
    </div>
  )
}
