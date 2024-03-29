import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';

const pages = ['Trend', 'Mentions'];

function Appbar({moveToElement}) {

    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <DocumentScannerOutlinedIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Mention Monitoring
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                      <Button
                        key='plot'
                        onClick={() => moveToElement('MentionsPlot')}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                      >
                        Trend
                      </Button>
                      <Button
                        key='table'
                        onClick={() => moveToElement('mentionsTable')}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                      >
                        Mentions
                      </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Appbar;