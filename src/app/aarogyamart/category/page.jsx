
import { Footer } from "./../components/footer"
import { AllCategoryList } from "../components/AllCategoryList";


export default async function  CategoryPage({ params }) {
  const slug = await params.slug;
  return (
    <div className="min-h-screen bg-background">
      <main>
        <AllCategoryList />
      </main>
      <Footer />
    </div>
  )
}
