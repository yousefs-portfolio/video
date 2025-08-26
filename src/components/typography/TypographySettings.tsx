import React from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
  Slider,
  Paper,
  Divider,
  SelectChangeEvent,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { updateTypographySettings } from '../../store/slices/uiSlice';

export interface TypographySettingsProps {
  onClose?: () => void;
}

const TypographySettings: React.FC<TypographySettingsProps> = () => {
  const dispatch = useDispatch();
  const typographySettings = useSelector((state: RootState) => state.ui.typographySettings);

  const handleFontChange = (event: SelectChangeEvent) => {
    dispatch(updateTypographySettings({ fontFamily: event.target.value }));
  };

  const handleDyslexiaMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isDyslexiaMode = event.target.checked;
    dispatch(updateTypographySettings({
      dyslexiaMode: isDyslexiaMode,
      fontFamily: isDyslexiaMode ? 'OpenDyslexic' : 'Inter',
      letterSpacing: isDyslexiaMode ? 1.5 : 1,
      lineHeight: isDyslexiaMode ? 1.8 : 1.5,
    }));
  };

  const handleSpeedReadingMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isSpeedReading = event.target.checked;
    dispatch(updateTypographySettings({
      speedReadingMode: isSpeedReading,
      highlightCenter: isSpeedReading,
      reduceSubvocalization: isSpeedReading,
      wordsPerMinute: isSpeedReading ? 400 : 250,
    }));
  };

  const handleFontSizeChange = (_event: Event, newValue: number | number[]) => {
    dispatch(updateTypographySettings({ fontSize: newValue as number }));
  };

  const handleLineHeightChange = (_event: Event, newValue: number | number[]) => {
    dispatch(updateTypographySettings({ lineHeight: newValue as number }));
  };

  const handleLetterSpacingChange = (_event: Event, newValue: number | number[]) => {
    dispatch(updateTypographySettings({ letterSpacing: newValue as number }));
  };

  const handleWordSpacingChange = (_event: Event, newValue: number | number[]) => {
    dispatch(updateTypographySettings({ wordSpacing: newValue as number }));
  };

  const handleContrastChange = (_event: Event, newValue: number | number[]) => {
    dispatch(updateTypographySettings({ contrast: newValue as number }));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Typography Settings
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Accessibility Options
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={typographySettings?.dyslexiaMode || false}
              onChange={handleDyslexiaMode}
              color="primary"
            />
          }
          label="Dyslexia-Friendly Mode"
        />
        
        <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
          Uses OpenDyslexic font with increased spacing for better readability
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={typographySettings?.speedReadingMode || false}
              onChange={handleSpeedReadingMode}
              color="primary"
            />
          }
          label="Speed Reading Mode"
        />
        
        <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
          Optimizes text display for rapid reading with center highlighting
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Font Settings
        </Typography>
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="font-select-label">Font Family</InputLabel>
          <Select
            labelId="font-select-label"
            value={typographySettings?.fontFamily || 'Inter'}
            label="Font Family"
            onChange={handleFontChange}
            disabled={typographySettings?.dyslexiaMode}
          >
            <MenuItem value="Inter">Inter (Default)</MenuItem>
            <MenuItem value="Roboto">Roboto</MenuItem>
            <MenuItem value="Open Sans">Open Sans</MenuItem>
            <MenuItem value="Lato">Lato</MenuItem>
            <MenuItem value="Montserrat">Montserrat</MenuItem>
            <MenuItem value="OpenDyslexic">OpenDyslexic</MenuItem>
            <MenuItem value="Comic Sans MS">Comic Sans MS</MenuItem>
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Georgia">Georgia</MenuItem>
            <MenuItem value="monospace">Monospace (Code)</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Font Size: {typographySettings?.fontSize || 16}px
          </Typography>
          <Slider
            value={typographySettings?.fontSize || 16}
            onChange={handleFontSizeChange}
            min={12}
            max={24}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Line Height: {typographySettings?.lineHeight || 1.5}
          </Typography>
          <Slider
            value={typographySettings?.lineHeight || 1.5}
            onChange={handleLineHeightChange}
            min={1}
            max={2.5}
            step={0.1}
            marks
            valueLabelDisplay="auto"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Letter Spacing: {typographySettings?.letterSpacing || 0}px
          </Typography>
          <Slider
            value={typographySettings?.letterSpacing || 0}
            onChange={handleLetterSpacingChange}
            min={-1}
            max={3}
            step={0.1}
            marks
            valueLabelDisplay="auto"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Word Spacing: {typographySettings?.wordSpacing || 0}px
          </Typography>
          <Slider
            value={typographySettings?.wordSpacing || 0}
            onChange={handleWordSpacingChange}
            min={0}
            max={10}
            step={0.5}
            marks
            valueLabelDisplay="auto"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>
            Text Contrast: {typographySettings?.contrast || 100}%
          </Typography>
          <Slider
            value={typographySettings?.contrast || 100}
            onChange={handleContrastChange}
            min={50}
            max={150}
            step={10}
            marks
            valueLabelDisplay="auto"
          />
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mt: 3, p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Preview
        </Typography>
        <Typography
          paragraph
          sx={{
            fontFamily: typographySettings?.fontFamily || 'Inter',
            fontSize: `${typographySettings?.fontSize || 16}px`,
            lineHeight: typographySettings?.lineHeight || 1.5,
            letterSpacing: `${typographySettings?.letterSpacing || 0}px`,
            wordSpacing: `${typographySettings?.wordSpacing || 0}px`,
            filter: `contrast(${(typographySettings?.contrast || 100) / 100})`,
          }}
        >
          This is a preview of your typography settings. The quick brown fox jumps over the lazy dog. 
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut 
          labore et dolore magna aliqua.
        </Typography>
      </Box>
    </Paper>
  );
};

export default TypographySettings;