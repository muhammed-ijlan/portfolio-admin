import { useState } from 'react';
// material
import { Container, Typography, Card, Tab, Box, Stack } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';

// components
import Page from '../components/Page';
import Designations from '../components/Designations';
import Certificates from '../components/Certificates';

export default function Configurations() {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Page title="Configurations">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4" gutterBottom>
              Configurations
            </Typography>
          </Stack>
          <Card>
            <Box sx={{ width: '100%', marginTop: '20px' }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleChange}>
                    <Tab label="Designations" value="1" />
                    <Tab label="Certificates" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <Designations />
                </TabPanel>
                <TabPanel value="2">
                  <Certificates />
                </TabPanel>
              </TabContext>
            </Box>
          </Card>
        </Container>
      </Page>
    </>
  );
}
