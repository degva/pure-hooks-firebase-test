import React from 'react';
import './App.scss';
import * as firebase from 'firebase/app';
import { firebaseConfig } from './config/firebase';
import { PrincipalComponent } from './PrincipalComponent';

const App: React.FC = () => {
  firebase.initializeApp(firebaseConfig);

  return (
    <div className="App">
      <PrincipalComponent />
    </div>
  );
};
export default App;
