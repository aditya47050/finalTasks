import { Footer } from "./../../components/footer"
import { CategoryProducts } from './../../components/category-products';

export default async function CategoryPage({ params }) {
  const { slug } = await params; // ✅ await the params object

  return (
    <div className="min-h-screen bg-background">
      <main>
        <CategoryProducts categorySlug={slug} />
      </main>
      <Footer />
    </div>
  )
}
