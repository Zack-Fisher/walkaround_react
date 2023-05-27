import logo from './logo.svg';
import './App.css';
import GameScreen from './components/game_screen';
import { EntityProvider } from './providers/entity_provider';
import { Ticker } from './components/ticker';

function App() {
  return (
    <div className="App">
        <Ticker fps={60} />
        <EntityProvider>
            <GameScreen />
        </EntityProvider>
    </div>
  );
}

export default App;
