import React, { useState } from 'react';
import InfluencerForm from './components/InfluencerForm.tsx';
import InfluencerList from './components/InfluencerList.tsx';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
	const [refreshList, setRefreshList] = useState(false); // To refresh the list on Influencer creation
	const [filter, setFilter] = useState(''); // Lifted state for the filter

	return (
		<Router>
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

				<Routes>
					<Route path="/create" element={<InfluencerForm refreshListProp={setRefreshList} />} />
					<Route
						path="/list"
						element={
							<InfluencerList
								refreshListProp={refreshList}
								setRefreshListProp={setRefreshList}
								filter={filter} // Pass the filter as a prop
								setFilter={setFilter} // Pass the filter setter as a prop
							/>
						}
					/>
					<Route
						path="/"
						element={
							<InfluencerList
								refreshListProp={refreshList}
								setRefreshListProp={setRefreshList}
								filter={filter} // Pass the filter as a prop
								setFilter={setFilter} // Pass the filter setter as a prop
							/>
						}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
