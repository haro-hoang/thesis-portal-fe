import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Lưu ngôn ngữ vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('i18nextLng', i18n.language);
  }, [i18n.language]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  return (
    <>
      <Button
        color="inherit"
        startIcon={<LanguageIcon />}
        onClick={handleClick}
        size="small"
        sx={{ 
          color: 'gray', 
          textTransform: 'none', 
          fontSize: '0.9rem',
          minWidth: 'auto',
          padding: '6px',
          borderRadius: '50%'
        }}
      >
        {i18n.language === 'vi' ? 'VI' : 'EN'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => changeLanguage('en')} selected={i18n.language === 'en'}>
          <ListItemText>English</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('vi')} selected={i18n.language === 'vi'}>
          <ListItemText>Tiếng Việt</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher; 