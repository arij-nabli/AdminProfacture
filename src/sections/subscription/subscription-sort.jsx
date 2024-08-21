import { useState } from 'react';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Mis en avant' },
  { value: 'newest', label: 'Le plus récent' },
  { value: 'priceDesc', label: 'Prix : élevé à bas' },
  { value: 'priceAsc', label: 'Prix : bas à élevé' },
];

export default function SubscriptionSort() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState('newest'); // Option sélectionnée initialement

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortOptionClick = (optionValue) => {
    setSelectedOption(optionValue);
    handleClose();
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={handleOpen}
        endIcon={<Iconify icon={anchorEl ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Trier par :&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {SORT_OPTIONS.find((option) => option.value === selectedOption)?.label}
        </Typography>
      </Button>

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            [`& .${listClasses.root}`]: {
              p: 0,
            },
          },
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === selectedOption}
            onClick={() => handleSortOptionClick(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
