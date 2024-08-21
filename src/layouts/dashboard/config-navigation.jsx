import SvgColor from 'src/components/svg-color';

// Function to load an icon SVG
const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

// Navigation configuration
const navConfig = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Utilisateur',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Abonnement',
    path: '/abonnement',
    icon: icon('ic_cart'),
  },
  {
    title: 'Modifier Abonnement', 
    path: '/abonnement/modifier/:id', 
    icon: icon('ic_edit'), 
  },
  {
    title: 'Login',
    path: '/login',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
