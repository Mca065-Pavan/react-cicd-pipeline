import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [deployTime, setDeployTime] = useState('');

  useEffect(() => {
    setDeployTime(new Date().toLocaleString());
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React CI/CD Pipeline</h1>
        <h2>Git + Jenkins + Docker + Kubernetes</h2>
        <div className="card">
          <p>Button clicked {count} times</p>
          <button onClick={() => setCount(count + 1)}>
            Click Me
          </button>
        </div>
        <div className="info">
          <p>Deployed on: <strong>Kubernetes Cluster (Minikube)</strong></p>
          <p>Deploy Time: <strong>{deployTime}</strong></p>
          <p>Pipeline: <strong>GitHub -> Jenkins -> Docker -> K8s</strong></p>
        </div>
      </header>
    </div>
  );
}

export default App;
