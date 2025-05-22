import React from 'react';
import { Box, IconButton, TextField, Stack, Typography, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const ParamCreator = ({params, setParams}) => {

  const handleAdd = () => {
    setParams([...params, { parameter: '', type: '' }]);
  };

  const handleDelete = (index) => {
    const updated = [...params];
    updated.splice(index, 1);
    setParams(updated);
  };

  const handleChange = (index, key, value) => {
    const updated = [...params];
    updated[index][key] = value;
    setParams(updated);
  };

  // Common data types for parameters
  const paramTypes = [
    { value: 'string', label: 'String' },
    { value: 'number', label: 'Number' },
    { value: 'integer', label: 'Integer' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'array', label: 'Array' },
    { value: 'object', label: 'Object' },
    { value: 'date', label: 'Date' },
    { value: 'time', label: 'Time' }
  ];

  const textFieldSx = { 
    flex: 1,
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(147, 112, 219, 0.3)' },
      '&:hover fieldset': { borderColor: 'rgba(147, 112, 219, 0.5)' },
      '&.Mui-focused fieldset': { borderColor: '#9C27B0' },
    },
    '& .MuiInputLabel-root': { color: '#BB86FC' },
    '& .MuiInputBase-input': { color: '#FFFFFF' },
    '& .MuiSelect-icon': { color: '#BB86FC' }
  };

  return (
    <Box sx={{ marginBottom: '20px' }}>
      <Typography variant="h7" sx={{ marginBottom: '10px', fontWeight: 'bold', color: '#BB86FC', display: 'block' }}>
        Define Strategy Parameters:
      </Typography>
      
      <Stack spacing={2}>
        {params.map((param, index) => (
          <Box key={index} display="flex" alignItems="center" gap={2}>
            <TextField
              label="Parameter Name"
              value={param.parameter}
              onChange={(e) => handleChange(index, 'parameter', e.target.value)}
              sx={textFieldSx}
            />

            <TextField
              select
              label="Parameter Type"
              value={param.type}
              onChange={(e) => handleChange(index, 'type', e.target.value)}
              sx={textFieldSx}
            >
              {paramTypes.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{ color: '#1A0033' }}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {index === params.length - 1 ? (
              <IconButton onClick={handleAdd} sx={{ color: '#BB86FC' }}>
                <AddIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => handleDelete(index)} sx={{ color: '#f44336' }}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default ParamCreator;
