
import { Footer } from './../../components/footer';
import OrderDetailsPage from './../../components/OrderDetailsPage';


export default async function OrderDetailsMainPage({params}) {
  const id = await params;
  
  return (
    <div>
      <OrderDetailsPage id={id.id}/>
      <Footer/>
    </div>
  )
}