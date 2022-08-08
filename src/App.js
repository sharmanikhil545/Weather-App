import logo from './logo.svg';
import './App.css';
import './component.css';
import { WeatherData } from './WeatherData';

function App() {
  
  return (
    <div className="App">
      {/* <h1>Weather Application</h1> */}
      <WeatherData></WeatherData>
    </div>
  );
}

export default App;
