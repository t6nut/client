// App.tsx
import React, { useState } from 'react';
import InfluencerForm from './components/InfluencerForm.tsx';
import InfluencerList from './components/InfluencerList.tsx';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import routing components

function App() {
	const [refreshList, setRefreshList] = useState(false); //To refresh the list on Influencer creation
	return (
		<Router> {/* Wrap your app in a Router */}
			<div>
				<nav>
					<ul>
						<li>
							<Link to="/create">Create Influencer</Link>
						</li>
						<li>
							<Link to="/list">List Influencers</Link>
						</li>
					</ul>
				</nav>

				<Routes> {/* Use Routes to define your routes */}
					<Route path="/create" element={<InfluencerForm refreshListProp={setRefreshList} />} />
					<Route path="/list" element={<InfluencerList refreshListProp={refreshList} setRefreshListProp={setRefreshList} />} />
					<Route path="/" element={<InfluencerList refreshListProp={refreshList} setRefreshListProp={setRefreshList} />} />
				</Routes>

			</div>
		</Router>
	);
}

export default App;

