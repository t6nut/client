import React, { useState } from 'react';
import InfluencerForm from './components/InfluencerForm.tsx';
import InfluencerList from './components/InfluencerList.tsx';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
});

function App() {
	const [refreshList, setRefreshList] = useState(false); // To refresh the list on Influencer creation
	const [filter, setFilter] = useState(''); // Lifted state for the filter

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline /> {/* Ensures consistent styling in dark mode */}
			<Router>
				<Box
					component="nav"
					sx={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100%',
						display: 'flex',
						justifyContent: 'center',
						gap: 2,
						padding: 2,
						backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent background for better contrast
						zIndex: 1000, // Ensure it stays on top
					}}
				>
					<Button
						component={NavLink}
						to="/create"
						sx={{
							textTransform: 'none',
							backgroundColor: 'transparent',
							color: '#ebff08',
							border: '1px solid transparent',
							'&.active': {
								opacity: 1,
								border: '1px solid #ebff08',
							},
						}}
					>
						Create Influencer
					</Button>
					<Button
						component={NavLink}
						to="/list"
						sx={{
							textTransform: 'none',
							backgroundColor: 'transparent',
							color: '#ebff08',
							border: '1px solid transparent',
							'&.active': {
								opacity: 1,
								border: '1px solid #ebff08',
							},
						}}
					>
						List Influencers
					</Button>
				</Box>

				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100vh',
						paddingTop: '80px', // Adjust to account for the fixed nav height
					}}
				>
					<Routes>
						<Route
							path="/create"
							element={<InfluencerForm refreshListProp={setRefreshList} />}
						/>
						<Route
							path="/list"
							element={
								<InfluencerList
									refreshListProp={refreshList}
									setRefreshListProp={setRefreshList}
									filter={filter}
									setFilter={setFilter}
								/>
							}
						/>
						<Route
							path="/"
							element={
								<InfluencerList
									refreshListProp={refreshList}
									setRefreshListProp={setRefreshList}
									filter={filter}
									setFilter={setFilter}
								/>
							}
						/>
					</Routes>
				</Box>
			</Router>
		</ThemeProvider>
	);
}

export default App;
