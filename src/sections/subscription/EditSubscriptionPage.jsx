import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import axios from 'axios';

const abonnementTypeMapping = {
  0: { label: 'Semestriel', cost: 25, duration: '6 mois' },
  1: { label: 'Mensuel', cost: 30, duration: '1 mois' },
  2: { label: 'Annuel', cost: 20, duration: '12 mois' }
};

const abonnementTypeOptions = Object.keys(abonnementTypeMapping).map((key) => (
  <MenuItem key={key} value={key}>
    {abonnementTypeMapping[key].label}
  </MenuItem>
));

const EditSubscriptionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [abonnement, setAbonnement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchAbonnement = async () => {
      try {
        const response = await axios.get(`https://localhost:7207/api/Abonnements/${id}`);
        const data = response.data;
        setAbonnement({
          ...data,
          titre: data.titre.toString() // Assurez-vous que `titre` est une chaîne de caractères
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching abonnement:', error);
        setLoading(false);
      }
    };

    fetchAbonnement();
  }, [id]);

  useEffect(() => {
    if (abonnement?.titre) {
      const selectedType = abonnementTypeMapping[abonnement.titre];
      if (selectedType) {
        setAbonnement((prev) => ({
          ...prev,
          coût: selectedType.cost,
          durée: selectedType.duration
        }));
      }
    }
  }, [abonnement?.titre]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAbonnement((prevAbonnement) => ({
      ...prevAbonnement,
      [name]: value
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!abonnement.titre) newErrors.titre = 'Le titre est requis';
    if (!abonnement.coût || Number.isNaN(Number(abonnement.coût)) || Number(abonnement.coût) <= 0) newErrors.coût = 'Le coût doit être un nombre positif';
    if (!abonnement.nbFichiers || Number.isNaN(Number(abonnement.nbFichiers)) || Number(abonnement.nbFichiers) < 0) newErrors.nbFichiers = 'Le nombre de fichiers doit être un nombre non négatif';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      const numericTitre = parseInt(abonnement.titre, 10);
      const updatedAbonnement = {
        ...abonnement,
        titre: !Number.isNaN(numericTitre) ? numericTitre : 0
      };
      await axios.put(`https://localhost:7207/api/Abonnements/${id}`, updatedAbonnement);
      navigate('/abonnement');
    } catch (error) {
      console.error('Error updating abonnement:', error);
    }
  };

  const handleCancel = () => {
    navigate('/abonnement');
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Typography variant="h4">Modifier Abonnement</Typography>
      <FormControl fullWidth margin="normal" error={!!errors.titre}>
        <InputLabel>Titre</InputLabel>
        <Select
          name="titre"
          value={abonnement.titre || ''}
          onChange={handleChange}
          label="Titre"
        >
          {abonnementTypeOptions}
        </Select>
        {errors.titre && <FormHelperText>{errors.titre}</FormHelperText>}
      </FormControl>
      <TextField
        label="Coût TND/Mois"
        name="coût"
        value={abonnement.coût || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.coût}
        helperText={errors.coût}
        type="number"
      />
      <TextField
        label="Durée"
        name="durée"
        value={abonnement.durée || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.durée}
        helperText={errors.durée}
        InputProps={{ readOnly: true }} // Rendre le champ en lecture seule
      />
      <TextField
        label="Nombre de fichiers"
        name="nbFichiers"
        value={abonnement.nbFichiers || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.nbFichiers}
        helperText={errors.nbFichiers}
        type="number"
      />
      <Button variant="outlined" color="primary" onClick={handleSave} style={{ marginLeft: '8px' }}>
        Enregistrer
      </Button>
      <Button variant="outlined" color="primary" onClick={handleCancel} style={{ marginLeft: '8px' }}>
        Annuler
      </Button>
    </div>
  );
};

EditSubscriptionPage.propTypes = {
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
};

export default EditSubscriptionPage;
