import BrandForm from './../../../components/BrandForm';

export default function EditBrandPage({ params }) {
  return( 
    <div className='flex items-center h-screen justify-center'>
      <BrandForm id={params.id} />
    </div>
  )
}
