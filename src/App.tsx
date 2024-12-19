import React from 'react';
import InfluencerForm from './components/InfluencerForm.tsx'; // Import the form
import InfluencerList from './components/InfluencerList.tsx';


function App() {
	return (
		<div className="App"> {/*Consider using better className than App here*/}
			<InfluencerForm /> {/* Render the form */}
			<InfluencerList />
			
		</div>
	);
}

export default App;

