import { Route, Routes } from '@solidjs/router';
import Navbar from './components/Navbar';
import Home from './views/Home';
import Viewer from './views/Viewer';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/viewer" component={Viewer} />
      </Routes>
    </>
  );
}

export default App;
