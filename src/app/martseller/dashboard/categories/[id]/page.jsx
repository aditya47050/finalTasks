import CategoryForm from './../../../components/CategoryForm';

export default function EditCategoryPage({ params }) {
  return <CategoryForm id={params.id} />;
}
