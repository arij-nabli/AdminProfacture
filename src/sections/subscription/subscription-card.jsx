import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CheckIcon from '@mui/icons-material/Check';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import Iconify from 'src/components/iconify';
import { Link } from 'react-router-dom';
import axios from 'axios';

const abonnementTypeMapping = {
  0: 'Semestriel',
  1: 'Mensuel',
  2: 'Annuel'
};

const getDuration = (type) => {
  switch (type) {
    case 0:
      return '6 mois';
    case 1:
      return '1 mois';
    case 2:
      return '12 mois';
    default:
      return 'Non défini';
  }
};

export default function SubscriptionCard({ abonnement, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [isActif, setIsActif] = useState(abonnement.actif);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleToggleActive = async () => {
    try {
      const updatedAbonnement = { ...abonnement, actif: !isActif };
      await axios.patch(`https://localhost:7207/api/Abonnements/RendreInactif/${abonnement.idAbonnement}`, updatedAbonnement);
      setIsActif(updatedAbonnement.actif);
    } catch (error) {
      console.error('Error toggling abonnement active state:', error);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) {
      onDelete(abonnement.idAbonnement);
    }
  };

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            width: 1,
            height: 1,
            backgroundColor: 'primary.light',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" component="div">
            {abonnementTypeMapping[abonnement.titre]}
          </Typography>
        </Box>
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">
            {abonnement.coût} TND/Mois
          </Typography>
        </Stack>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckIcon />
            </ListItemIcon>
            <Typography variant="body2">Nombre de fichiers : {abonnement.nbFichiers}</Typography>
          </ListItem>
        </List>
        <Typography variant="body2" color="textSecondary">
          ID Abonnement: {abonnement.idAbonnement}
        </Typography>
        <Typography variant="body2">
          Durée : {getDuration(abonnement.titre)}
        </Typography>
        <Typography variant="body2">
          Actif : {isActif ? 'Oui' : 'Non'}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ p: 2 }}>
        <IconButton onClick={handleOpenMenu}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
        <Link to={`/abonnement/modifier/${abonnement.idAbonnement}`}>
          <IconButton>
            <Iconify icon="eva:edit-fill" />
          </IconButton>
        </Link>
        <IconButton onClick={handleDelete}>
          <Iconify icon="eva:trash-2-outline" />
        </IconButton>
      </Stack>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
       
        <MenuItem onClick={() => { handleToggleActive(); handleCloseMenu(); }}>
          <Iconify icon={isActif ? "eva:toggle-right-outline" : "eva:toggle-left-outline"} sx={{ mr: 2 }} />
          {isActif ? 'Désactiver' : 'Activer'}
        </MenuItem>
      </Popover>
    </Card>
  );
}

SubscriptionCard.propTypes = {
  abonnement: PropTypes.shape({
    idAbonnement: PropTypes.string.isRequired,
    titre: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    coût: PropTypes.number.isRequired,
    durée: PropTypes.string.isRequired,
    nbFichiers: PropTypes.number.isRequired,
    actif: PropTypes.bool.isRequired,
    dateCreation: PropTypes.string,
    dateFin: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};
