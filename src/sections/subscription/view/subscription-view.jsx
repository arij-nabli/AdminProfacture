import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import SubscriptionCard from '../subscription-card'
import SubscriptionSort from '../subscription-sort';
import SubscriptionFilters from '../subscription-filters';
import SubscriptionCartWidget from '../subscription-cart-widjet'; 


export default function SubscriptionView() {
  const [openFilter, setOpenFilter] = useState(false);
  const [abonnements, setAbonnements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get('https://localhost:44380/api/Abonnements');
        const data = response.data;
        // Accédez au tableau à l'intérieur de la clé `$values`
        const subscriptionsArray = Array.isArray(data.$values) ? data.$values : [];
        setAbonnements(subscriptionsArray);
        console.log('Data:', data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        setLoading(false);
      }
    };
  
    fetchSubscriptions();
  }, []);
  

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleDelete = (idAbonnement) => {
    setAbonnements((prevAbonnements) =>
      prevAbonnements.filter((abonnement) => abonnement.idAbonnement !== idAbonnement)
    );
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Abonnements
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ mb: 3 }}>
          <SubscriptionFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SubscriptionSort />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {abonnements.map((abonnement) => (
          <Grid key={abonnement.idAbonnement} item xs={12} sm={6} md={4} sx={{ mb: 3 }}>
            <SubscriptionCard abonnement={abonnement} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>

      <SubscriptionCartWidget />
    </Container>
  );
}