import { Helmet } from 'react-helmet-async';
import{SubscriptionView} from 'src/sections/subscription/view'
import { ProductsView } from 'src/sections/products/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title>Liste abonnements </title>
      </Helmet>

      <SubscriptionView />
    </>
  );
}
