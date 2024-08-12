// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import EntireFakeStackOverflow from './components/fakestackoverflow.js'

function App() {
  return (
    <section className="fakeso">
      <EntireFakeStackOverflow />
    </section>
  );
}

export default App;
